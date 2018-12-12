<template>
  <section class="bga">
    <!-- <div > -->
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

    <div class="kePublic">
      <!--转盘效果开始-->
      <div style="margin:0 auto">
        <div class="banner">
          <div class="turnplate">
            <canvas class="item" id="wheelcanvas" width="516" height="516"></canvas>
            <div class="pointBg">
              <img id="tupBtn" class="pointer" :src="imgPoint">
            </div>
          </div>
        </div>
      </div>
      <!--转盘效果结束-->
      <div class="clear"></div>
    </div>
    <!-- </div> -->
  </section>
</template>
<script>
import { stopRotate, rotate } from "../util/awardrotate.js";
import { Scroll } from "../util/scroll.js";
import { postPreview } from "../api/api.js";
// import { getPrize } from "../api/api.js";
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
      lists: ["获奖名单"],
      phone: "",
      item: "",
      msg: "",
      content: "",
      //   token: window.location.hash.split("=")[1].split("&")[0],
      //   aid: window.location.hash.split("=")[2]
      //   aid: "5c08b10564231e0b3aab487f",
      aid: window.location.hash.split("=")[1],
      awardPic: []
      //   type: ""
    };
  },
  methods: {
    getData() {
      let param = {
        id: this.aid
      };
      postPreview(param).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          let prize;
          let records;
          var arr = [];
          let newArr = [];
          let newImg = [];
          this.type = res.data.content.type;
          prize = res.data.content.prizes;
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
            console.log(arr[i].img);
            newArr.push(arr[i].name);
            newImg.push(arr[i].img);
          }

          this.turnplate.restaraunts = newArr;
          this.turnplate.imgs = newImg;

          this.drawRouletteWheel();
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

    play() {
      let myAudio = document.getElementById("myAudio");
      if (myAudio.paused) {
        myAudio.play();
      } else {
        myAudio.pause();
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

body {
  font-size: 12px;
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
  height: 100vh;
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
</style>


