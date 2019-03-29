<template>
    <div class="head">
        <div class="turn-back" @click="turnBack($event)">
            <img src="../assets/icon/left-direction.png" alt="">
        </div>
        <div class="title">{{headName}}</div>
    </div>
</template>
<script>
    export default {
        props: {
            headName: {
                type: String,
                default: ''
            },
            goFirst: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            turnBack (event) {
                if ((window !== window.parent) && this.goFirst) {
                    var fatherDoc = window.parent.document;
                    var oInsurance = fatherDoc.getElementById('insurance');
                    var oSharebg = fatherDoc.getElementsByClassName('sharebg-active')[0];
                    oInsurance.classList.remove('am-modal-active-right');
                    fatherDoc.body.removeChild(oSharebg);
                    console.log(oInsurance);                   
                } else {
                    this.$router.go(-1);
                }
                // var protocol = location.protocol || 'http:';

                // var API_URL = (function () {
                //     if (/^dev-/.test(location.hostname)) {
                //         return protocol + "//dev-"
                //     } else if(/^test-/.test(location.hostname)){
                //         return protocol + "//test-"
                //     } else {
                //         return protocol + "//"
                //     }
                // }())
                // if (window === window.parent) {
                //     this.$router.go(-1);
                // } else {
                //     if (this.goFirst) {
                //         let nowLen = history.length ;
                //         let historyLen = Number(sessionStorage.getItem('historyLen'));
                //         console.log('nowLen',nowLen)
                //         console.log('go',(historyLen-nowLen))
                //         sessionStorage.removeItem('historyLen');
                //         history.go(historyLen-nowLen);
                //     } else {
                //         historyMemory(1);
                //         this.$router.go(-1);
                //     }
                // }
            }
        }
        
    }
</script>

<style lang='less'>
    .head{
        width: 750px;
        box-sizing: border-box;
        height: 80px;
        margin: 0 auto;
        // padding-top: 20px;
        // padding: 10px 24px 10px 24px;
        // text-align: center;
        position: relative;
        // line-height: 60px;
        box-shadow: 2px 8px 10px #eee;
        padding-top: 20px;
        text-align: center;
        position: relative;
        line-height: 30px;   
        background-color: #fff;     
        .turn-back{
            // position: absolute;
            // left: 24px;
            // top: 12px;
            margin-left: 24px;
            // width: 40px;
            // height: 40px;
            position: absolute;
            left: 0px;
            top: 20px;
            width: 30px;
            height: 30px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .title{
            display: inline-block;
            font-size: 36px;/*px*/
        }
    }
</style>