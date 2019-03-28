<template>
  <div class="scroll"
       @touchstart="touchStart"
       @touchmove="touchMove"
       @touchend="touchEnd"
       @scroll="scroll"
       ref="scroll">

    <div ref="header" v-if="!disableUpPull" v-show="showHeader" class="top">
      <i v-show=" refreshStatus === 0 " class="iconfont icon-xiala icon"></i>
      <img v-show=" refreshStatus === 1 " class="top-refresh" src="../assets/refresh-loading.gif">
      {{ refreshText }}
    </div>

    <slot></slot>

    <div class="bom" :class="{'no-more': noMore}" v-if="!disableDownPull" v-show="showFooter" ref="footer">
      <div class="left"></div>
      <div class="mid">
        <img v-show="!noMore" class="top-refresh" src="../assets/refresh-loading.gif">
        <span>{{ footerText }}</span>
      </div>
      <div class="right"></div>
    </div>

  </div>
</template>

<script>
  const REFRESH_HEIGHT = 60;
  const DEFAULT_DISTANCE = 60;

  export default {
    props : {
      checkNoMore: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        refreshStatus: 0, // 0 -> 未开始 1 -> 进行中 2 -> 已完成
        loadmoreStatus: 0, // 0 -> 还有数据 1 -> 没有数据
        refreshText: '',
        loaded: false,
        noMore: false,
        showFooter: false,
        showHeader: false,
      }
    },

    computed: {
      footerText() {
        return !this.noMore ? this.loadmoreText : this.noMoreText;
      }
    },

    mounted() {
      setTimeout(() => {
        this.init();
      }, 20)
    },

    methods: {
      init() {
        this.touch = {
          top: this.$refs.header,
          bom: this.$refs.footer,
          scroll: this.$refs.scroll,
          topHasShow: false,
        };

        this.refreshText = this.refreshBefore;
      },

      touchStart(e) {
        const touch = e.touches[0];
        const scrollTop = this.touch.scroll.scrollTop;
        this.touch.startY = touch.pageY;
        this.touch.isTop = scrollTop === 0;
      },

      touchMove(e) {
        const touch = e.touches[0];
        const pageY = touch.pageY;
        const offset = pageY - this.touch.startY;

        // 从顶端下拉时
        if (this.touch.isTop && offset > 0) {
          if(this.disableUpPull) return;
          if(!this.showHeader) this.showHeader = true;
          this.readyRefresh(Math.abs(offset));
        } else {
          if(this.touch.topHasShow) {
            this.refreshDone();
            this.touch.topHasShow = false;
          }
        }
      },

      touchEnd() {
        if (this.refreshStatus === 1) {
          // this.$emit('refresh', this.refreshDone.bind(this));
          this.$emit('refresh')
          this.refreshDone();
        } else {
          if(this.touch.topHasShow) this.refreshDone();
        }
      },

      readyRefresh( offset ) {
        if(this.refreshStatus === 1) return;
        const top = this.touch.top;
        this.touch.topHasShow = true;
        let marginTop = -(REFRESH_HEIGHT - offset);
        marginTop = Math.min(marginTop, 0);
        top.style.marginTop = `${marginTop}px`;

        if(marginTop === 0) {
          if(this.refreshStatus !== 1) this.refreshStatus = 1;
        } else {
          if(this.refreshStatus !== 0) this.refreshStatus = 0;
        }
      },

      refreshDone () {
        const top = this.touch.top;
        // const time = this.backTime / 1000 || 0.2;
        const time= 1;
        top.style.transition = `margin ${time}s`;
        top.style.marginTop = `-60px`;

        this.noMore = false;

        setTimeout(() => {
          top.style.transition = '';
          this.refreshText = this.refreshBefore;
          this.refreshStatus = 0;
          this.touch.topHasShow = false;
          this.showHeader = false;
          // this.disableUpPull = true;
        }, time * 1000)
      },

      loadmoreDone( noMore ) {
        this.loaded = false;
        this.noMore = !!noMore;

        if( this.noMore && this.loadmoreStatus !== 1 ) this.loadmoreStatus = 1;
        if( !this.noMore ) this.showFooter = false;
      },

      scroll() {
        console.log('nomore',this.noMore)
        if( this.disableDownPull ) return;

        if( this.noMore ) {
          if( !this.showFooter ) this.showFooter = true;
          return;
        }

        const el = this.touch.scroll;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const bottomDistance = !this.bottomDistance && this.bottomDistance !== 0 ? DEFAULT_DISTANCE : this.bottomDistance;

        if(scrollTop + el.clientHeight + bottomDistance >= scrollHeight) {
          if(this.loaded) return;
          this.loaded = true;
          this.showFooter = true;
          this.$emit('loadmore', this.loadmoreDone.bind(this))
        }
      }
    },

    watch: {
      refreshStatus( newVal ) {
        if( newVal === 0 ) this.refreshText = this.refreshBefore;
        if( newVal === 1 ) this.refreshText = this.refreshLoading;
      },
    },

    props: {
      backTime: {
        type: Number,
        default: 200
      },

      refreshBefore: {
        type: String,
        default: '下拉刷新数据'
      },

      refreshLoading: {
        type: String,
        default: '松开手刷新'
      },

      refreshSuccessText: {
        type: String,
        default: '已刷新数据'
      },

      refreshErrorText: {
        type: String,
        default: '刷新数据失败！'
      },

      bottomDistance: {
        type: Number,
        default: DEFAULT_DISTANCE,
      },

      loadmoreText: {
        type: String,
        default: '加载中'
      },

      noMoreText: {
        type: String,
        default: '没有更多数据'
      },

      disableUpPull: {
        type: Boolean,
        default: false,
      },

      disableDownPull: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>

<style scoped>
  .scroll {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /*div {*/
  /*height: 100%;*/
  /*}*/

  .top {
    height: 60px;
    margin-top: -60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    background: #FFF;
  }

  .icon {
    font-size: 26px;/*px*/
    margin-right: 5px;
    color: #333;
  }

  .top-refresh {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  .bom {
    height: 60px;
    background: #FFF;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bom .left, .bom .right {
    flex: 1;
    height: 100%;
    position: relative;
  }

  .bom.no-more .left:before, .bom.no-more .right:before {
    content: '';
    position: absolute;
    width: 50%;
    height: 1px;
    background: #b0b0b0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .mid {
    display: flex;
    align-items: center;
  }
</style>
