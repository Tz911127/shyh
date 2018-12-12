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
      <audio id="myAudio" autoplay loop="loop" style="position:absolute;">
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
          <td class="cjBtn" id="btn" @click="turn"></td>
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
    <!-- luckEnd -->
    <!-- 弹窗 -->
    <!-- 输入手机号 -->
    <div class="phone">
      <div class="phone_input clearfix">
        <div class="close_phone" @click="close_phone"></div>
        <div style="margin:50vw auto">
          <input type="text" v-model="phone" placeholder="请输入手机号">
          <button @click="domain">确定</button>
        </div>
      </div>
    </div>

    <!-- 没有输入手机号 -->
    <div class="noPhone">
      <div class="msg">
        <div class="msg_text"></div>
        <div class="close_msg" @click="close_msg"></div>
      </div>
    </div>

    <!-- 没有中奖/中将 -->
    <div class="xxcy-main" id="xxcy-main">
      <div class="xxcy">
        <div class="xxcy_text">
          <!-- <span></span> -->
        </div>
        <div class="close_xxcy" @click="close_xxcy"></div>
      </div>
    </div>

    <!-- 滚动条 -->
    <div class="bulletin">
      <ul style="margin-top: 0px;">
        <li v-for="list in lists" :key="list">
          <a href="#">{{list}}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { Scroll } from "../util/scroll.js";
