<template>
  <div class="discover_container">
    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in bannersImg" :key="index">
        <img :src="item.imageUrl" :title="item.typeTitle" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="midSong">
      <h3>推荐歌单</h3>
      <el-row>
        <el-col
          :span="4"
          v-for="(song, index) in songMsg"
          :key="index"
          :offset="index > 0 ? 1 : 0"
        >
          <el-card
            :body-style="{ padding: '0px' }"
            class="pointer"
            @click.native="toSongList(song.id)"
          >
            <img :src="song.picUrl" class="image" />
            <div class="songName">
              <span>{{ song.name }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 最新音乐 -->
    <div class="newSong">
      <h3>最新歌单</h3>
      <div class="songWrap">
        <div class="newSong_box" v-for="(song, index) in songList" :key="index">
          <div class="newSong_boxImg">
            <img :src="song.picUrl" alt="" />
            <span
              class="el-icon-video-play iconPlay"
              @click="player(song.id, song.name)"
            ></span>
          </div>
          <div class="newSong_msg">
            <p>{{ song.name }}</p>
            <p>{{ song.song.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="footMv">
      <h3>推荐MV</h3>
      <div class="mv_wrap">
        <!-- 点击每一个mv跳转到mv详情路由组件 并且携带数据过去 -->
        <div class="mvBox" v-for="(mv, index) in mvList" :key="index">
          <div class="mvBox_Img">
            <img :src="mv.picUrl" alt="" />
            <i class="el-icon-caret-right">{{
              mv.playCount > 100000 ? "10w+" : mv.playCount
            }}</i>
            <span
              class="el-icon-video-play iconPlay"
              @click="toMvList(mv.id, mv.artistId)"
            ></span>
            <span class="time">{{
              $store.getters.formatDate(mv.duration)
            }}</span>
          </div>
          <div class="mvBox_Msg">
            <p>{{ mv.name }}</p>
            <p>{{ mv.artistName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestWyy } from "../request/app";

export default {
  name: "Discover",
  // 一开始就调用接口获取数据
  created() {
    // 轮播图调取接口
    requestWyy({
      url: "/banner",
    }).then((res) => {
      this.bannersImg = res.data.banners;
    });

    //推荐歌单接口
    requestWyy({
      url: "/personalized",
      params: {
        limit: 5,
      },
    }).then((res) => {
      this.songMsg = res.data.result;
    });

    // 最新音乐接口
    requestWyy({
      url: "/personalized/newsong",
      params: {
        limit: 12,
      },
    }).then((res) => {
      this.songList = res.data.result;
    });

    // 最新MV
    requestWyy({
      url: "/personalized/mv",
    }).then((res) => {
      this.mvList = res.data.result;
    });
  },
  data() {
    return {
      // 轮播图
      bannersImg: [],
      // 歌单
      songMsg: [],
      // 最新歌曲
      songList: [],
      // 最新Mv
      mvList: [],
    };
  },

  methods: {
    // 播放歌曲 调用全局播放事件
    player(id, name) {
      this.$store.dispatch("aPlay", { id, name });
    },

    // 点击歌单。拿到id传给歌单组件
    toSongList(id) {
      this.$router.push({
        path: "/songlist",
        query: {
          id,
        },
      });
    },

    // 跳转mv详情路由 并且传id
    toMvList(id, artistId) {
      this.$router.push({
        path: "/mvlist",
        query: {
          id,
          artistId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped >
.songName {
  height: 40px;
  font-size: 14px;
}
.newSong {
  .songWrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .newSong_box {
      display: flex;
      height: 80px;
      width: 45%;
      margin-right: 10px;
      margin-bottom: 10px;
      .newSong_boxImg {
        position: relative;
        width: 80px;
        height: 80px;
        .iconPlay {
          font-size: 20px;
        }
        &:hover .iconPlay {
          opacity: 1;
        }
      }
      .newSong_msg {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 10px;
        p:last-child {
          font-size: 15px;
          color: rgb(175, 175, 175);
        }
      }
      &:hover {
        background-color: #ccc;
      }
    }
  }
}
</style>
