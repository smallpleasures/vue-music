<template>
  <section class="myhome">
    <div class="userMsg">
      <div class="headPic">
        <img :src="$store.state.login.userInfo.avatarUrl" alt="" />
      </div>
      <div class="rightMsg">
        <section class="userDetail">
          <span class="nickName">{{
            $store.state.login.userInfo.nickname
          }}</span>
          <span class="Lv">{{ detail.level }}</span>
          <span
            :class="
              detail.gender == 1
                ? 'el-icon-male'
                : gender == 0
                ? 'el-icon-female'
                : ''
            "
          ></span>
        </section>
        <el-divider />
        <section class="follow small">
          <span class="following"
            ><span>{{ detail.follows }}</span
            >关注</span
          >
          <span class="followed"
            ><span>{{ detail.followed }}</span
            >粉丝</span
          >
        </section>
        <section class="myMsg small">
          <p>
            个人介绍:<span>{{ detail.signature }}</span>
          </p>
          <p>
            创建日期:<span>{{
              $store.getters.formatDay(detail.createTime)
            }}</span>
          </p>
        </section>
      </div>
    </div>
    <div class="mysongList">
      <p class="myTitle">
        我创建/收藏的歌单<span>({{ songList.length }})</span>
      </p>
      <div class="song_wrap">
        <div
          class="song_box pointer"
          v-for="(song, index) in songList"
          @click="toSongList(song.id)"
          :key="index"
        >
          <div class="song_boxImg">
            <p>播放量:{{ song.playCount }}</p>
            <img :src="song.coverImgUrl" alt="" />
          </div>
          <p class="song_boxTitle">{{ song.name }}</p>
        </div>
      </div>
      <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="pages"
      @current-change="update"
      :current-page="this.curPage"
    >
    </el-pagination> -->
    </div>
  </section>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "MyHome",
  data() {
    return {
      detail: {
        gender: 1,
        signature: "",
        level: "",
        createTime: "",
        listenSongs: "",
        follows: "",
        followed: "",
      },
      songList: [],
    };
  },

  mounted() {
    // 用户信息
    requestWyy({
      url: "/user/detail",
      params: {
        uid: this.$store.state.login.userInfo.userId,
      },
    }).then(({ data }) => {
      // 性别获取
      this.detail.gender = data.profile.gender;
      this.detail.signature = data.profile.signature;
      this.detail.follows = data.profile.follows;
      this.detail.followed = data.profile.followeds;
      // 等级
      this.detail.level = data.level;
      this.detail.createTime = data.createTime;
      this.detail.listenSongs = data.listenSongs;
    });
    // 歌单信息
    requestWyy({
      url: "/user/playlist",
      params: {
        uid: this.$store.state.login.userInfo.userId,
      },
    }).then(({ data }) => {
      console.log(data);
      this.songList = data.playlist;
    });
  },
  methods: {
    // 点击歌单。拿到id传给歌单组件
    toSongList(id) {
      this.$router.push({
        path: "/songlist",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.myhome {
  .userMsg {
    display: flex;
    margin: 20px 0;
    .headPic {
      margin-right: 30px;
      padding: 3px;
      border: 1px solid #ccc;
      img {
        width: 180px;
        height: 180px;
      }
    }
    .rightMsg {
      width: 100%;
      .userDetail {
        .nickName {
          font-size: 22px;
        }
        .Lv {
          display: inline-block;
          position: relative;
          margin: 0 20px;
          color: rgb(223, 3, 3);
          line-height: 20px;
          width: 40px;
          height: 20px;
          border-radius: 20px;
          border: 1px solid rgb(216, 0, 0);
          &::before {
            content: "Lv";
            margin-left: 5px;
          }
        }
        .el-icon-male {
          color: #409eff;
          font-size: 20px;
          font-weight: bold;
        }
        .el-icon-female {
          color: pink;
          font-size: 20px;
          font-weight: bold;
        }
      }
      .follow {
        display: flex;
        margin-top: 0;
        span {
          display: block;
          span {
            font-size: 30px;
            color: #000;
          }
        }
        span.following {
          padding-right: 20px;
          margin-right: 20px;
          border-right: 1px solid #ccc;
        }
      }
      .myMsg {
        p:first-child {
          margin: 10px 0;
        }
        span {
          margin-left: 10px;
        }
      }
    }
  }
  .mysongList {
    .myTitle {
      font-size: 20px;
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 3px solid #409eff;

      span {
        margin-left: 10px;
      }
    }
  }
}
</style>