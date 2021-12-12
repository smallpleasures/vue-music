<template>
  <div class="detail_container">
    <!-- 歌单的介绍 -->
    <section class="detail_top">
      <!-- 歌单的图 -->
      <div class="top_left">
        <img :src="playMsg.coverImgUrl" />
      </div>
      <!-- 歌单的具体介绍 -->
      <section class="top_right">
        <h2 class="title">{{ playMsg.name }}</h2>
        <!-- 创建的时间,具体到日期就行 -->
        <p class="itme_msg">
          <img :src="playMsg.creator.avatarUrl" alt="" />
          <span>{{ playMsg.creator.nickname }}</span
          ><span class="small">{{
            $store.getters.formatDay(playMsg.createTime, "xxxx-mm-dd")
          }}</span
          >创建
        </p>
        <!-- 标签 -->
        <div class="tag">
          标签：<span class="small">
            <span v-for="(tag, index) in playMsg.tags" :key="index"
              >{{ tag }}、</span
            >
            <!-- 如果没有标签，就弄成暂无 -->
            <span v-if="!playMsg.tags.length">暂无</span>
          </span>
        </div>
        <!-- 简介 -->
        <p class="content">
          简介：<span class="small">{{ playMsg.description }}</span>
        </p>
      </section>
    </section>
    <el-tabs v-model="activeName" class="detail_bottom">
      <el-tab-pane label="歌曲列表" name="first">
        <!-- 歌曲列表 -->
        <table>
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="T_row" v-for="(song, index) in tracks" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="songImg">
                  <!-- 点击这里播发歌曲 -->
                  <img :src="song.al.picUrl" /><span
                    class="el-icon-video-play iconPlay"
                    @click="player(song.id, song.name)"
                  ></span>
                </div>
              </td>
              <td>
                {{ song.name }}
                <!-- 点击mv图案跳转到mv详情页 -->
                <span
                  v-if="song.mv != 0"
                  class="pointer mv el-icon-video-camera"
                  @click="toMvList(song.mv, song.ar[0].id)"
                ></span>
              </td>
              <td>{{ song.ar[0].name }}</td>
              <td>{{ song.al.name }}</td>
              <td>{{ $store.getters.formatDate(song.dt) }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <!-- 歌曲评论 -->
      <el-tab-pane label="评论" name="fourth">
        <section class="conmentWrap">
          <!-- 热么评论 -->
          <div class="Comment">
            <h4>
              热门评论(<span>{{ hotAll }}</span
              >)
            </h4>
            <section
              class="commentBox"
              v-for="(item, index) in hot"
              :key="index"
            >
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
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}:</span
                  >{{ item.beReplied[0].content }}
                </p>
                <p class="small">{{ $store.getters.formatDay(item.time) }}</p>
              </section>
            </section>
            <!-- 如果最热评论少于10就隐藏掉分页器 -->
            <el-pagination
              v-if="hotAll > 10"
              background
              layout="prev, pager, next"
              :total="hotAll"
              :current-page="hotPage"
              @current-change="hotUpdate"
            />
          </div>
          <!-- 分隔线 -->
          <el-divider
            ><i class="el-icon-caret-bottom"></i
            ><i class="el-icon-caret-bottom"></i
            ><i class="el-icon-caret-bottom"></i
            ><i class="el-icon-caret-bottom"></i
          ></el-divider>
          <!-- 最新评论 -->
          <div class="Comment">
            <h4>
              最新评论(<span>{{ newAll }}</span
              >)
            </h4>
            <section
              class="commentBox"
              v-for="(item, index) in news"
              :key="index"
            >
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
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}:</span
                  >{{ item.beReplied[0].content }}
                </p>
                <p class="small">{{ $store.getters.formatDay(item.time) }}</p>
              </section>
            </section>
            <!-- 如果最热评论少于10就隐藏掉分页器 -->
            <el-pagination
              v-if="newAll > 10"
              background
              layout="prev, pager, next"
              :total="newAll"
              :current-page="newPage"
              @current-change="newUpdate"
            />
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 导入 requestWyy
import { requestWyy } from "../request/app";
export default {
  name: "SongList",
  data() {
    return {
      activeName: "first",
      // 接收歌单的上方介绍信息
      playMsg: [],
      // 歌单下的歌曲
      tracks: [],

      // hot评论总数
      hotAll: 0,
      // hot评论
      hot: [],
      // 最热评论分页当前页
      hotPage: 1,

      // new评论总数
      newAll: 0,
      // hot评论
      news: [],
      // 最新评论分页当前页
      newPage: 1,
    };
  },
  methods: {
    getMsg() {
      requestWyy({
        url: "/playlist/detail",
        params: {
          id: this.$route.query.id,
        },
      }).then(({ data }) => {
        // console.log(data);
        this.playMsg = data.playlist;
        this.tracks = data.playlist.tracks;
      });
    },
    // 获取最热评论
    getHotComment() {
      // hot评论
      requestWyy({
        url: "/comment/hot",
        params: {
          id: this.$route.query.id,
          limit: 10,
          type: 2,
          offset: (this.hotPage - 1) * 10,
        },
      }).then(({ data }) => {
        this.hotAll = data.total;
        this.hot = data.hotComments;
      });
    },
    // 获取最新评论
    getNewComment() {
      // new评论
      requestWyy({
        url: "/comment/playlist",
        params: {
          id: this.$route.query.id,
          limit: 10,
          offset: (this.newPage - 1) * 10,
        },
      }).then(({ data }) => {
        this.newAll = data.total;
        this.news = data.comments;
      });
    },
    // 最热评论分页操作
    hotUpdate(cur) {
      this.hotPage = cur;
      this.getHotComment();
    },
    // 最新评论分页操作
    newUpdate(cur) {
      this.newPage = cur;
      this.getNewComment();
    },

    // 播放歌曲 调用全局播放事件
    player(id, name) {
      this.$store.dispatch("aPlay", { id, name });
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

  watch: {
    "$route.query.id": {
      // 进入歌单组件就开始调用接口
      immediate: true,
      handler() {
        this.getMsg();
        this.getHotComment();
        this.getNewComment();
      },
    },
  },
};
</script>

<style lang="less" scoped>
.detail_container {
  .detail_top {
    display: flex;
    margin: 20px 0;
    .top_left {
      img {
        width: 200px;
        height: 200px;
      }
      margin-right: 20px;
    }
    .top_right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        font-size: 20px;
      }
      .itme_msg {
        img {
          width: 25px;
          height: 25px;
          border-radius: 100%;
        }
        span {
          margin: 0 10px;
        }
      }
      .content {
        font-size: 15px;
      }
    }
  }
}
</style>
