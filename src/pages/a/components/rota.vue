<template>
  <section>
    <div class="logo">
      <img src="../img/title@3x.png" alt>
    </div>
    <audio id="myAudio" autoplay loop="loop" style="position:absolute;right:0">
      <source src="../img/butter_fly.mp3" type="audio/ogg">
    </audio>
    <!-- 转盘 -->
    <div id="luck">
      <!-- luck -->
      <table cellspacing="3">
        <tr>
          <td class="luck-unit luck-unit-0">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
          <td class="luck-unit luck-unit-1">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
          <td class="luck-unit luck-unit-2">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="luck-unit luck-unit-7">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
          <td class="cjBtn" @click="handClick" id="btn"></td>
          <td class="luck-unit luck-unit-3">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="luck-unit luck-unit-6">
            <div class="luck_td">
              <img :src="src_money">
              <span></span>
            </div>
          </td>
          <td class="luck-unit luck-unit-5">
            <div class="luck_td">
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
          <td class="luck-unit luck-unit-4">
            <div class="luck_td">
              <img :src="src_money">
              <span></span>
            </div>
          </td>
        </tr>
      </table>
      <img class="img_pic" src="../img/money@3x.png" alt>
    </div>
  <!-- 弹窗 -->
    <div class="wind" @click="close">请扫码参与活动</div>

  </section>
</template>
<script>
import { stopRotate, rotate } from "../util/awardrotate.js";
import { Scroll } from "../util/scroll.js";
import { qrcode } from "../util/jquery.qrcode.min.js";
import { getPrize } from "../api/api.js";
import Rhaha from "../img/haha@3x.png";
import Rmoney from "../img/moneycopy@3x.png";
export default {
  data() {
    return {
      imgPoint: require("../img/click_text@3x.png"),
      bg_img: require("../img/turnplate-bg_2.png"),
      turnplate: {
        restaraunts: [], //大转盘奖品名称
        colors: [
          "#FFEED5",
          "#FFFFFF",
          "#FFEED5",
          "#FFFFFF",
          "#FFEED5",
          "#FFFFFF",
          "#FFEED5",
          "#FFFFFF"
        ], //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: 222, //大转盘外圆的半径
        textRadius: 165, //大转盘奖品位置距离圆心的距离
        insideRadius: 65, //大转盘内圆的半径
        startAngle: 0, //开始角度
        bRotate: false
      },
      canvas: "",
      src_haha: Rhaha,
      src_money: Rmoney,
      token: window.location.hash.split("=")[1]
    };
  },
  methods: {
    getData() {
      let token = {
        // token: "ea1405a631794b2fba2e8ba23c654783"
        token: this.token
      };
      getPrize(token).then(res => {
        if (res.data.code == 1) {
          let prize;
          let records;
          var arr = [];
          records = res.data.content.records;
          prize = res.data.content.activity.prizes;
          for (let i = 0; i < prize.length; i++) {
            this.turnplate.restaraunts.push(prize[i].name);
            arr.push({ name: prize[i].name, src: this.src_money });
          }
          for (let i = 0; i < 8 - this.turnplate.restaraunts.length; i++) {
            arr.push({ name: "谢谢参与", src: this.src_haha });
          }
          for (var i = 0; i < 8; i++) {
            if (arr[i].name == "谢谢参与") {
              this.src_haha = Rhaha;
            } else {
              this.src_money = Rmoney;
            }
          }
          arr.sort(function() {
            return 0.5 - Math.random();
          });
          this.turnplate.restaraunts = arr;
          $(".luck-unit-0>.luck_td>span").html(arr[0].name);
          $(".luck-unit-0>.luck_td>img").attr("src", arr[0].src);
          $(".luck-unit-1>.luck_td>span").html(arr[1].name);
          $(".luck-unit-1>.luck_td>img").attr("src", arr[1].src);
          $(".luck-unit-2>.luck_td>span").html(arr[2].name);
          $(".luck-unit-2>.luck_td>img").attr("src", arr[2].src);
          $(".luck-unit-7>.luck_td>span").html(arr[7].name);
          $(".luck-unit-7>.luck_td>img").attr("src", arr[7].src);
          $(".luck-unit-3>.luck_td>span").html(arr[3].name);
          $(".luck-unit-3>.luck_td>img").attr("src", arr[3].src);
          $(".luck-unit-6>.luck_td>span").html(arr[6].name);
          $(".luck-unit-6>.luck_td>img").attr("src", arr[6].src);
          $(".luck-unit-5>.luck_td>span").html(arr[5].name);
          $(".luck-unit-5>.luck_td>img").attr("src", arr[5].src);
          $(".luck-unit-4>.luck_td>span").html(arr[4].name);
          $(".luck-unit-4>.luck_td>img").attr("src", arr[4].src);

        }
      });
    },
  
    handClick() {
      $(".wind").fadeIn();
    },
    close() {
      $(".wind").fadeOut();
    },
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
section {
  width: 100%;
  height: 100vh;
  background: url("../img/bgpc@3x.png") no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  /* min-width: 1400px; */
}

.banner .turnplate #tupBtn {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 24%;
  top: 40%;
  border: 0;
}
.banner .img_pic {
  width: 40vw;
  position: absolute;
  bottom: -1vw;
  left: -3vw;
}
.kePublic {
  width: 33.8vw;
  height: 33.8vw;
  text-align: center;
  position: absolute;
  top: 12vw;
  left: 12vw;
}
.turnplate {
  background-image: url("../img/turnbg@3x.png");
  background-size: 100% 100%;
}
.logo {
  width: 100%;
  text-align: center;
}
.logo img {
  width: 70%;
}
.pointBg {
  position: absolute;
  width: 26.5%;
  height: 35.5%;
  left: 37%;
  top: 26%;
  background: url("../img/click@3x.png");
  background-size: cover;
}

#luck {
  position: absolute;
  background: url("../img/rotary_bg@3x.png") no-repeat;
  background-size: contain;
  height: 30.8vw;
  width: 33.8vw;
  top: 13vw;
  left: 13vw;
  /* transform: translateX(-50%); */
}
#luck table {
  margin: 1.35vw 1.35vw;
  /* margin: 3vw auto; */
}
#luck table td {
  margin: 1vw;
  background: #fff;
}
#luck img {
  width: 5vw;
  margin-top: 1vw;
}
#luck .luck_td {
  width: 9vw;
  height: 9vw;
  text-align: center;
  /* line-height: 9vw; */
}
#luck .luck_td span {
  display: block;
  color: rgba(255, 43, 113, 1);
  font-weight: bold;
}
#luck .luck-unit-1 .luck_td,
#luck .luck-unit-3 .luck_td,
#luck .luck-unit-5 .luck_td,
#luck .luck-unit-7 .luck_td {
  background: rgba(255, 246, 232, 1);
}
.cjBtn {
  background: url("../img/rotary_selected@3x.png") !important;
  background-size: 100% 100% !important;
}
.img_pic {
  width: 40vw !important;
  position: absolute;
  bottom: -4vw;
  left: -5vw;
}
.wind {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  overflow: hidden;
  z-index: 10;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  color: #fff;
  text-align: center;
  font-size: 5vw;
  line-height: 100vh;
}
</style>
