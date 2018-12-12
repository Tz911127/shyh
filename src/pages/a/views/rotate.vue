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
      <!-- <audio src="../img/butter_fly.mp3" controls="controls"></audio> -->
    </div>
    <div class="word">
      <img class="word_img" src="../img/word@3x.png" alt>
    </div>

    <div class="kePublic">
      <!--转盘效果开始-->
      <div style="margin:0 auto">
        <div class="banner">
          <div class="turnplate">
            <canvas class="item" id="wheelcanvas" width="516" height="516"></canvas>
            <div class="pointBg">
              <img id="tupBtn" class="pointer" @click="hand" :src="imgPoint">
            </div>
          </div>
        </div>
      </div>
      <!--转盘效果结束-->
      <div class="clear"></div>
    </div>
    <!-- 弹窗 -->
    <!-- 输入手机号 -->
    <div class="phone">
      <div class="phone_input clearfix">
        <div class="close_phone" @click="close_phone"></div>
        <div style="margin:50vw auto">
          <input type="text" v-model="phone" placeholder="请输入手机号">
          <button class="btn" @click="domain">确定</button>
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

    <!-- 没有中奖 -->
    <div class="xxcy-main" id="xxcy-main">
      <div class="xxcy">
        <div class="xxcy_text" style="color:rgba(255, 43, 113, 1);font-size: 5vw;margin-top:50vw"></div>
        <div class="close_xxcy" @click="close_xxcy"></div>
      </div>
    </div>
    <!-- 中奖 -->
    <div class="zj-main" id="zj-main">
      <div class="txzl">
        <div class="zj_text">
          恭喜!
          <br>获得
          <span id="jiangpin"></span>
          <br>
          <span id="prize_code">
            兑奖码
            <span class="prize_code"></span>
          </span>
        </div>
        <div class="close_zj" @click="close_zj"></div>
      </div>
    </div>
    <!-- 多次点击 -->
    <div class="dbclick"></div>
    <!-- 滚动条 -->
    <div class="bulletin">
      <ul style="margin-top: 0px;">
        <li v-for="list in lists" :key="list">
          <a href="#">{{list}}</a>
        </li>
      </ul>
    </div>

    <!-- 弹出 -->
  </section>
