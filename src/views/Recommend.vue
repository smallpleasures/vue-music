<template>
  <div class="recommandList">
    <div class="introduce_box">
      <div class="left_msg">
        <img :src="listDescribe.coverImgUrl" alt="" />
        <div class="tilteMsg">
          <span class="pointer">精品歌单</span>
          <h4>
            {{ listDescribe.copywriter }}
          </h4>
          <p>
            {{ listDescribe.description }}
          </p>
        </div>
      </div>
      <div class="bg_mask">
        <div></div>
        <img :src="listDescribe.coverImgUrl" class="bg_img" alt="" />
      </div>
    </div>
    <div class="listClass">
      <ul class="small">
        <li :class="{ active: tag == '全部' }" @click="tag = '全部'">全部</li>
        <li :class="{ active: tag == '欧美' }" @click="tag = '欧美'">欧美</li>
        <li :class="{ active: tag == '华语' }" @click="tag = '华语'">华语</li>
        <li :class="{ active: tag == '流行' }" @click="tag = '流行'">流行</li>
        <li :class="{ active: tag == '说唱' }" @click="tag = '说唱'">说唱</li>
        <li :class="{ active: tag == '摇滚' }" @click="tag = '摇滚'">摇滚</li>
        <li :class="{ active: tag == '民谣' }" @click="tag = '民谣'">民谣</li>
        <li :class="{ active: tag == '电子' }" @click="tag = '电子'">电子</li>
        <li :class="{ active: tag == '轻音乐' }" @click="tag = '轻音乐'">
          轻音乐
        </li>
        <li :class="{ active: tag == '影视原声' }" @click="tag = '影视原声'">
          影视原声
        </li>
        <li :class="{ active: tag == 'ACG' }" @click="tag = 'ACG'">ACG</li>
        <li :class="{ active: tag == '怀旧' }" @click="tag = '怀旧'">怀旧</li>
      </ul>
    </div>
    <!-- 各个歌单 -->
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
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pages"
      @current-change="update"
      :current-page="this.curPage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "Recommend",

  data() {
    return {
      // 点击高亮
      tag: "全部",
      // 歌单的相关介绍
      listDescribe: [],

      // 歌单列表
      songList: [],
      // 设置分页组件的最大页数
      pages: 1,
      // 当前页码
      curPage: 1,
    };
  },

  // 监听点击分类，调取最新数据
  watch: {
    tag: {
      // 一开始调用一次
      immediate: true,
      handler() {
        // 歌单介绍接口
        this.topData();

        // 重新点击分类，初始化当前页数
        this.curPage = 1;

        // 歌单列表接口
        this.listData();
      },
    },
  },
  methods: {
    topData() {
      // 歌单介绍接口
      requestWyy({
        url: "/top/playlist/highquality",
        params: {
          limit: 1,
          cat: this.tag,
        },
      }).then((res) => {
        this.listDescribe = res.data.playlists[0];
      }),
        (error) => {
          this.$message.error("服务器好像出了些问题~");
        };
    },
    listData() {
      // 歌单列表接口
      requestWyy({
        url: "/top/playlist/",
        params: {
          limit: 10,
          offset: (this.curPage - 1) * 10,
          cat: this.tag,
        },
      }).then((res) => {
        this.songList = res.data.playlists;
        // 获取页数
        this.pages = res.data.total;
      }),
        (error) => {
          this.$message.error("服务器好像出了些问题~");
        };
    },

    // 页码改变设置偏移
    update(cur) {
      this.curPage = cur;
      this.listData();
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
  },
};
</script>

<style lang="less" scoped>
.recommandList {
  min-width: 1000px;
  .introduce_box {
    position: relative;
    display: flex;
    height: 200px;
    overflow: hidden;
    .left_msg {
      z-index: 3;
      display: flex;
      margin: 20px;
      width: 100%;
      img {
        width: 160px;
        height: 160px;
        border-radius: 10px;
        margin-right: 20px;
      }
      .tilteMsg {
        span {
          height: 30px;
          padding: 3px 20px;
          border-radius: 5px;
          color: rgb(223, 172, 103);
          border: 1px solid rgb(223, 172, 103);
        }
        h4 {
          color: #fff;
          margin: 10px 0 5px 0;
        }
        p {
          color: #ccc;
          font-size: 13px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
        }
      }
    }
  }
  .bg_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    div {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background-color: rgba(0, 0, 0, 0.707);
      z-index: 1;
    }
    .bg_img {
      width: 100%;
      height: 100%;
      filter: blur(5px);
    }
  }
}
</style>