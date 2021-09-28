<template>
  <div id='article-item'>
    <van-cell :to="{name:'article',params:{articleId:article.art_id}}">

      <div slot="title" class="title van-multi-ellipsis--l3">{{article.title}}</div>

      <div class="label" slot="label">
        <div class="cover-warp" v-if="article.cover.type === 3">
          <div class="cover-warp-item" v-for="img in article.cover.images" :key="img.index">
            <van-image fit="cover" :src="img" />
          </div>
        </div>
        <div class="label-warp">
          <span>{{article.aut_name}}</span>
          <span>{{article.comm_count}}评论</span>
          <span>{{article.pubdate | relativeTime}}</span>
        </div>
      </div>

      <div v-if="article.cover.type === 1">
        <van-image fit="cover" :src="article.cover.images[0]" />
      </div>

    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
#article-item {
  .van-cell {
    .title {
      font-size: 16px;
      color: #3a3a3a;
    }
    .label {
      .cover-warp {
        padding: 15px 0;
        display: flex;
        .cover-warp-item {
          flex: 1;
          flex-wrap: nowrap;
          &:not(:last-child) {
            padding-right: 4px;
          }
          .van-image {
            width: 100%;
            height: 73px;
          }
        }
      }
      .label-warp {
        font-size: 12px;
        color: #b4b4b4;
        span {
          margin-right: 13px;
        }
      }
    }
    .van-cell__value {
      margin-left: 13px;
      flex: unset;
      width: 116px;
      height: 73px;
    }
  }
}
</style>
