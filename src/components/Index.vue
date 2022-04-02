<template>
  <div class="index">
    <!-- 左侧导航区域 -->
    <nav>
      <ul>
        <router-link to="/discover" active-class="active" tag="li"
          ><i class="el-icon-house"></i>发现音乐</router-link
        >
        <router-link to="/recommend" active-class="active" tag="li"
          ><i class="el-icon-folder-checked"></i>推荐歌单</router-link
        >
        <router-link to="/songs" active-class="active" tag="li"
          ><i class="el-icon-headset"></i>最新音乐</router-link
        >
        <router-link to="/mv" active-class="active" tag="li"
          ><i class="el-icon-video-play"></i>最新M V</router-link
        >
      </ul>
    </nav>
    <!-- 右侧容器 -->
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 播放器 -->
    <audio
      ref="audio"
      @play="play"
      @pause="pause"
      :src="this.$store.state.musicUrl"
      controls
      style="width: 100%"
      autoplay
      loop
    ></audio>
    <!-- <play-bar ref="playbar"/> -->
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {};
  },
  // 在渲染完成后拿到audio 方便后续操作
  mounted() {
    this.$store.state.ref.audio = this.$refs.audio;
  },
  methods: {
    // 播放音乐时将标题改成音乐名字
    pause() {
      document.title = "MusicHub";
    },
    play() {
      this.$store.commit("playAudio");
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  display: flex;
  height: 90%;
  nav {
    width: 200px;
    min-width: 200px;
    height: 90%;
    background-color: rgb(238, 237, 239);
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 55px;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
      i {
        font-size: 18px;
        margin-right: 10px;
      }
      &:hover {
        background-color: rgb(226, 226, 226);
      }
    }
    .active {
      font-size: 20px;
      background-color: rgb(226, 226, 226);
    }
  }

  .main {
    width: 80%;
    min-width: 1000px;

    height: 90%;
    overflow: auto;
    margin: 0 auto;
  }
  audio {
    position: fixed;
    bottom: 0;
  }
}
</style>