</template>
<script>
import { stopRotate, rotate } from "../util/awardrotate.js";
import { Scroll } from "../util/scroll.js";
import { postPhone, getPrize, postPrize } from "../api/api.js";
import haha from "../img/haha@3x.png";
import money from "../img/moneycopy@3x.png";
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
        bRotate: false,
        imgs: []
      },
      lists: [""],
      phone: "",
      item: "",
      msg: "",
      content: "",
      token: window.location.hash.split("=")[1].split("&")[0],
      aid: window.location.hash.split("=")[2],
      awardPic: []
    };
  },
  methods: {
    getData() {
      let token = {
        token: this.token
      };
      getPrize(token).then(res => {
        if (res.data.code == 1) {
          let prize;
          let records;
          var arr = [];
          let newArr = [];
          let newImg = [];
          this.url = res.data.content.activity.link;
          records = res.data.content.records;
          prize = res.data.content.activity.prizes;
          for (let i = 0; i < prize.length; i++) {
            this.turnplate.restaraunts.push(prize[i].name);
            arr.push({ name: prize[i].name, img: money });
          }
          for (let i = 0; i < 8 - this.turnplate.restaraunts.length; i++) {
            arr.push({ name: "谢谢参与", img: haha });
          }
          for (var i = 0; i < 8; i++) {
            arr[i] = arr[i];
          }
          arr.sort(function() {
            return 0.5 - Math.random();
          });

          for (let i = 0; i < arr.length; i++) {
            newArr.push(arr[i].name);
            newImg.push(arr[i].img);
          }

          this.turnplate.restaraunts = newArr;
          this.turnplate.imgs = newImg;

          for (let i = 0; i < records.length; i++) {
            this.lists.push("恭喜" + records[i].telephone + "手机用户获得" + records[i].prizeName);
          }

          this.drawRouletteWheel();
          this.scrollStart();
        }
      });
    },
    hand() {
      let param = {
        token: this.token,
        aid: this.aid,
        tel: this.phone,
        nonce: this.content
      };
      postPrize(param).then(res => {
        if (res.data.code == 0) {
          if (res.data.content == 0) {
            let turnplate = this.turnplate;
            if (turnplate.bRotate) return;
            turnplate.bRotate = !turnplate.bRotate;
            for (let i = 0; i < turnplate.restaraunts.length; i++) {
              if (turnplate.restaraunts[i] == "谢谢参与") {
                this.item = i;
                break;
              }
            }
            var item = this.item;
            var data = { msg: res.data.message };
            this.rotateFn(item + 1, turnplate.restaraunts[item], data);
          } else {
            $(".msg_text").html(res.data.message);
            $(".noPhone").fadeIn();
          }
        } else if (res.data.code == 1) {
          if (res.data.content.hitCode) {
            $("#zj-main").fadeIn();
            // $("#jiangpin").text(res.data.content.hitCode);
            $(".prize_code").text(res.data.content.hitCode);
          } else {
            let turnplate = this.turnplate;
            if (turnplate.bRotate) return;
            turnplate.bRotate = !turnplate.bRotate;
            for (let i = 0; i < turnplate.restaraunts.length; i++) {
              if (turnplate.restaraunts[i] == res.data.content.prizeName) {
                this.item = i;
                break;
              }
            }
            var item = this.item;
            var data = {
              msg: res.data.content.prizeName,
              prize_code: res.data.content.code
            };
            this.rotateFn(item + 1, turnplate.restaraunts[item], data);
          }
        }
        // else if (res.data.code == 2) {
        // $(".msg_text").html(res.data.message);
        // $(".noPhone").fadeIn();
        // }
      });
    },
    rotateFn(item, txt, data) {
      let turnplate = this.turnplate;
      let that = this;
      var angles =
        item * (360 / turnplate.restaraunts.length) -
        360 / (turnplate.restaraunts.length * 2);
      if (angles < 270) {
        angles = 270 - angles;
      } else {
        angles = 360 - angles + 270;
      }
      $("#wheelcanvas").stopRotate();
      $("#wheelcanvas").rotate({
        angle: 0,
        animateTo: angles + 1800,
        duration: 6000,
        callback: function() {
          //中奖页面与谢谢参与页面弹窗
          if (txt.indexOf("谢谢参与") >= 0) {
            $(".xxcy_text").html(data.msg);
            $("#xxcy-main").fadeIn();
            that.save();
          } else {
            $("#zj-main").fadeIn();
            var resultTxt = txt.replace(/[\r\n]/g, ""); //去掉回车换行
            $("#jiangpin").text(data.msg);
            $(".prize_code").text(data.prize_code);
            that.save();
          }
          turnplate.bRotate = !turnplate.bRotate;
        }
      });
    },
    //转盘渲染
    drawRouletteWheel() {
      var canvas = document.getElementById("wheelcanvas");
      let turnplate = this.turnplate;
      if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 516, 516);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        // ctx.strokeStyle = "#FFBE04";
        ctx.strokeStyle = "#fff";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = "bold 22px Microsoft YaHei";

        $.when(this.loadImg(turnplate.imgs)).done(function(awardPic) {
          for (var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(
              258,
              258,
              turnplate.outsideRadius,
              angle,
              angle + arc,
              false
            );
            ctx.arc(258, 258, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "#E83800";
            //ctx.fillStyle = turnplate.fontcolors[i];
            var text = turnplate.restaraunts[i];
            var line_height = 30;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(
              258 + Math.cos(angle + arc / 2) * turnplate.textRadius,
              258 + Math.sin(angle + arc / 2) * turnplate.textRadius
            );

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text.indexOf("\n") > 0) {
              //换行
              var texts = text.split("\n");
              for (var j = 0; j < texts.length; j++) {
                ctx.font =
                  j == 0 ? "22px Microsoft YaHei" : "22px Microsoft YaHei";
                //ctx.fillStyle = j == 0?'#FFFFFF':'#FFFFFF';
                if (j == 0) {
                  //ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
                  ctx.fillText(
                    texts[j],
                    -ctx.measureText(texts[j]).width / 2,
                    j * line_height
                  );
                } else {
                  ctx.fillText(
                    texts[j],
                    -ctx.measureText(texts[j]).width / 2,
                    j * line_height
                  );
                }
              }
            } else if (text.indexOf("\n") == -1 && text.length > 6) {
              //奖品名称长度超过一定范围
              text = text.substring(0, 6) + "||" + text.substring(6);
              var texts = text.split("||");
              for (var j = 0; j < texts.length; j++) {
                ctx.fillText(
                  texts[j],
                  -ctx.measureText(texts[j]).width / 2,
                  j * line_height
                );
              }
            } else {
              //在画布上绘制填色的文本。文本的默认颜色是黑色
              //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
              ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }

            ctx.drawImage(awardPic[i], -30, 30, 55, 50);
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
          }
        });
      }
    },
    loadImg(imgs) {
      var num = imgs.length;
      var dtd = $.Deferred();
      var countImg = 0;
      var awardPic = this.awardPic;
      if (awardPic.length) {
        return dtd.resolve(awardPic);
      }
      for (var i = 0; i < num; i++) {
        var img = new Image();
        awardPic.push(img);
        img.src = imgs[i];
        img.onload = function() {
          countImg++;
          if (countImg == num) {
            dtd.resolve(awardPic);
          }
        };
      }
      return dtd.promise();
    },
    save() {
      localStorage.end = this.theEnd();
      localStorage.gifts = $(".cjjg").text();
    },
    theEnd() {
      $("#tupBtn").unbind("click"); //提交成功解除点击事件。
      return 2;
    },
    close_xxcy() {
      $("#xxcy-main").fadeOut();
      // window.location.reload();
    },
    close_msg() {
      $(".noPhone").fadeOut();
    },
    close_zj() {
      $("#zj-main").fadeOut();
    },
    scrollStart() {
      if (this.lists.length > 1) {
        $(".bulletin").Scroll({ line: 1, speed: 1000, timer: 3000 });
      }
    },
    play() {
      let myAudio = document.getElementById("myAudio");
      if (myAudio.paused) {
        myAudio.play();
      } else {
        myAudio.pause();
      }
    },
    close_phone() {
      $(".phone").fadeOut();
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
              $("#zj-main").fadeIn();
              $("#jiangpin").text(res.data.content.prizeName);
              $(".prize_code").text(res.data.content.hitCode);
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
        $(".msg_text").html("请输入正确的手机号");
        $(".noPhone").fadeIn();
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
#xxcy-main,
#zj-main,
.noPhone {
  display: none;
}
.turnplate {
  background-image: url("../img/turnbg@3x.png");
  background-size: 100% 100%;
  font-size: 24px;
}
.banner {
  display: block;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.banner .turnplate {
  display: block;
  width: 100%;
  position: relative;
}

.banner .turnplate canvas.item {
  width: 100%;
}

.banner .turnplate #tupBtn {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 24%;
  top: 40%;
  border: 0;
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

.banner .turnplate img {
  width: 100%;
  height: auto;
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
.msg,
.zj-main .txzl {
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
  /* line-height: 80vw; */
  height: 86vw;
}
.xxcy .xxcy_text,
.zj-main .txzl .zj_text {
  width: 100%;
  text-align: center;
  margin: 42vw auto;
}
.msg .msg_text {
  color: rgba(255, 43, 113, 1);
  margin: 50vw auto;
  width: 80%;
  font-size: 5vw;
  text-align: center;
}
.zj-main .txzl .zj_text {
  color: rgba(255, 43, 113, 1);
  font-size: 5vw;
}
.zj-main .txzl .zj_text #prize_code {
  display: block;
  width: 40vw;
  margin: 5vw auto;
  background: rgba(235, 233, 240, 1);
  padding: 2vw 0;
  color: rgba(184, 184, 184, 1);
  font-size: 4vw;
}
.zj-main .txzl .zj_text .prize_code {
  color: rgba(19, 34, 58, 1);
  font-size: 5vw;
  margin-left: 2vw;
}

.xxcy-main .close_xxcy,
.msg .close_msg,
.zj-main .close_zj {
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

.zj-main {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7);
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  *zoom: 1;
  z-index: 10;
  left: center;
  top: 0;
}

body {
  font-size: 12px;
}

.bulletin {
  color: #fff;
  float: left;
  height: 8vw;
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
  width: 100%;
  padding-left: 40px;
}
.bulletin li {
  width: 100%;
  height: 8vw;
  /* padding-left: 25px; */
  line-height: 8vw;
  /* padding: 1vw 26vw; */
}
a {
  text-decoration: none;
  color: #fff;
  font-size: 4vw;
}

ul li {
  list-style-type: none;
}

.bga {
  background: url("../img/bg.png") no-repeat;
  background-size: 100% 100%;
  height: 110vh;
  position: relative;
}
.kePublic {
  position: absolute;
  top: 50vw;
}
.word {
  position: absolute;
  top: 10vw;
  left: 15vw;
}
.word .word_img {
  width: 85%;
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
  margin: 0 auto;
  border: none;
  background: #ebe9f0;
  padding: 3vw;
  outline: none;
  display: block;
}
.phone .phone_input button {
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
</style>


