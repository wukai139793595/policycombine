<template>
    <div class="unpaid">
        <!-- <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="" @click="turnBack($event)">
            </div>
            <div class="title">填写信息</div>
        </div> -->
        <ls-head :headName='headName'/>
        <div class="set-time">
            <p>保险起止时间</p>
            <div class="time-wrap">
                <el-date-picker
                    disabled
                    
                    class="data-picker"
                    v-model="startTime"
                    type="date"
                    :placeholder="today|moment('YYYY-MM-DD')"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <div class="striping"></div>
                <el-date-picker
                    disabled
                    class="data-picker"
                    v-model="endTime"
                    type="date"
                    :placeholder="today|moment('YYYY-MM-DD')"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <div class="info-wrap">
            <p>投保人信息</p>
            <div class="info-content">               
                <div class="name-wrap">
                    <span class="name">姓名</span>
                    <input type="text" placeholder="投保人姓名"  v-model="name" disabled>
                </div>
                <div class="identify-wrap">
                    <span class="name">证件类型</span>
                      <el-select v-model="selectCertificate" placeholder="请选择"  disabled>
                        <el-option
                        v-for="item in certificateArr"
                        :key="item.num"
                        :label="item.type"
                        :value="item.num">
                        </el-option>
                    </el-select>
                </div>
                <div class="name-wrap">
                    <span class="name">证件号</span>
                    <input type="text" placeholder="投保人身份证"  v-model="certificateValue" disabled>
                </div>
                <div class="sex-wrap">
                    <span class="name">性别</span>
                    <el-radio v-model="sex" label="0" disabled>男</el-radio>
                    <el-radio v-model="sex" label="1" disabled>女</el-radio>                    
                </div>
                <div class="phone-wrap">
                    <span class="name">电话</span>
                    <input type="text" placeholder="投保人电话"  v-model="phone" disabled>
                </div>
                <div class="email-wrap">
                    <span class="name">邮箱</span>
                    <input type="text" placeholder="投保人邮箱"  v-model="email" disabled> 
                </div>
                
                <!-- <div class="relative-wrap">
                    <span class="name">关系</span>
                    <el-select class="el-se-relative" v-model="selectRelative" placeholder="请选择与被保人关系" >
                        <el-option
                        v-for="item in relativeArr"
                        :key="item.num"
                        :label="item.type"
                        :value="item.num">
                        </el-option>
                    </el-select>                    
                </div> -->
            </div>
        </div>
        <div class="count-wrap">
            <span class="count">参保人数：{{count}}</span><span class="total-money">合计金额：{{totalAmount}}</span>
        </div>
        <div class="pay-way">
            <p>请选择支付方式</p>
            <div class="way-wrap">
                <!-- <div class="balance-wrap">
                    <div class="balance-left">
                        <img class="pay-icon" src="../assets/icon/money@2x.png" alt="">
                        <div class="balance-hint">
                            <div class="balance-word">余额支付</div>
                            <div class="hint">可用额度<span>{{wallet}}元</span></div>
                        </div>
                    </div>
                    <div class="balance-right" @click="changePayWay($event,'balanceChoose')">
                        <img src="../assets/icon/choose-circle.png" alt="" class="icon-common" v-if="chooseWay === 'balanceChoose'">
                        <img src="../assets/icon/circle.png" alt="" class="icon-common" v-else>
                    </div>
                </div> -->
                <div class="bank-wrap">
                    <div class="bank-left">
                        <img class="pay-icon" src="@/assets/icon/ali.png" alt="">
                        <div class="name-wrap">
                            <div class="name">建行支付宝</div>
                            
                            <!-- <div class="bank-number">储蓄卡<span>(3365)</span></div> -->
                        </div>
                    </div>
                    <div class="bank-right" @click="changePayWay($event, 'aliChoose')">
                        <img src="@/assets/icon/choose-circle.png" alt="" class="icon-common" v-if="chooseWay === 'aliChoose'">
                        <img src="@/assets/icon/circle.png" alt="" class="icon-common" v-else>                        
                    </div>
                </div>
                <div class="bank-wrap">
                    <div class="bank-left">
                        <img class="pay-icon" src="@/assets/icon/wx.png" alt="">
                        <div class="name-wrap">
                            <div class="name">建行微信</div>
                            <!-- <div class="bank-number">储蓄卡<span>(3365)</span></div> -->
                        </div>
                    </div>
                    <div class="bank-right" @click="changePayWay($event, 'wxChoose')">
                        <img src="@/assets/icon/choose-circle.png" alt="" class="icon-common" v-if="chooseWay === 'wxChoose'">
                        <img src="@/assets/icon/circle.png" alt="" class="icon-common" v-else>                        
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-wrap">
            <div class="cancel-btn" @click='toCancel($event)'>
                取消订单
            </div>
            <div class="submit"  @click="toSubmit($event)">
                立即支付
            </div>
        </div>
        <div class="qr-code-wrap" v-if="readyPay">
            <qrCode 
                :qr_code='qr_code'
                :amount= 'amount'
                :chooseWay = 'chooseWay'
                :orderId = 'orderId'
                :backUrl = 'backUrl'
            />
        </div>  
    </div>
