<template>
  <div class="song_container">
    <div class="listClass">
      <ul class="small">
        <li
          :class="{ active: tag == '全部' }"
          @click="
            tag = '全部';
            typeId = 0;
          "
        >
          全部
        </li>
        <li
          :class="{ active: tag == '欧美' }"
          @click="
            tag = '欧美';
            typeId = 96;
          "
        >
          欧美
        </li>
        <li
          :class="{ active: tag == '华语' }"
          @click="
            tag = '华语';
            typeId = 7;
          "
        >
          华语
        </li>
        <li
          :class="{ active: tag == '日本' }"
          @click="
            tag = '日本';
            typeId = 8;
          "
        >
          日本
        </li>
        <li
          :class="{ active: tag == '韩国' }"
          @click="
            tag = '韩国';
            typeId = 16;
          "
        >
          韩国
        </li>
      </ul>
    </div>
    <table v-if="!isLoading">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="T_row" v-for="(song, index) in songMsg" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="songImg">
              <img :src="song.album.picUrl" /><span
                class="el-icon-video-play iconPlay"
                @click="player(song.id, song.name)"
              ></span>
            </div>
          </td>
          <td>
            {{ song.name }}
            <!-- 点击mv图案跳转到mv详情页 -->
            <span
              v-if="song.mvid != 0"
              class="pointer mv el-icon-video-camera"
              @click="toMvList(song.mvid, song.artists[0].id)"
            ></span>
          </td>
          <td>{{ song.artists[0].name }}</td>
          <td>{{ song.album.name }}</td>
          <td>{{ $store.getters.formatDate(song.duration) }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 加载图标 -->
    <div v-else class="load el-icon-loading"></div>
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "Songs",

  data() {
    return {
      // 点击标签高亮显示
      tag: "全部",
      // 判断是否处于加载
      isLoading: true,
      // 歌曲类型编号
      typeId: 0,
      //歌曲相关信息
      songMsg: [],
    };
  },
  watch: {
    tag: {
      immediate: true,
      handler() {
        // 每次触发之前先展示加载中
        this.isLoading = true;
        // 再调用搜索，方法里有关闭加载
        this.getSong();
      },
    },
  },
  methods: {
    getSong() {
      requestWyy({
        url: "/top/song",
        params: {
          type: this.typeId,
        },
      }).then(({ data: { data } }) => {
        // 获取歌曲信息    只拿20条
        this.songMsg = data.slice(0, 20);
        this.isLoading = false;
      });
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
};
</script>

