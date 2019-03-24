<template>
    <div class="policy-classify">
        <ls-head :headName="headName"/>
        <div class="classify-wrap">
            <div class="classify-list" v-for="(item,index) in policyArr" :key="index">
                <div class="name-wrap">
                    <div class="name">{{item.risk_name}}</div>
                    <div class="choose">
                        <span>{{item.premium | divisionHundred}}元/份</span>
                        <div class="img-wrap" @click="selectPolicy($event, index)">
                            <img src="@/assets/icon/choose-circle.png" alt="" v-if="item.id === policy_id">
                            <img src="@/assets/icon/circle.png" alt="" v-else>
                        </div>
                    </div>
                </div>
                <div class="info-wrap">
                    <span class="policy-duration">
                        险期：
                        <span>{{`${item.periodmin}-${item.periodmax}`}}天</span>
                    </span>
                    <span>{{item.remark}}</span>
                    <span class="policy-sum">
                        保额：
                        <span>{{item.amount}}元</span>
                    </span>
                </div>
            </div>
        </div>   
        <!-- 留空白，防止最后一行被遮挡 -->
        <div class="white-space"></div> 
        <div class="protocols-submit">
            <div class="protocols-wrap">
                <div class="img-wrap" @click="changeAgree($event)">
                    <img src="@/assets/icon/square.png" alt="" v-if="!agreePolicyProtocols">
                    <img src="@/assets/icon/choose-square.png" alt="" v-if="agreePolicyProtocols">
                </div>
                <div class="protocols">
                    我已阅读
                    <span @click="showProtocols($event)">投保须知</span>
                </div>
            </div>
            <div class="submit" @click="toSelectPerson($event)">
                确定
            </div>
        </div>
        <div class="protocols-detail" v-if='showPolicyProtocols'>
            <div class="content">
                <div class="close-wrap">
                    <img src="@/assets/icon/close.png" alt="" @click="hideProtocols($event)">
                </div>
                <div class="word-wrap">
                    <iframe src="https://g.yunbisai.com/file/ins.html" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import lsHead from '@/components/lsHead.vue'
