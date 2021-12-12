<template>
  <div class="mvs-container">
    <div class="filter_wrap">
      <div class="place_wrap">
        <span class="wrap_title">地区: </span>
        <ul class="small">
          <li :class="{ active: area == '全部' }" @click="area = '全部'">
            全部
          </li>
          <li :class="{ active: area == '内地' }" @click="area = '内地'">
            内地
          </li>
          <li :class="{ active: area == '港台' }" @click="area = '港台'">
            港台
          </li>
          <li :class="{ active: area == '欧美' }" @click="area = '欧美'">
            欧美
          </li>
          <li :class="{ active: area == '日本' }" @click="area = '日本'">
            日本
          </li>
          <li :class="{ active: area == '韩国' }" @click="area = '韩国'">
            韩国
          </li>
        </ul>
      </div>
      <div class="type_wrap">
        <span class="wrap_title">类型:</span>
        <ul class="small">
          <li :class="{ active: type == '全部' }" @click="type = '全部'">
            全部
          </li>
          <li :class="{ active: type == '官方版' }" @click="type = '官方版'">
            官方版
          </li>
          <li :class="{ active: type == '原声' }" @click="type = '原声'">
            原声
          </li>
          <li :class="{ active: type == '现场版' }" @click="type = '现场版'">
            现场版
          </li>
          <li
            :class="{ active: type == '网易出品' }"
            @click="type = '网易出品'"
          >
            网易出品
          </li>
        </ul>
      </div>
      <div class="order_wrap">
        <span class="wrap_title">排序:</span>
        <ul class="small">
          <li
            :class="{ active: order == '上升最快' }"
            @click="order = '上升最快'"
          >
            上升最快
          </li>
          <li :class="{ active: order == '最热' }" @click="order = '最热'">
            最热
          </li>
          <li :class="{ active: order == '最新' }" @click="order = '最新'">
            最新
          </li>
        </ul>
      </div>
    </div>
    <div class="mv_wrap">
      <div class="mvBox" v-for="(song, index) in songMsg" :key="index">
        <div class="mvBox_Img">
          <img :src="song.cover" alt="" />
          <i class="el-icon-caret-right">{{
            song.playCount > 100000 ? "10w+" : song.playCount
          }}</i>
          <!-- 点击播放按钮跳转mv详情 -->
          <span
            class="el-icon-video-play iconPlay"
            @click="toMvList(song.id, song.artistId || 854363)"
          ></span>
          <span class="time">{{
            $store.getters.formatDate(song.duration)
          }}</span>
        </div>
        <div class="mvBox_Msg">
          <p>{{ song.name }}</p>
          <p>{{ song.artistName }}</p>
        </div>
      </div>
    </div>
    <!-- 加载图标 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="8"
      :total="total"
      :current-page="page"
      @current-change="update"
    />
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "Mv",

  data() {
    return {
      // 歌曲信息
      songMsg: [],
      // 符合要求全部歌曲数
      total: 0,
      // 当前页码
      page: 1,
      // 页容量
      limit: 8,
      // 地区
      area: "全部",
      type: "全部",
      order: "上升最快",
    };
  },
  methods: {
    getSong() {
      requestWyy({
        url: "/mv/all",
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          limit: this.limit,
          offset: (this.page - 1) * 8,
        },
      }).then(({ data }) => {
        this.songMsg = data.data;
        // 获取符合要求的mv数量    这里有个接口小问题，只能第一次调用才有count
        if (data.count) {
          this.total = data.count;
        }
      });
    },
    // 分页
    update(cur) {
      this.page = cur;
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
    // 分页操作
    page: {
      immediate: true,
      handler() {
        this.getSong();
      },
    },
    // 点击分类重新调取数据   同时初始化分页页码为1
    area() {
      this.page = 1;
      this.getSong();
    },
    type() {
      this.page = 1;
      this.getSong();
    },
    order() {
      this.page = 1;
      this.getSong();
    },
  },
};
</script>

<style lang="less" scoped>
.mvs-container {
  min-width: 500px;
}
.filter_wrap {
  margin-top: 40px;
  font-size: 15px;
  div {
    margin-bottom: 40px;
  }
  .wrap_title {
    float: left;
  }
  ul {
    li {
      display: inline-block;
      padding: 2px 15px;
      margin: 0 10px;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}
</style>