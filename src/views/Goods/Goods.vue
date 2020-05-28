<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <a
          href="javascript:;"
          v-for="(nav,index) in navList"
          :key="index"
          :class="{active:isIndex===index}"
          @click="handlerSort(index)"
        >{{nav.title}}</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="最低价" v-model="min" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="最高价" v-model="max" />
          <el-button type="primary" size="small" style="margin-left: 10px;" @click="getAllGoods">确定</el-button>
        </div>
      </div>
    </div>
    <div>
      <div class="goods-box w">
        <mall-goods v-for="goods in allGoods" :key="goods.productId" :goods="goods"></mall-goods>
      </div>
      <div class="w">
        <el-pagination
          style="float:right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[8, 16,20,40]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
//引入mallgoods组件
import MallGoods from "@/components/MallGoods.vue";
export default {
  data() {
    return {
      max: "",
      min: "",
      navList: [
        { title: "综合排序" },
        { title: "价格由低到高" },
        { title: "价格由高到低" }
      ],
      isIndex: 0,
      allGoods: [],
      pageSize: 20,
      sort: "",
      currentPage: 1,
      total: 0
    };
  },
  components: {
    MallGoods
  },
  created() {
    this.getAllGoods();
  },
  watch: {
    $route: "getAllGoods"
  },
  methods: {
    handlerSort(index) {
      this.isIndex = index;
      //index为0默认排序 为1从低到高 为2从高到低
      let res;
      switch (index) {
        case 1:
          this.sort = 1;
          break;
        case 2:
          this.sort = -1;
          break;
        default:
          this.currentPage = 1;
          this.sort = "";
          break;
      }
      this.getAllGoods();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllGoods();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllGoods();
    },
    async getAllGoods() {
      const url = `/api/goods/allGoods?size=${this.pageSize}&sort=${this.sort}&page=${this.currentPage}&gt=${this.min}&lt=${this.max}&cid=${this.$route.query.cid}`;

      try {
        const res = await this.$axios.get(url);
        this.allGoods = res.data.data;
        this.total = res.data.total;
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 30px 0 0;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683ea;
      }
      &:hover {
        color: #5683ea;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
  .price-interval {
    padding: 0 15px;
    @extend %block-center;
    input[type="number"] {
      border: 1px solid #ccc;
      text-align: center;
      background: none;
      border-radius: 5px;
    }
  }
}

.goods-box {
  overflow: hidden;
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.img-item {
  display: flex;
  flex-direction: column;
}

.el-pagination {
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}
</style>