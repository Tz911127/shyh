<template>
  <section class="bga">
    <previewRotate v-if="type=='1'"></previewRotate>
    <previewRota v-if="type=='2'"></previewRota>
  </section>
</template>
<script>
// import { stopRotate, rotate } from "../util/awardrotate.js";
// import { Scroll } from "../util/scroll.js";
import { postPreview } from "../api/api.js";
import previewRotate from "../components/previewRotate";
import previewRota from "../components/previewRota";
export default {
  components: {
    previewRotate,
    previewRota
  },
  data() {
    return {
      imgPoint: require("../img/click_text@3x.png"),
      bg_img: require("../img/turnplate-bg_2.png"),
      turnplate: {
        restaraunts: [], //大转盘奖品名称
        colors: [
          "#FFF6E8",
          "#FFFFFF",
          "#FFF6E8",
          "#FFFFFF",
          "#FFF6E8",
          "#FFFFFF",
          "#FFF6E8",
          "#FFFFFF"
        ], //大转盘奖品区块对应背景颜色
        //fontcolors:[],				//大转盘奖品区块对应文字颜色
        outsideRadius: 222, //大转盘外圆的半径
        textRadius: 165, //大转盘奖品位置距离圆心的距离
        insideRadius: 65, //大转盘内圆的半径
        startAngle: 0, //开始角度
        bRotate: false
      },
      lists: ["获奖名单"],
      phone: "",
      item: "",
      msg: "",
      content: "",
      aid: window.location.hash.split("=")[1],
      //   aid: "5c08b10564231e0b3aab487f",
      type: ""
    };
  },
  methods: {
    getData() {
      let param = {
        // aid: this.aid
        id: this.aid
      };
      postPreview(param).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          let prize;
          let records;
          var arr = [];
          this.type = res.data.content.type;
          prize = res.data.content.prizes;
          for (let i = 0; i < prize.length; i++) {
            this.turnplate.restaraunts.push(prize[i].name);
            arr.push(prize[i].name);
          }
          for (let i = 0; i < 8 - this.turnplate.restaraunts.length; i++) {
            arr.push("谢谢参与");
          }
          for (var i = 0; i < 8; i++) {
            arr[i] = arr[i];
          }
          arr.sort(function() {
            return 0.5 - Math.random();
          });
          this.turnplate.restaraunts = arr;

          //   this.drawRouletteWheel();
        }
      });
    },

    //转盘渲染

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

