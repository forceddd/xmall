<template>
  <el-row class="good-item">
    <el-col>
      <el-card :body-style="{padding: 0}">
        <div class="good-img">
          <a>
            <img :src="goods.productImageBig" alt />
          </a>
        </div>
        <h6 class="good-title">{{goods.productName}}</h6>
        <h3 class="sub-title ellipsis">{{goods.subTitle}}</h3>
        <div class="good-price pr">
          <div class="ds pa">
            <a href="javascript:;">
              <el-button type="default" size="medium" @click="productDetail(goods.productId)">查看详情</el-button>
            </a>
            <a href="javascript:;">
              <el-button type="primary" size="medium" @click="addCart(goods)">加入购物车</el-button>
            </a>
          </div>
          <p>
            <span style="font-size:14px">￥</span>
            {{Number(goods.salePrice).toFixed(2)}}
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Storage from "@/Utils/storage.js";
export default {
  props: ["goods"],
  computed: {
    ...mapState(["login"])
  },
  methods: {
    productDetail(id) {
      //编程式路由导航
      this.$router.push({
        path: `goodsDetail?productId=${id}`
      });
      /* this.$router.push(`/goodsDetail?productId=${id}`); */
    },
    ...mapMutations(["ADDCART"]),
    async addCart(goods) {
      const { productId, salePrice, picUrl, productName } = goods;
      if (this.login) {
        //用户已登录 将商品添加到用户信息中
        const res = await this.$axios.post("api/addCart", {
          userId: Storage.get("id"),
          productId,

          productNum: 1
        });
        // console.log(res.data.result.cartList);

        //修改vuex中的cartList
        this.ADDCART(res.data.result.cartList);
      } else {
        //用户未登录 提示用户需要登录
        confirm("是否前往登陆页面")
          ? this.$router.push({
              path: "login",
              query: { next: this.$route.fullPath }
            })
          : null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.good-img {
  display: flex;
  justify-content: center;
  a {
    display: block;
    img {
      margin: 50px auto 10px;
      width: 206px;
      height: 206px;
      display: block;
    }
  }
}
.good-price {
  margin: 15px 0;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #d44d44;
  font-family: Arial;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: space-around;
  padding-bottom: 60px;
  a {
    margin-right: 5px;
  }
  .ds {
    display: none;
  }
}
.good-price:hover .ds {
  display: block;
}
.good-title {
  line-height: 1.2;
  font-size: 16px;
  color: #424242;
  margin: 0 auto;
  padding: 0 14px;
  text-align: center;
  overflow: hidden;
}
h3 {
  text-align: center;
  line-height: 1.2;
  font-size: 12px;
  color: #d0d0d0;
  padding: 10px;
}
.good-item {
  background: #fff;
  width: 25%;
  transition: all 0.5s;
  height: 410px;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
    .good-price p {
      display: none;
    }
    .ds {
      display: flex;
    }
  }
}
.el-card {
  border: none;
}
</style>