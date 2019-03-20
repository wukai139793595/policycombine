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
        props:['headName'],
        methods: {
            turnBack (event) {
                this.$router.go(-1);
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
            font-size: 30px;
        }
    }
</style>