<template>
    <div class="write-info">
        <!-- <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="" @click="turnBack($event)">
            </div>
            <div class="title">填写信息</div>
        </div> -->
        <ls-head :headName='headName'/>
        <div class="set-time">
            <p>请设置保险起止时间</p>
            <div class="time-wrap">
                <el-date-picker
                    @change="infoChange"
                    class="data-picker"
                    v-model="startTime"
                    type="date"
                    :placeholder="today|moment('YYYY-MM-DD')"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <div class="striping"></div>
                <el-date-picker
                    @change="infoChange"
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
            <p>请填写投保人信息</p>
            <div class="info-content">               
                <div class="name-wrap">
                    <span class="name">姓名</span>
                    <input type="text" placeholder="输入投保人姓名" @input="infoChange" v-model="name" >
                </div>
                <div class="identify-wrap">
                    <span class="name">证件类型</span>
                      <el-select v-model="selectCertificate" placeholder="请选择" @change="infoChange">
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
                    <input type="text" placeholder="输入投保人身份证" @input="infoChange" v-model="certificateValue">
                </div>
                <div class="sex-wrap">
                    <span class="name">性别</span>
                    <el-radio v-model="sex" label="0">男</el-radio>
                    <el-radio v-model="sex" label="1">女</el-radio>                    
                </div>
                <div class="phone-wrap">
                    <span class="name">电话</span>
                    <input type="text" placeholder="输入投保人电话" @input="infoChange" v-model="phone">
                </div>
                <div class="email-wrap">
                    <span class="name">邮箱</span>
                    <input type="text" placeholder="输入投保人邮箱" @input="infoChange" v-model="email"> 
                </div>
                
                <!-- <div class="relative-wrap">
                    <span class="name">关系</span>
                    <el-select class="el-se-relative" v-model="selectRelative" placeholder="请选择与被保人关系" @change="infoChange">
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
                        <img class="pay-icon" src="../assets/icon/bank.png" alt="">
                        <div class="name-wrap">
                            <div class="name">建行支付宝</div>
                            
                            <!-- <div class="bank-number">储蓄卡<span>(3365)</span></div> -->
                        </div>
                    </div>
                    <div class="bank-right" @click="changePayWay($event, 'aliChoose')">
                        <img src="../assets/icon/choose-circle.png" alt="" class="icon-common" v-if="chooseWay === 'aliChoose'">
                        <img src="../assets/icon/circle.png" alt="" class="icon-common" v-else>                        
                    </div>
                </div>
                <div class="bank-wrap">
                    <div class="bank-left">
                        <img class="pay-icon" src="../assets/icon/bank.png" alt="">
                        <div class="name-wrap">
                            <div class="name">建行微信</div>
                            <!-- <div class="bank-number">储蓄卡<span>(3365)</span></div> -->
                        </div>
                    </div>
                    <div class="bank-right" @click="changePayWay($event, 'wxChoose')">
                        <img src="../assets/icon/choose-circle.png" alt="" class="icon-common" v-if="chooseWay === 'wxChoose'">
                        <img src="../assets/icon/circle.png" alt="" class="icon-common" v-else>                        
                    </div>
                </div>
            </div>
        </div>
        <div class="submit" :class="{could: couldSubmit}" @click="toSubmit($event)">
            立即支付
        </div>
        <div class="qr-code-wrap" v-if="readyPay">
            <qrCode 
                :qr_code='qr_code'
                :amount= 'amount'
                :chooseWay = 'chooseWay'
                :orderId = 'orderId'
            />
        </div>
    </div>