import {mapState, mapMutations} from 'vuex'
import {postInsuranceClassify} from '@/api/api.js'
export default {
    data () {
        return {
            headName: '请选择保险',
            showPolicyProtocols: false,//显示保险协议
            agreePolicyProtocols: false,//是否同意保险协议
            policyArr: [ 
                {
                    "id":"1",  //险种id
                    "risk_code":"EAA",  //险种代码
                    "risk_name":"个人意外险",  //险种名字
                    "periodmin":"1",  //保险最小期限
                    "amount":"200600", //保额
                    "premium":"1000",  //保险费
                    "periodmax":"3",  //保险最大期限
                    "ROW_NUMBER":"1" 
                },
                {
                    "id":"2",
                    "risk_code":"EAA",
                    "risk_name":"个人意外险",
                    "periodmin":"4",
                    "amount":"200600",
                    "premium":"1500",
                    "periodmax":"5",
                    "ROW_NUMBER":"2"
                },
                {
                    "id":"3",
                    "risk_code":"EAA",
                    "risk_name":"个人意外险",
                    "periodmin":"6",
                    "amount":"200600",
                    "premium":"2000",
                    "periodmax":"7",
                    "ROW_NUMBER":"3"
                },
                {
                    "id":"4",
                    "risk_code":"EAC",
                    "risk_name":"团体意外险",
                    "periodmin":"1",
                    "amount":"120600",
                    "premium":"450",
                    "periodmax":"3",
                    "ROW_NUMBER":"4"
                }
            ],
            policy_id: '',    //选择的id
            selected_index: 0  //选择的序号
        }
    },
    components: {
        lsHead
    },
    computed: {
        ...mapState(['money'])
    },
    methods: {
        // ...mapMutations(['changeMoney']) ,
        // 获取保险种类信息
        getInfo () {
            postInsuranceClassify({
                ssid: this.ssid
            })
            .then((res) => {
                console.log(res)
                if (res.data.errcode === 0) {
                    this.policyArr = res.data.list;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('网络错误')
            })
        },
        initData () {
            this.getInfo();
        },
        // 选择保险种类
        selectPolicy (event, index) {
            this.policy_id = this.policyArr[index].id;
            this.selectedIndex = index;
        },
        // 选择是否同意保险协议
        changeAgree (event) {
            this.agreePolicyProtocols = !this.agreePolicyProtocols;
        },
        showProtocols (event) {
            if (window === window.parent) {
                this.showPolicyProtocols = true;
            } else {
                window.open('https://g.yunbisai.com/file/ins.html');
            }

            // this.changeMoney(10);
        },
        hideProtocols (event) {
            this.showPolicyProtocols = false;
        },
        toSelectPerson (event) {
            if (!this.policy_id) {
                this.$message("您未选择保险");
                return
            }
            if (!this.agreePolicyProtocols) {
                this.$message("您未同意投保须知");
                return
            }

            this.$router.push({
                path: '/insurance/selectPerson',
                query: {
                    oneCost: this.policyArr[this.selectedIndex].premium,
                    groupId: this.groupId,
                    policyId: this.policy_id,
                    eventId: this.$route.query.eventId
                }
            })

        },
        turnBack (event) {
            this.$router.go(-1);
        }
    },
    created() {
        this.ssid = this.$cookie.get('ssid');
        this.groupId = this.$route.query.groupId;
        console.log('cookie.ssid:', this.ssid);
        this.initData();
    },
    filters: {
        divisionHundred (value) {
            return (Number(value)/100).toFixed(2);
        }
    }

}
</script>
<style lang="less">
.policy-classify{
    width: 100%;
    height: 100%;
    position: relative;
    // .head{
    //     width: 702px;
    //     height: 30px;
    //     margin: 0 auto;
    //     padding-top: 20px;
    //     text-align: center;
    //     position: relative;
    //     line-height: 30px;
    //     .turn-back{
    //         position: absolute;
    //         left: 0px;
    //         top: 20px;
    //         width: 30px;
    //         height: 30px;
    //         img{
    //             width: 100%;
    //             height: 100%;
    //         }
    //     }
    //     .title{
    //         display: inline-block;
    //         font-size: 34px;
    //     }
    // }   
    .classify-wrap{
        width: 702px;
        box-sizing: border-box;
        padding: 30px 20px 0px 20px;
        margin: 10px auto 0;
        box-shadow: 0px 0px 16px #eee;

        .classify-list{
            width: 100%;
            padding-bottom: 30px;
            padding-top: 30px;
            border-bottom: 2px solid #f4f4f4;
            .name-wrap{
                width: 100%;
                display: flex;
                margin-bottom: 10px;
                justify-content: space-between;
                .name{
                    font-size: 30px; 
                    font-weight: 500;
                    color: #333;
                }
                .choose{
                    .img-wrap{
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        margin-left: 50px;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    span{
                        font-size: 30px; 
                        font-weight: 500;
                        color: #333;
                    }
                }
            }
            .info-wrap{
                width: 100%;
                color: #999;
                text-align: left;
                font-size: 26px; 
                .policy-duration{
                    margin-right: 20px;
                }
            }
        }
    }
    .white-space{
        width: 100%;
        height: 180px;
    }
    .protocols-submit{
        width: 100%;
        position: fixed;
        bottom: 0px;
        left:0;
        background-color: #fff;
        padding-bottom: 30px;
        .protocols-wrap{
            width: 702px;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 20px;
            .img-wrap{
                width: 30px;
                height: 30px;
                display: inline-block;
                position: relative;
                top: 6px;
                // vertical-align: middle;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .protocols{
                display: inline-block;
                margin-left: 30px;
                font-size: 28px;
                letter-spacing: 4px;
                span{
                    display: inline-block;
                    color: #3399ff;
                    text-decoration: underline;
                    transform: translateX(-4px);
                }
            }
        }
        .submit{
            width: 702px;
            height: 80px;
            margin: 0 auto;
            background-color: #3399ff;
            text-align: center;
            line-height: 80px;
            border-radius: 40px;
            color: #fff;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;
        }
    }
    .protocols-detail{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        .content{
            position: relative;
            width: 80%;
            height: 80%;
            max-width: 919px;
            background-color: #fff;
            border-radius: 40px;
            border: 2px solid #eee;
            overflow: hidden;
            .close-wrap{
                text-align: right;
                margin-right: 20px;
                margin-top: 20px;
                img{
                    width: 50px;
                    height: 50px;
                }
            }
            .word-wrap{
                position: absolute;
                top: 80px;
                bottom: 20px;
                right: 10px;
                left: 10px;
                background-color: #fff;
                iframe{
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 0 6px #aaa;
                }
            }

        }
    }
}
</style>
