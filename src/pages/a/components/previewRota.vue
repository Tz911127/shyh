<template>
  <section class="bga">
    <div class="logo">
      <img class="word_logo" src="../img/logo@3x.png" alt>
      <div>
        <img
          src="../img/icon_music @3x.png"
          @click="play"
          style="width:10vw;position:absolute;top:2vw;left:88vw"
          alt
        >
      </div>
      <audio id="myAudio" autoplay loop="loop" style="position:absolute;right:0">
        <source src="../img/butter_fly.mp3" type="audio/ogg">
      </audio>
    </div>
    <div class="word">
      <img class="word_img" src="../img/word@3x.png" alt>
    </div>
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
          <td class="cjBtn" id="btn"></td>
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
              <img :src="src_haha">
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
              <img :src="src_haha">
              <span></span>
            </div>
          </td>
        </tr>
      </table>
    </div>

  </section>
</template>

<script>
import { Scroll } from "../util/scroll.js";
// import { postPhone, getPrize, postPrize } from "../api/api.js";
import haha from "../img/haha@3x.png";
import money from "../img/moneycopy@3x.png";
import { postPreview } from "../api/api.js";
export default {
  data() {
    return {
      lists: ["获奖名单"],
      index: 0, //当前转动到哪个位置，起点位置
      count: 0, //总共有多少个位置
      timer: 0, //setTimeout的ID，用clearTimeout清除
      speed: 20, //初始转动速度
      times: 0, //转动次数
      cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, //中奖位置
      click: false,
      obj: "",
      turnplate: {
        restaraunts: []
      },
      phone: "",
      content: "",
      data: {},
      index: "",
      src_haha: haha,
      src_money: money,
    // aid: "5c08b10564231e0b3aab487f",
     aid: window.location.hash.split("=")[1],
    };
  },
  methods: {
    getData() {
      let param = {
        // token: "ea1405a631794b2fba2e8ba23c654783"
        // aid: this.aid
        id: this.aid

      };
      postPreview(param).then(res => {
        if (res.data.code == 1) {
          let prize;
          let records;
          var arr = [];
        //   this.url = res.data.content.activity.link;
        //   records = res.data.content.records;
          prize = res.data.content.prizes;
          for (let i = 0; i < prize.length; i++) {
            this.turnplate.restaraunts.push(prize[i].name);
            // arr.push(prize[i].name);
            arr.push({ name: prize[i].name, src: this.src_money });
          }
          for (let i = 0; i < 8 - this.turnplate.restaraunts.length; i++) {
            arr.push({ name: "谢谢参与", src: this.src_haha });
          }
          for (var i = 0; i < 8; i++) {
            arr[i] = arr[i];
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

          let luck_div = $(".luck_td");

        }
      });
    },
    play() {
      let myAudio = document.getElementById("myAudio");
      if (myAudio.paused) {
        let myAudio = document.getElementById("myAudio");

        myAudio.play();
      } else {
        let myAudio = document.getElementById("myAudio");

        myAudio.pause();
      }
    },
  
  },
  mounted() {
    this.getData();
    this.play();
  }
};
</script>


<style>
.bga {
  background: url("../img/bg.png") no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  position: relative;
}
.logo {
  position: absolute;
}
.logo .word_logo {
  width: 25vw;
  position: absolute;
  top: 4vw;
  left: 4vw;
}

a {
  text-decoration: none;
  color: #fff;
  font-size: 4vw;
}

ul li {
  list-style-type: none;
}

.word {
  position: absolute;
  top: 16vw;
  left: 15vw;
}
.word .word_img {
  width: 85%;
}


#luck {
  position: absolute;
  background: url("../img/rotary_bg@3x.png") no-repeat;
  background-size: contain;
  /* height: 80vw; */
  width: 90vw;
  top: 65vw;
  left: 50%;
  transform: translateX(-50%);
}
#luck table {
  margin: 5vw 4.75vw;
  /* margin: 3vw auto; */
}
#luck table td {
  margin: 1vw;
  background: #fff;
}
#luck img {
  margin-top: 3vw;
  width: 15vw;
}
#luck .luck_td {
  width: 25vw;
  height: 25vw;
  text-align: center;
}
#luck .luck_td span {
  display: block;
  color: rgba(255, 43, 113, 1);
  font-weight: bold;
}
/* .active {
  background-image: url("../img/selected@3x.png") !important;
  background-size: 100% 100% !important;
} */
.cjBtn {
  background: url("../img/rotary_selected@3x.png") !important;
  background-size: 100% 100% !important;
}
#luck .luck-unit-1,
#luck .luck-unit-3,
#luck .luck-unit-5,
#luck .luck-unit-7 {
  background: rgba(255, 246, 232, 1);
}
/* #xxcy-main,
#zj-main,
.noPhone {
  display: none;
}
.xxcy-main,
.noPhone {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  overflow: hidden;
  *zoom: 1;
  z-index: 10;
  left: center;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
} */

/* .xxcy-main .xxcy,
.msg {
  width: 70%;
  height: auto;
  position: absolute;
  top: 20%;
  left: 15%;
  background: url("../img/popbg@3x.png") no-repeat;
  background-size: 100%;
  color: #7a312d;
  border-radius: 5px;
  font-size: 4vw;
  height: 86vw;
} */
/* .xxcy .xxcy_text {
  width: 100%;
  text-align: center;
  margin: 40vw auto;
}
.msg .msg_text {
  width: 80%;
  text-align: center;
  margin: 50vw auto;
  color: rgba(255, 43, 113, 1);
  font-size: 5vw;
}
.xxcy .xxcy_text {
  color: rgba(255, 43, 113, 1);
  font-size: 5vw;
  margin-top: 50vw;
} */

/* .xxcy-main .close_xxcy,
.msg .close_msg {
  position: absolute;
  top: 0;
  right: 4vw;
  width: 8vw;
  height: 7vw;
  text-align: center;
  margin: 0 auto;
  line-height: 7vw;
  color: #e1ce85;
  border-radius: 5px;
  font-size: 4vw;
} */
/* #prize_code {
  display: block;
  width: 40vw;
  margin: 5vw auto;
  background: rgba(235, 233, 240, 1);
  padding: 2vw 0;
  color: rgba(184, 184, 184, 1);
  font-size: 4vw;
}
.prize_code {
  color: rgba(19, 34, 58, 1);
  font-size: 5vw;
  margin-left: 2vw;
} */
</style>