</template>
<script>
import {postWallet, postCreateOrder, postPay,postCcbPay } from '@/api/api.js'
import {checkName,checkPhone,checkEmail,checkIdcard,API_URL} from '@/util/index.js'
import qrCode from '@/components/qrCode.vue'
import lsHead from '@/components/lsHead.vue'
export default {
    data () {
        return {
            headName: '填写信息',
            readyPay: false,
            orderId: '',
            qr_code: '',
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
            couldSubmit: false,
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
    computed: {
        totalMoney () {
            return this.$store.state.totalMoney;
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
        infoChange () {   //内容改变事件函数
            //#region 
            // console.log(this.startTime , this.endTime , this.name , this.selectCertificate , this.certificateValue , this.selectRelative , this.phone , this.email)
            // console.log(this.couldSubmit);
            //#endregion
            this.checkSubmit();
        },
        changePayWay (event, payWay) {   //改变支付渠道
            this.chooseWay = payWay;
        },
        turnBack (event) {
            this.$router.go(-1);
        },
        checkInfoCorrect () {   //校验用户填写的信息格式是否正确
            if (!checkName(this.name)) {
                this.$message.error('请输入正确的中文名字')
                return false
            }            
            if (this.selectCertificate == '1' && !checkIdcard(this.certificateValue)) {
                this.$message.error('请输入正确的身份证号')
                return false
            }
            if(!checkPhone(this.phone)) {
                this.$message.error('请输入正确的手机号');
                return false
            }
            if(!checkEmail(this.email)) {
                this.$message.error('请输入正确的邮箱');
                return false                
            }
            return true;
        },
        createOrder () {     //创建订单函数
            var that = this;
            var users = new Array(this.selectArr.length);
            this.selectArr.forEach((ele, ind) => {
                users[ind] = {
                    name: ele.name,
                    id_card: ele.idcard,
                    type: ele.cardtype,
                    tel: ele.tel,
                    birthday: ele.birthday
                }
            })
            var data = {
                ssid: this.ssid,
                // org_id: 1,
                // entrance: 1,  //该参数已删除
                event_group_id: this.$route.query.groupId,
                id: this.$route.query.policyId,
                begin_time: this.startTime,
                end_time: this.endTime,
                users: users,
                applicant: {
                    id_card_name: this.name,
                    id_card: this.certificateValue,
                    tel: this.phone,
                    email: this.email,
                    type: this.selectCertificate,
                    sex: this.sex,
                    relation: this.selectRelative
                }
            };
            //创建订单
            console.log('users',users);
            postCreateOrder(data)
            .then((res) => {
                console.log('createPay',res)
                if (res.data.errcode === 0) {
                    this.orderId = res.data.order_id;
                    if (this.chooseWay === 'balanceChoose') {
                        return postPay({
                            ssid: this.ssid,
                            order_id: res.data.order_id
                        })
                    } else if (this.chooseWay === 'aliChoose'){
                        return postCcbPay({
                            ssid: this.ssid,
                            orderid: res.data.order_id,
                            type: 16,
                            paytype: 'ali'                        
                        })
                    } else if (this.chooseWay === 'wxChoose') {
                        return postCcbPay({
                            ssid: this.ssid,
                            orderid: res.data.order_id,
                            type: 16,
                            paytype: 'wx'                        
                        })                        
                    } 
                } else {
                    this.$message.error(res.data.msg);
                }
            },(err) => {
                this.$message.error('网络错误')
            })
            // 余额支付成功和建行二维码url返回
            .then((res) => {
                if (res.data.errcode === 0 || res.data.error === 0) {
                    if (this.chooseWay === 'balanceChoose') {
                        this.$store.commit('changeUser',[]);  //支付成功后清除数据
                        this.$alert('余额支付成功', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({
                                    path: '/insurance/policy'
                                })
                            }
                        }); 
                    } else if (this.chooseWay === 'aliChoose' || this.chooseWay === 'wxChoose') {
                        console.log(this.chooseWay,res)
                        this.qr_code = res.data.datArr.qr_code;
                        this.amount = res.data.datArr.amount;
                        this.readyPay = true;
                    }   
                } else {
                    this.$message.error(res.data.msg)
                }
            },(err) => {
                console.log(5555)
                this.$message.error('网络错误')
            })

        },
        toSubmit() {
            if (!this.couldSubmit) {   //判断信息是否输入完整
                return
            }
            if (!this.checkInfoCorrect()) {    //判断信息格式
                return 
            }
            this.createOrder();

        }
      
    },
    computed: {  
        //vue中的客户信息
        selectArr () {
            return this.$store.state.selectArr
        }
    },
    created () {
        this.ssid = this.$cookie.get('ssid');
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
    }
}
</script>
<style lang="less">
.write-info{
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
    .submit{
        width: 702px;
        height: 80px;
        margin: 0 auto;
        background-color: #eee;
        text-align: center;
        line-height: 80px;
        border-radius: 40px;
        color: #666;
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 8px;
    }
    .could{
        color: #fff;
        background-color: #3399ff;
    }
    .qr-code-wrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #fff;
    }
}
</style>