import { postPhone, getPrize, postPrize } from "../api/api.js";
import haha from "../img/haha@3x.png";
import money from "../img/moneycopy@3x.png";
export default {
  data() {
    return {
      lists: [""],
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
      token: window.location.hash.split("=")[1].split("&")[0],
      aid: window.location.hash.split("=")[2]
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
          this.url = res.data.content.activity.link;
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

          for (let i = 0; i < records.length; i++) {
            this.lists.push("恭喜" + records[i].telephone + "手机用户获得" + records[i].prizeName);
          }

          this.scrollStart();
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
    scrollStart() {
      if (this.lists.length > 1) {
        $(".bulletin").Scroll({ line: 1, speed: 1000, timer: 3000 });
      }
    },
    turn() {
      let param = {
        token: this.token,
        aid: this.aid,
        tel: this.phone,
        nonce: this.content
      };
      postPrize(param).then(res => {
        if (res.data.code == 0) {
          if (res.data.content == 0) {
            this.init();
            if (this.click) {
              return false;
            } else {
              this.speed = 100;
              this.scrollRoll();
              this.click = true;
            }
            let turnplate = this.turnplate;
            for (let i = 0; i < turnplate.restaraunts.length; i++) {
              if (turnplate.restaraunts[i].name == "谢谢参与") {
                this.index = i - 1;
                break;
              }
            }
            $(".xxcy_text").html("谢谢参与");
          } else {
            $(".msg_text").html(res.data.message);
            $(".noPhone").fadeIn();
            // }
          }
        } else if (res.data.code == 1) {
          if (res.data.content.hitCode) {
            $(".xxcy-main").fadeIn();
            $(".xxcy_text").html(
              "恭喜！<br/>获得" +
                res.data.content.prizeName +
                "<span id='prize_code'>兑奖码" +
                "<span class=prize_code>" +
                res.data.content.hitCode +
                "</span>" +
                "</span>"
            );
          } else {
            this.init();
            if (this.click) {
              return false;
            } else {
              this.speed = 100;
              this.data = res.data;
              this.scrollRoll();
              this.click = true;
            }

            let turnplate = this.turnplate;
            for (let i = 0; i < turnplate.restaraunts.length; i++) {
              if (turnplate.restaraunts[i].name == res.data.content.prizeName) {
                this.index = i - 1;
                // break;
              }
            }
            $(".xxcy_text").html(
              "恭喜！<br/>获得" +
                res.data.content.prizeName +
                "<span id='prize_code'>兑奖码" +
                "<span class=prize_code>" +
                res.data.content.code +
                "</span>" +
                "</span>"
            );
          }
          // else if (res.data.code == 2) {
          //   $(".msg_text").html(res.data.message);
          //   $(".noPhone").fadeIn();
          // }
        }
      });
    },
    close_phone() {
      $(".phone").fadeOut();
    },
    init: function(id) {
      if ($("#" + id).find(".luck-unit").length > 0) {
        let $luck = $("#" + id);
        let $units = $luck.find(".luck-unit");
        this.obj = $luck;
        this.count = $units.length;
        $luck.find(".luck-unit-" + this.index).addClass("active");
      }
    },

    roll: function() {
      var index = this.index;
      var count = this.count;
      this.init("luck");
      var luck = this.obj;
      $(luck)
        .find(".luck-unit-" + index)
        .removeClass("active");
      index += 1;
      if (index > count - 1) {
        index = 0;
      }
      $(luck)
        .find(".luck-unit-" + index)
        .addClass("active");
      this.index = index;
      return false;
    },
    scrollRoll() {
      this.times += 1;
      this.roll();
      if (this.times > this.cycle + 10 && this.prize == this.index) {
        clearTimeout(this.timer);
        this.prize = -1;
        this.times = 0;
        this.click = false;
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10;
        } else if (this.times == this.cycle) {
          this.prize = this.index; //最终中奖位置
        } else {
          if (
            this.times > this.cycle + 10 &&
            ((this.prize == 0 && this.index == 7) ||
              this.prize == this.index + 1)
          ) {
            this.speed += 110;
          } else {
            this.speed += 20;
          }
        }
        if (this.speed < 40) {
          this.speed = 40;
        }

        this.timer = setTimeout(this.scrollRoll, this.speed);
      }
      // 弹窗
      if (this.times == 0) {
        $("#xxcy-main").fadeIn();
      }
      return false;
    },
    close_xxcy() {
      $("#xxcy-main").fadeOut();
    },
    domain() {
      let param = {
        tel: this.phone,
        aid: this.aid,
        token: this.token
      };
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

      if (myreg.test(this.phone)) {
        postPhone(param).then(res => {
          if (res.data.code == 1) {
            if (res.data.content.hitCode) {
              $(".noPhone").fadeIn();
              $(".msg_text").html(
                "恭喜！<br/>获得" +
                  res.data.content.prizeName +
                  "<span id='prize_code'>兑奖码" +
                  "<span class=prize_code>" +
                  res.data.content.hitCode +
                  "</span>" +
                  "</span>"
              );
            } else {
              this.content = res.data.content;
              $(".phone").fadeOut();
            }
          } else {
            $(".msg_text").html(res.data.message);
            $(".noPhone").fadeIn();
          }
        });
      } else {
        $(".msg_text").html("请输入" + "<br>" + "正确的手机号");
        $(".noPhone").fadeIn();
      }
    },
    close_msg() {
      $(".noPhone").fadeOut();
    }
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
  height: 110vh;
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
.bulletin {
  color: #fff;
  float: left;
  height: 8vw;
  /* height: 5.5vw; */
  margin: 0 20px 0 20px;
  overflow: hidden;
  position: absolute;
  bottom: 10vw;
  background: #3d1b4c;

  border-radius: 4vw;
  width: 95%;
}
.bulletin a {
  float: left;
  width: 100%;
}
.bulletin ul {
  width: 80%;
  padding-left: 40px;
}
.bulletin li {
  width: 100%;
  height: 8vw;
  /* padding-left: 25px; */
  /* padding: 1vw 26vw; */
}
.bulletin li a {
  line-height: 8vw;
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

.phone {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  /* background: url('./img/popbg@3x.png'); */
  top: 0;
}
.phone .phone_input {
  width: 70%;
  height: 60%;
  margin: auto;
  background: url("../img/popbg@3x.png") no-repeat;
  background-size: 100%;
  /* position: absolute; */
  position: relative;
  top: 15%;
  overflow: hidden;
  /* left: 15%; */
}
.phone .phone_input input {
  /* position: absolute;
  top: 27%;
  left: 13%; */
  /* width:10vw; */
  margin: 0 auto;
  border: none;
  background: #ebe9f0;
  padding: 3vw;
  outline: none;
  display: block;
}
.phone .phone_input button {
  /* position: absolute;
  top: 36%;
  left: 14%; */
  margin: 5vw auto;
  border: none;
  outline: none;
  padding: 2vw 20vw;
  border-radius: 10vw;
  color: #fff;
  background: linear-gradient(to bottom, #d297d9, #6d2b8a);
  display: block;
}

.close_phone {
  position: absolute;
  color: #fff;
  right: 2.5vw;
  width: 10vw;
  height: 7vw;
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
.active {
  background-image: url("../img/selected@3x.png") !important;
  background-size: 100% 100% !important;
  /* background-attachment: fixed!important; */
}
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
#xxcy-main,
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
}

.xxcy-main .xxcy,
.msg {
  width: 70%;
  height: auto;
  position: absolute;
  top: 20%;
  left: 15%;
  /* background: white; */
  background: url("../img/popbg@3x.png") no-repeat;
  background-size: 100%;
  color: #7a312d;
  border-radius: 5px;
  font-size: 4vw;
  /* line-height: 80vw; */
  height: 86vw;
}
.xxcy .xxcy_text {
  width: 100%;
  text-align: center;
  margin: 40vw auto;
}
.msg .msg_text {
  width: 80%;
  text-align: center;
  margin: 45vw auto;
  color: rgba(255, 43, 113, 1);
  font-size: 5vw;
}
.xxcy .xxcy_text {
  color: rgba(255, 43, 113, 1);
  font-size: 5vw;
  margin-top: 45vw;
}

.xxcy-main .close_xxcy,
.msg .close_msg {
  position: absolute;
  top: 0;
  right: 4vw;
  width: 8vw;
  height: 7vw;
  text-align: center;
  margin: 0 auto;
  /* margin-bottom: 5vw; */
  line-height: 7vw;
  color: #e1ce85;
  /* background: #ba2d1c; */
  border-radius: 5px;
  font-size: 4vw;
}
#prize_code {
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
}
</style>
