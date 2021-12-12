<template>
  <div class="mv_container">
    <section class="mv_top">
      <!-- 左侧mv盒子 -->
      <div class="mv_box">
        <!-- mv播放区 -->
        <div class="mv_play">
          <!-- mv名称 -->
          <h2 class="mvName"><span class="mvIcon">MV</span>{{ mvMsg.name }}</h2>
          <video
            controls
            ref="video"
            :src="mvUrl"
            :poster="mvMsg.cover"
            @play="play"
            autoplay
          ></video>
        </div>
        <!-- mv介绍区 -->
        <div class="mv_detail">
          <!-- 作者 -->
          <p class="author">
            <img :src="autorMsg.picUrl" alt="" /><span class="authorName">{{
              mvMsg.artistName
            }}</span>
          </p>
          <!-- 发布时间 -->
          <span class="small">{{ mvMsg.publishTime }}</span>
          <!-- 介绍 -->
          <p class="small">{{ autorMsg.briefDesc || "暂无介绍" }}</p>
        </div>
      </div>
      <!-- 右侧推荐MV -->
      <div class="mv_recommend">
        <h3>相关推荐</h3>
        <div class="mv_wrap">
          <div class="mvBox" v-for="(mv, index) in mvList" :key="index">
            <div class="mvBox_Img">
              <img :src="mv.cover" />
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
    </section>
    <!-- 评论mv -->
    <section class="conmentWrap">
      <!-- 热么评论 -->
      <div class="Comment">
        <h4>
          热门评论(<span>{{ hotAll }}</span
          >)
        </h4>
        <section class="commentBox" v-for="(item, index) in hot" :key="index">
          <!-- 评论者头像 -->
          <div class="img">
            <img :src="item.user.avatarUrl" alt="" />
          </div>
          <!-- 评论区 -->
          <section class="comments">
            <p class="mainComment">
              <span class="name">{{ item.user.nickname }}:</span><br />{{
                item.content
              }}
            </p>
            <!-- 回复区 -->
            <p class="reply" v-if="item.beReplied.length">
              <span class="name">{{ item.beReplied[0].user.nickname }}: </span
              >{{ item.beReplied[0].content }}
            </p>
            <p class="small">{{ $store.getters.formatDay(item.time) }}</p>
          </section>
        </section>
      </div>
      <!-- 最新评论 -->
      <div class="Comment">
        <h4>
          最新评论(<span>{{ newAll }}</span
          >)
        </h4>
        <section class="commentBox" v-for="(item, index) in news" :key="index">
          <!-- 评论头像 -->
          <div class="img">
            <img :src="item.user.avatarUrl" />
          </div>
          <!-- 评论区 -->
          <section class="comments">
            <p class="mainComment">
              <span class="name">{{ item.user.nickname }}:</span><br />{{
                item.content
              }}
            </p>
            <!-- 回复区 也判断一下有无回复 -->
            <p class="reply" v-if="item.beReplied.length">
              <span class="name">{{ item.beReplied[0].user.nickname }}:</span
              >{{ item.beReplied[0].content }}
            </p>
            <p class="small">{{ $store.getters.formatDay(item.time) }}</p>
          </section>
        </section>
        <!-- 如果评论少于10就隐藏掉分页器 -->
        <el-pagination
          v-if="newAll > 10"
          background
          layout="prev, pager, next"
          :total="newAll"
          :current-page="page"
          @current-change="update"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "MvList",
  data() {
    return {
      // mv播放链接
      mvUrl: "",
      //   mv信息
      mvMsg: [],
      //   作者信息
      autorMsg: [],
      //   相关mv
      mvList: [],

      // 当前分页
      page: 1,

      // hot评论总数
      hotAll: 0,
      // hot评论
      hot: [],
      // new评论总数
      newAll: 0,
      // hot评论
      news: [],
    };
  },
  methods: {
    //   推荐mv同页面跳转，replace
    // 跳转mv详情路由 并且传id
    toMvList(id, artistId) {
      this.$router.replace({
        path: "/mvlist",
        query: {
          id,
          artistId,
        },
      });
    },
    //   获取推荐mv
    getMvList() {
      requestWyy({
        url: "/simi/mv",
        params: {
          mvid: this.$route.query.id,
        },
      }).then(({ data: { mvs } }) => {
        this.mvList = mvs;
      });
    },
    //   获取mv是播放地址
    getMv() {
      requestWyy({
        url: "/mv/url",
        params: {
          //   接收传来的MVid
          id: this.$route.query.id,
        },
      }).then(({ data: { data } }) => {
        this.mvUrl = data.url;
      });
    },
    // 获取mv的相关信息
    getMvMsg() {
      requestWyy({
        url: "/mv/detail",
        params: {
          mvid: this.$route.query.id,
        },
      }).then(({ data: { data } }) => {
        this.mvMsg = data;
      });
    },
    // 获取歌手信息
    getManMsg() {
      requestWyy({
        url: "/artists",
        params: {
          //   接收传来的歌手id
          id: this.$route.query.artistId,
        },
      }).then(({ data }) => {
        this.autorMsg = data.artist;
      });
    },
    // 获取mv评论
    getCommpent() {
      requestWyy({
        url: "/comment/mv",
        params: {
          //   接收传来的MVid
          id: this.$route.query.id,
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then(({ data }) => {
        //   最新评论数量
        this.newAll = data.total;
        // z最新评论列表
        this.news = data.comments;
        // hot评论数量
        this.hotAll = data.hotComments.length;
        // hot评论列表
        this.hot = data.hotComments;
      });
    },
    // 改变分页器页数更新评论
    update(cru) {
      this.page = cru;
      this.getCommpent();
    },
    play() {
      this.$store.commit("playVideo");
    },
  },
  // 在渲染完成后拿到video 方便后续操作
  mounted() {
    this.$store.state.ref.video = this.$refs.video;
    console.log();
  },
  watch: {
    //   监控mv数据，变化 重新调用接口
    "$route.query.id": {
      // 相当于create
      immediate: true,
      handler() {
        this.getMv();
        this.getMvMsg();
        this.getManMsg();
        this.getMvList();
        this.getCommpent();
      },
    },
  },
};
</script>

<style lang="less" scoped>
.mv_container {
  min-width: 500px;
  .mv_top {
    display: flex;
    justify-content: space-around;
    .mv_box {
      width: 60%;
      min-width: 500px;
      .mv_play {
        .mvName {
          margin-bottom: 30px;
        }
        video {
          width: 100%;
          height: 300px;
        }
      }
      .mv_detail {
        .author {
          margin: 10px 0;
          img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
          }
          .authorName {
            margin-left: 10px;
            font-size: 20px;
          }
        }

        p.small {
          margin-top: 10px;
          color: rgb(136, 135, 135);
        }
      }
    }
    .mv_recommend {
      .mv_wrap {
        display: block;
        .mvBox {
          display: flex;
          align-items: center;
          width: 350px;
          height: 100px;
          .mvBox_Img {
            margin-right: 10px;
            img {
              border-radius: 10px;
              width: 140px;
              height: 80px;
            }
            span.time {
              bottom: 0;
            }
          }
          .mvBox_Msg {
            width: 150px;
          }
        }
      }
    }
  }
  .conmentWrap {
    margin-top: 30px;
  }
  h3 {
    margin: 0 0 20px 0;
  }
}
</style>