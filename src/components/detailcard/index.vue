<template>
  <div class="card_list">
    <div class="card_group" v-for="(item, index) in cardList" :key="index">
      <div class="list-card">
        <van-cell :title="item.title" class="header_cell_title"></van-cell>
        <div class="card-left-cell" v-for="(x, y) in item.value" :key="y">
          <div class="left-cell-title">{{ x.key }}:</div>
          <div class="left-cell-value blue">{{ x.val }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detailCard',
  props: {
    cardList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
<style lang="less">
.card_list {
  .card_group {
    background: #ffffff;
    width: 100%;
    margin-top: 10px;
    position: relative;
    &:before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .list-card {
      width: 100%;
      .header_cell_title {
        color: #121212;
        font-weight: bold;
      }
      .card-left-cell {
        display: flex;
        min-height: 40px;
        align-items: center;
        padding: 0 12px;
        .left-cell-title {
          flex: 1.2;
          text-align: justify;
          text-align-last: justify;
          color: #797979;
        }
        .left-cell-value {
          flex: 3;
          margin-left: 8px;
          color: #202020;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