</template>

<script>
import qrCode from '@/components/qrCode.vue'
import lsHead from '@/components/lsHead.vue'
import {postCancelOrder,postCcbPay} from '@/api/api.js'
    export default {
        data () {
            return {
                totalAmount: '',
                count: 0,
                headName: '未支付订单',
                readyPay: false,
                orderId: '',
                qr_code: '',
                backUrl: '',
                amount: 0,
                wallet: 0,
                sex: '0',
                chooseWay: 'wxChoose',
                name: '',
                selectCertificate: '',  //用户选择的证件类型
                certificateValue: '',    //证件号码
                selectRelative: 9,    //用户选择的关系
                phone: '',
                email: '',
                startTime: '',
                endTime: '',
                today: Date.now(),
                // couldSubmit: true,
                certificateArr:[   //证件类型
                    {
                        num: '1',
                        type: '身份证'
                    },{
                        num: '3',
                        type: '护照'
                    },{
                        num: '10',
                        type: '港澳通行证'
                    },{
                        num: '26',
                        type: '台湾居民来往内地通行证'
                    }
                    // 1:身份证,3:护照,10:港澳通行证,26:台湾居民来往内地通行证
                ],

                relativeArr: [    //投保人与被投保人关系
                    {
                        num: '0',
                        type: '本人'
                    },
                    {
                        num: '1',
                        type: '配偶'
                    },
                    {
                        num: '2',
                        type: '父母'
                    },
                    {
                        num: '3',
                        type: '子女'
                    },
                    {
                        num: '5',
                        type: '兄弟姐妹'
                    },
                    {
                        num: '6',
                        type: '祖父母、外祖父母'
                    },
                    {
                        num: '7',
                        type: '雇佣'
                    },
                    {
                        num: '9',
                        type: '其他'
                    }
                    // 0—本人,1—配偶,2—父母,3—子女,5—兄弟姐妹,6—祖父母、外祖父母,7—雇佣,9—其他
                ]

            }
        },
        methods: {
            checkSubmit () {  //判断用户信息是否填完整
                if (this.startTime && this.endTime && this.name && this.selectCertificate && this.certificateValue && this.phone && this.email) {
                    this.couldSubmit = true;
                } else {
                    this.couldSubmit = false;
                }         
            },
            changePayWay (event, payWay) {   //改变支付渠道
                this.chooseWay = payWay;
            },
            toCancel (event) {
                postCancelOrder({
                    ssid: this.ssid,
                    order_id: this.orderId
                })
                .then(res => {
                    if (res.data.errcode === 0) {
                        this.$message({
                            type: 'success',
                            message:'订单取消成功'
                        })
                        this.$router.go(-1);
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }, err => {
                    this.$message.error('网络错误')
                })
            },
            toSubmit (event) {
                let tempWap = '';
                if (this.chooseWay === 'aliChoose') {
                    tempWap = 'ali'
                } else if(this.chooseWay === 'wxChoose') {
                    tempWap = 'wx'
                }
                postCcbPay({
                    ssid: this.ssid,
                    orderid: this.orderId,
                    type: 16,
                    paytype: tempWap                     
                }).then(res => {
                    console.log('CcbPay',res)
                    if (res.data.error === 0) {
                        this.qr_code = res.data.datArr.qr_code;
                        this.amount = res.data.datArr.amount;
                        this.readyPay = true;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }, err => {
                        this.$message.error('网络错误')
                })
            }
            // infoChange () {   //内容改变事件函数
            //     //#region 
            //     // console.log(this.startTime , this.endTime , this.name , this.selectCertificate , this.certificateValue , this.selectRelative , this.phone , this.email)
            //     // console.log(this.couldSubmit);
            //     //#endregion
            //     this.checkSubmit();
            // }
        },
        created () {
            this.ssid = this.$cookie.get('ssid');
            console.log(this.$router,this.$route)
            // 获取用户余额
            // postWallet({
            //     org_id: 32,
            //     entrance: 1,
            //     ssid: this.ssid
            // })
            // .then((res) => {
            //     if (res.data.errcode === 0) {
            //         this.wallet = res.data.rows;
            //         if (this.wallet < this.totalMoney) {
            //             this.chooseWay = 'aliChoose';                 
            //         }
            //     } else {
            //         this.$message.error(res.data.msg)
            //     }
            // })
            // .catch((err) => {
            //     this.$message.error('网络错误')
            // })
        },
        components: {
            qrCode,
            lsHead
        },        
        beforeRouteEnter (to, from, next) {
            console.log('from', from);
            var tempMeta = from.meta;
            next((vm) => {
                if (tempMeta.list) {
                    vm.$data.startTime = tempMeta.list.start_date;
                    vm.$data.endTime = tempMeta.list.end_date;
                    vm.$data.name = tempMeta.list.policy_holderd_name;
                    vm.$data.selectCertificate = vm.certificateArr[tempMeta.list.policy_holderd_card_type];
                    vm.$data.certificateValue = tempMeta.list.policy_holderd_card;
                    vm.$data.sex = tempMeta.list.policy_holderd_sex;
                    vm.$data.phone = tempMeta.list.policy_holderd_tel;
                    vm.$data.email = tempMeta.list.policy_holderd_email;
                    vm.$data.orderId = tempMeta.list.order_id;
                    vm.$data.totalAmount = tempMeta.list.total_amount;
                    vm.$data.count = tempMeta.count;
                }
            })
        }
    }
</script>

<style lang='less'>
.unpaid{
    width: 100%;
    height: 100%;
    p{
        font-size: 26px;
        color: #666;
    }
    input{
        flex: 1;
        height: 60px;
        line-height:60px;
        border: none;
        margin-left: 20px;
        // background-color: #f6f6f6;
        outline: none;
    }
    input::placeholder{
        color: #9999;
    }
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
    //         font-size: 30px;
    //     }
    // }
    .set-time{
        width: 702px;       
        margin: 50px auto 0 auto;
        .time-wrap{
            width: 682px;
            height: 60px;
            margin: 30px auto 40px auto;
            display: flex;
            div{
                height: 60px;
                line-height: 60px;
                text-align: center;
            }
            .data-picker{
                width: 48%;
                text-align: center;
                .el-input__inner{
                    text-align: center;
                    font-size: 28px;
                    background-color: #eee;
                }
                .el-input__inner::placeholder{
                    text-align: center;
                    font-size: 28px;
                }
            }
            .striping{
                width: 4%;
                position: relative;
                &::after{
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    top: 50%;
                    left: 0;
                    background-color: #666;
                }
            }
        }
    }
    .info-wrap{
        width: 702px;
        margin: 0 auto;
        .info-content{
            width: 100%;
            box-sizing: border-box;
            padding: 10px 20px 10px 40px;
            margin-top: 20px;
            box-shadow: 0 0 16px #eee;
            // background-color: #f4f4f4;
            &>div{
                margin-bottom: 20px;
                margin-top: 20px;
                display: flex;
                input{
                    text-indent: 20px;
                    padding-left: 0;
                    font-size: 28px;
                }
                .name{
                    display: inline-block;
                    width: 140px;
                    color: #333;
                    font-size: 30px;
                    margin-right: 20px;
                    font-weight: bold;
                    text-align: right;
                    line-height: 56px;     
                }
                .el-radio{
                    vertical-align: middle;
                    padding-top: 10px;
                }
                .el-radio:nth-of-type(1) {
                    margin-left: 20px;
                }
            }
        }
    }
    .count-wrap{
        width: 702px;
        margin: 30px auto;
        span{
            margin-left: 30px;
            font-size: 30px;
        }
    }
    .pay-way{
        width: 702px;
        margin: 50px auto;
        .way-wrap{
            width: 662px;
            margin: 30px auto;
            padding: 10px 20px 10px 20px;
            box-shadow: 0 0 16px #eee;
            .pay-icon{
                width: 40px;
                height:40px;
            }
            &>div{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            .balance-wrap{
                // margin-bottom: 30px;
                .balance-left{
                    display: flex;
                    align-items: center;
                    .balance-hint{
                        margin-left: 20px;
                        div{
                            margin-bottom: 10px;
                            font-size: 30px; 
                            color: #333;
                        }
                        .hint{
                            color: #666;
                            font-size: 24px; 
                        }
                    }
                }
                .balance-right{
                    display: flex;
                    align-items: center;
                    .to-recharge{
                        margin-right: 40px;
                        color: #3399ff;
                        font-size: 24px;                        
                    }
                }
            }
            .bank-wrap{
                padding: 14px 0;
                .bank-left{
                    display: flex;
                    align-items: center;   
                    .name-wrap{
                        margin-left: 20px;
                        .name{
                            font-size: 30px; 
                            color: #333;    
                                               
                        }
                        .bank-number{
                            color: #666;
                            font-size: 24px;                             
                        }
                    }                 
                }
                .bank-right{
                    width: 36px;
                    height: 36px;
                }
            }
        }
    }
    .submit-wrap{
        width: 702px;
        margin: 0 auto;
        display: flex;
        .cancel-btn{
            flex: 1;
            height: 80px;
            text-align: center;
            line-height: 80px;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;   
            background-color: orange;         
        }
        .submit{
            flex: 1;
            height: 80px;
            text-align: center;
            line-height: 80px;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #fff;
            background-color: #3399ff;
        }
    }
    .qr-code-wrap{
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: transparent;
        z-index: 200;
    }
}
</style>