<template>
  <section>
    <!-- v-if="type=='1'"
    v-if="type=='2'"-->
    <test v-if="type=='1'"></test>
    <rota v-if="type=='2'"></rota>
    <!-- 获奖名单 -->
    <div class="main clearfix">
      <div class="bulletin">
        <div class="tit">获奖名单</div>
        <div style="overflow: hidden;">
          <ul style="margin-top: 0px;">
            <li v-for="list in lists" :key="list">
              <a href="javascript:;">{{list}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 二维码 -->
    <div class="banner-box">
      <img v-show="flag" style="width:150px;height:150px" src="../img/over.png" alt>
    </div>
  </section>
</template>
<script>
import { stopRotate, rotate } from "../util/awardrotate.js";
import { Scroll } from "../util/scroll.js";
import { qrcode } from "../util/jquery.qrcode.min.js";
import { getPrize, getPrize_time } from "../api/api.js";
import test from "../components/test";
import rota from "../components/rota";
import haha from "../img/haha@3x.png";
import money from "../img/moneycopy@3x.png";
export default {
  components: {
    test,
    rota
  },
  data() {
    var token = window.location.search.split("=")[1];
    return {
      token: window.location.hash.split("=")[1],
      type: "",
      lists: [""],
      url: "",
      turnplate: {
        restaraunts: [],
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
      awardPics: [],
      flag: false
    };
  },
  methods: {
    getData() {
      var token = {
        token: this.token
      };
      getPrize(token).then(res => {
        if (res.data.code == 1) {
          this.type = res.data.content.activity.type;
          this.url = res.data.content.activity.link;
          var records;
          records = res.data.content.records;
          for (var i = 0; i < records.length; i++) {
            this.lists.unshift(
              "恭喜" +
                records[i].telephone +
                "手机用户获得" +
                records[i].prizeName
            );
          }
          this.scrollStart(records);
          this.$nextTick(function() {
            this.edit();
          });
        }
      });
    },
    changeData() {
      var token = {
        token: this.token
      };
      var that = this;
      setInterval(function() {
        getPrize_time(token).then(res => {
          if (res.data.code == 1) {
            that.type = res.data.content.activity.type;
            $(".banner-box > canvas").remove();
            that.url = res.data.content.activity.link;
            // that.flag = false;
            $(".banner-box > img").hide();
            $(".bulletin").unbind();
            var records;
            records = res.data.content.records;
            that.lists = [""];
            for (var i = 0; i < records.length; i++) {
              that.lists.unshift(
                "恭喜" +
                  records[i].telephone +
                  "手机用户获得" +
                  records[i].prizeName
              );
            }
            // if (records.length > 4) {
            that.scrollStart(records);
            // }else {
            //  console.log($(".bulletin").Scroll())
            // }
            that.scrollStart(records);
            that.$nextTick(function() {
              that.edit();
            });

            // $('#luck').empty()
            let prize;
            var arr = [];
            let newArr = [];
            let newImg = [];
            prize = res.data.content.activity.prizes;
            that.turnplate.restaraunts = [];
            that.turnplate.imgs = [];
            for (let i = 0; i < prize.length; i++) {
              that.turnplate.restaraunts.push(prize[i].name);
              arr.push({ name: prize[i].name, img: money });
            }
            for (let i = 0; i < 8 - that.turnplate.restaraunts.length; i++) {
              arr.push({ name: "谢谢参与", img: haha });
            }

            // console.log(that.turnplate.imgs)
            arr.sort(function() {
              return 0.5 - Math.random();
            });
            for (let i = 0; i < arr.length; i++) {
              newArr.push(arr[i].name);
              newImg.push(arr[i].img);
            }
            that.turnplate.restaraunts = newArr;
            that.turnplate.imgs = newImg;
            if (that.type == 1) {
              that.awardPics = [];
              that.drawRouletteWheel();
            } else {
              $(".luck-unit-0>.luck_td>span").html(arr[0].name);
              $(".luck-unit-0>.luck_td>img").attr("src", arr[0].img);
              $(".luck-unit-1>.luck_td>span").html(arr[1].name);
              $(".luck-unit-1>.luck_td>img").attr("src", arr[1].img);
              $(".luck-unit-2>.luck_td>span").html(arr[2].name);
              $(".luck-unit-2>.luck_td>img").attr("src", arr[2].img);
              $(".luck-unit-7>.luck_td>span").html(arr[7].name);
              $(".luck-unit-7>.luck_td>img").attr("src", arr[7].img);
              $(".luck-unit-3>.luck_td>span").html(arr[3].name);
              $(".luck-unit-3>.luck_td>img").attr("src", arr[3].img);
              $(".luck-unit-6>.luck_td>span").html(arr[6].name);
              $(".luck-unit-6>.luck_td>img").attr("src", arr[6].img);
              $(".luck-unit-5>.luck_td>span").html(arr[5].name);
              $(".luck-unit-5>.luck_td>img").attr("src", arr[5].img);
              $(".luck-unit-4>.luck_td>span").html(arr[4].name);
              $(".luck-unit-4>.luck_td>img").attr("src", arr[4].img);
            }
          } else {
            that.flag = true;
            $(".banner-box > canvas").hide();
            $(".banner-box > img").show();
          }
        });
      }, 30*60*1000);
    },
    scrollStart(data) {
      if (data.length > 3) {
        $(".bulletin").Scroll({ line: 1, speed: 1000, timer: 3000 });
      } else {
      }
    },
    edit() {
      $(".banner-box").qrcode({
        render: "canvas",
        width: 150,
        height: 150,
        text: this.url /*可以通过ajax请求动态设置*/
      });
      $(".banner-box").show();
    },

    drawRouletteWheel() {
      var canvas = document.getElementById("wheelcanvas");
      let turnplate = this.turnplate;
      if (canvas) {
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
        $.when(this.loadImg(turnplate.imgs)).done(function(awardPics) {
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
            ctx.drawImage(awardPics[i], -30, 30, 55, 50);
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
      var awardPics = this.awardPics;
      if (awardPics.length) {
        return dtd.resolve(awardPics);
      }
      for (var i = 0; i < num; i++) {
        var img = new Image();
        awardPics.push(img);
        img.src = imgs[i];
        img.onload = function() {
          countImg++;
          if (countImg == num) {
            dtd.resolve(awardPics);
          }
        };
      }
      return dtd.promise();
    }
  },
  mounted() {
    this.getData();
  },
  created() {
    this.changeData();
  }
};
</script>
<style>
.bulletin {
  color: #fff;
  float: left;
  height: 16vw;
  margin: 0 20px 0 20px;
  overflow: hidden;
  position: absolute;
  top: 60%;
  background: rgba(216, 216, 216, 0.5);
  left: 50%;
  border-radius: 0.5vw;
  width: 36%;
}
.bulletin .tit {
  padding-left: 25px;
  height: 20px;
  line-height: 20px;
}
.bulletin a {
  float: left;
  width: 100%;
  text-decoration: none;
  color: #fff;
}
.bulletin ul {
  width: 100%;
}
.bulletin li {
  width: 100%;
  height: 3.25vw;
  line-height: 3.25vw;
  padding-left: 25px;
  list-style: none;
}
.banner-box {
  display: none;
  text-align: center;
  position: absolute;
  top: 25%;
  left: 58%;
  transform: translateX(-50%);
  padding: 5px;
  background: #fff;
}
#qrccode-canvas {
  position: absolute;
  top: 5vw;
  width: 13vw !important;
  height: 13vw !important;
}
</style>


