<template>
    <div class="write-info">
        <!-- <div class="head">
            <div class="turn-back">
                <img src="../assets/icon/left-direction.png" alt="" @click="turnBack($event)">
            </div>
            <div class="title">填写信息</div>
        </div> -->
        <ls-head :headName='headName'/>
        <div class="cue-words">
            温馨提示:比赛时间为{{gameStartTime|moment('YYYY-MM-DD')}}至{{gameEndTime|moment('YYYY-MM-DD')}}，请在合适范围内选择
        </div>
                    <!-- :placeholder="gameStartTime|moment('YYYY-MM-DD')" -->
                    <!-- :placeholder="gameStartTime|moment('YYYY-MM-DD')" -->
        <div class="set-time">
            <p>请设置保险起止时间:<span class="policy-duration">该保险险期{{selectedPolicy.periodmin}}-{{selectedPolicy.periodmax}}</span></p>
            <div class="time-wrap">
                <el-date-picker
                    @change="infoChange($event, 'startTime')"
                    class="data-picker"
                    v-model="submitInfoObj.startTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="'开始时间'"
                    :picker-options="startDatePicker"                    
                    >
                </el-date-picker>
                <div class="striping"></div>
                <el-date-picker
                    @change="infoChange($event, 'endTime')"
                    class="data-picker"
                    v-model="submitInfoObj.endTime"
                    type="date"
                    :placeholder="'结束时间'"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options='endDatePicker'
                    >
                </el-date-picker>
            </div>
        </div>
        <div class="info-wrap">
            <p>请填写投保人信息</p>
            <div class="info-content">               
                <div class="name-wrap">
                    <span class="name">姓名</span>
                    <input type="text" placeholder="输入投保人姓名" @input="infoInput($event)" v-model="submitInfoObj.name" ref="inputName" maxlength="20">
                </div>
                <div class="identify-wrap">
                    <span class="name">证件类型</span>
                      <el-select v-model="submitInfoObj.selectCertificate" placeholder="请选择" @change="certificateChange($event, 'selectCertificate')">
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
                    <input type="text" placeholder="输入投保人证件号" @blur="certificateBlur($event)" @input="infoInput($event)" v-model="submitInfoObj.certificateValue" ref="inputCertificate" maxlength="18">
                </div>
                <div class="sex-wrap">
                    <span class="name">性别</span>
                    <el-radio v-model="submitInfoObj.sex" label="0" @change="infoChange($event, 'sex')" :disabled="sexDisabled">男</el-radio>
                    <el-radio v-model="submitInfoObj.sex" label="1" @change="infoChange($event, 'sex')" :disabled="sexDisabled">女</el-radio>                    
                </div>
                <div class="phone-wrap">
                    <span class="name">电话</span>
                    <input type="phone" placeholder="输入投保人电话" @input="infoInput($event)" v-model="submitInfoObj.phone" ref="inputPhone" maxlength="11">
                </div>
                <div class="email-wrap">
                    <span class="name">邮箱</span>
                    <input type="email" placeholder="输入投保人邮箱" @input="infoInput($event)" v-model="submitInfoObj.email" ref='inputEmail'> 
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
        <div class="count-wrap">
            <span class="count">参保人数：{{personCount}}</span><span class="total-money">合计金额：{{(personCount || 0)*oneCost}}</span>
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
                        <img src="../assets/icon/choose-circle.png" alt="" class="icon-common" v-if="submitInfoObj.chooseWay === 'aliChoose'">
                        <img src="../assets/icon/circle.png" alt="" class="icon-common" v-else>                        
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
                        <img src="../assets/icon/choose-circle.png" alt="" class="icon-common" v-if="submitInfoObj.chooseWay === 'wxChoose'">
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
                :chooseWay = 'submitInfoObj.chooseWay'
                :orderId = 'orderId'
                :backUrl = 'backUrl'
            />
        </div>
    </div>
</template>
<script>
import {postWallet, postCreateOrder, postPay,postCcbPay,postCcbPayAli,postCcbPayWx } from '@/api/api.js'
import {checkName,checkPhone,checkEmail,checkIdcard,API_URL,GetDateStr,GetTheDateStr,Getsex,historyMemory} from '@/util/index.js'
import kitUtils from '@/util/kitUtils.js'
import qrCode from '@/components/qrCode.vue'
import lsHead from '@/components/lsHead.vue'
export default {
    data () {
        return {
            personCount: 0,
            sexDisabled: false,
            ccbType: 16,  //建行支付订单type
            checkSelectAll: 0,
            selectedPolicy:{},
            startDatePicker: this.beginDate(),  
            endDatePicker:this.processDate(),
            selectArr: [],
            backUrl: '',
            headName: '填写信息',
            readyPay: false,
            orderId: '',
            qr_code: '',
            amount: 0,
            wallet: 0,
            tomorrow: Date.now(),
            couldSubmit: false,
            gameStartTime: '',
            gameEndTime: '',
            submitInfoObj: {
                sex: '0',
                chooseWay: 'aliChoose',
                name: '',
                selectCertificate: '',  //用户选择的证件类型
                certificateValue: '',    //证件号码
                selectRelative: 9,    //用户选择的关系
                phone: '',
                email: '',
                startTime: '',
                endTime: '',
            },
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
        // 根据身份证判断性别

        //日历组件设置不可选时间
        beginDate () {
            var that = this;
            return {
                disabledDate (time) {
                    if (that.submitInfoObj.endTime) {
                        return time.getTime() > new Date(that.submitInfoObj.endTime) 
                    } else {
                        return time.getTime() < new Date(that.gameStartTime)
                    }
                }
            }
        },
        //日历组件设置不可选时间
        processDate () {
            var that = this;
            return {
                disabledDate (time) {
                    if (that.submitInfoObj.startTime) {
                        var preDate = GetTheDateStr(that.submitInfoObj.startTime, -1);
                        return time.getTime() < new Date(preDate);
                    } else {
                        return time.getTime() < new Date(that.gameStartTime)
                    }
                }
            }
        },
        checkSubmit () {  //判断用户信息是否填完整
            if (this.submitInfoObj.startTime && this.submitInfoObj.endTime && this.submitInfoObj.name && this.submitInfoObj.selectCertificate && this.submitInfoObj.certificateValue && this.submitInfoObj.phone && this.submitInfoObj.email) {
                this.couldSubmit = true;
            } else {
                this.couldSubmit = false;
            }         
        },
        //身份证类型改变
        certificateChange (event) {
            this.submitInfoObj[arguments[1]] = event;
            sessionStorage.setItem('submitInfoObj', JSON.stringify(this.submitInfoObj));
            // console.log(this.submitInfoObj)
            this.checkSubmit();            
            if (event == 1) {
                this.sexDisabled = true;
            } else {
                this.sexDisabled = false;
            }
        },     
        //证件号input失去焦点
        certificateBlur (event) {
            if (checkIdcard(event.target.value)) {
                this.submitInfoObj.sex = Getsex(event.target.value);
                sessionStorage.setItem('submitInfoObj', JSON.stringify(this.submitInfoObj));
            }
        },
        infoChange (event) {   //内容改变事件函数
            //#region 
            // console.log(this.startTime , this.endTime , this.name , this.selectCertificate , this.certificateValue , this.selectRelative , this.phone , this.email)
            // console.log(this.couldSubmit);
            //#endregion
            this.submitInfoObj[arguments[1]] = event;
            sessionStorage.setItem('submitInfoObj', JSON.stringify(this.submitInfoObj));
            // console.log(this.submitInfoObj)
            this.checkSubmit();
        },
        infoInput (event) {
            this.submitInfoObj[arguments[1]] = event.target.value;
            sessionStorage.setItem('submitInfoObj', JSON.stringify(this.submitInfoObj));
            // console.log(this.submitInfoObj)
            this.checkSubmit();            
        },
        changePayWay (event, payWay) {   //改变支付渠道
            this.submitInfoObj.chooseWay = payWay;

        },
        turnBack (event) {
            historyMemory(1);
            this.$router.go(-1);
        },
        checkInfoCorrect () {   //校验用户填写的信息格式是否正确
            // if (!checkName(this.submitInfoObj.name)) {
            //     this.$message.error('请输入正确的中文名字');
            //     this.$refs.inputName.focus();
            //     return false
            // }            
            if (this.submitInfoObj.selectCertificate == '1' && !checkIdcard(this.submitInfoObj.certificateValue)) {
                this.$message.error('请输入正确的身份证号');
                this.$refs.inputCertificate.focus();
                return false
            }
            if(!checkPhone(this.submitInfoObj.phone)) {
                this.$message.error('请输入正确的手机号');
                this.$refs.inputPhone.focus();
                return false
            }
            if(!checkEmail(this.submitInfoObj.email)) {
                this.$message.error('请输入正确的邮箱');
                this.$refs.inputEmail.focus();
                return false                
            }
            return true;
        },
        createOrder () {     //创建订单函数
            var that = this;
            var users = new Array(this.selectArr.length || 0);
            if (sessionStorage.getItem('isSelectAll') === 'true') {
                users = [];
                this.checkSelectAll = 1;
            } else {
                this.selectArr.forEach((ele, ind) => {
                    users[ind] = {
                        name: ele.name,
                        id_card: ele.idcard,
                        type: ele.cardtype,
                        tel: ele.tel,
                        birthday: ele.birthday
                    }
                })
                this.checkSelectAll = 0 ;
            }
            var data = {
                ssid: this.ssid,
                // org_id: 1,
                // entrance: 1,  //该参数已删除
                check: this.checkSelectAll,
                event_group_id: this.$route.query.groupId,
                id: this.$route.query.policyId,
                begin_time: this.submitInfoObj.startTime,
                end_time: this.submitInfoObj.endTime,
                users: users,
                applicant: {
                    id_card_name: this.submitInfoObj.name,
                    id_card: this.submitInfoObj.certificateValue,
                    tel: this.submitInfoObj.phone,
                    email: this.submitInfoObj.email,
                    type: this.submitInfoObj.selectCertificate,
                    sex: this.submitInfoObj.sex,
                    relation: this.submitInfoObj.selectRelative
                }
            };
            //创建订单
            // console.log('users',users);
            console.log('personInfo',this.submitInfoObj)
            postCreateOrder(data)
            .then((res) => {
                console.log('createPay',res)
                if (res.data.errcode === 0) {
                    sessionStorage.removeItem('sessionSelectArr');
                    sessionStorage.removeItem('submitInfoObj');
                    sessionStorage.removeItem('groupId');
                    sessionStorage.removeItem('groupInfo');
                    sessionStorage.removeItem('startTime');
                    sessionStorage.removeItem('endTime');
                    sessionStorage.removeItem('isSelectAll');
                    sessionStorage.removeItem('selectedPolicy');
                    this.$store.commit('changeUser',[]);  //创建订单后清除数据
                    this.orderId = res.data.order_id;

                    let API_URL = location.protocol || 'http:';
                    if (/^dev-/.test(location.hostname) || /^localhost/.test(location.hostname)) {
                        API_URL += '//dev-'
                    } else if (/^test-/.test(location.hostname)) {
                        API_URL += '//test-'
                    } else {
                        API_URL += '//'
                    }                    
                    if (this.submitInfoObj.chooseWay === 'balanceChoose') {
                        return postPay({
                            ssid: this.ssid,
                            order_id: res.data.order_id
                        })
                    } else if (this.submitInfoObj.chooseWay === 'aliChoose'){
                        if (kitUtils.isMobileBrowser()) {
                            window.location.href = `${API_URL}api.yunbisai.com/pay/ali?orderid=${res.data.order_id}&type=2`
                            // return postCcbPayAli({
                            //     ssid: this.ssid,
                            //     orderid: res.data.order_id,
                            //     type: this.ccbType                       
                            // })
                        } else {
                            return postCcbPay({
                                ssid: this.ssid,
                                orderid: res.data.order_id,
                                type: this.ccbType,
                                paytype: 'ali'                                
                            })
                        }
                    } else if (this.submitInfoObj.chooseWay === 'wxChoose') {
                        if (kitUtils.isMobileBrowser()) {
                            window.location.href = `${API_URL}api.yunbisai.com/pay/wx?orderid=${res.data.order_id}&type=2`
                            // return postCcbPayWx({
                            //     ssid: this.ssid,
                            //     orderid: res.data.order_id,
                            //     type: this.ccbType                       
                            // })
                        } else {
                            return postCcbPay({
                                ssid: this.ssid,
                                orderid: res.data.order_id,
                                type: this.ccbType,
                                paytype: 'wx'                                
                            })
                        }                       
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
                    if (this.submitInfoObj.chooseWay === 'balanceChoose') {
                        this.$alert('余额支付成功', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({
                                    path: '/insurance/policy'
                                })
                            }
                        }); 
                    } else if (this.submitInfoObj.chooseWay === 'aliChoose' || this.submitInfoObj.chooseWay === 'wxChoose') {
                        console.log(this.submitInfoObj.chooseWay,res)
                        this.qr_code = res.data.datArr.qr_code;
                        this.amount = res.data.datArr.amount;
                        if (kitUtils.isMobileBrowser()) {
                            window.location.replace(res.data.datArr.qr_code);
                        } else {
                            this.readyPay = true;
                        }
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

        },
        initData () {
            this.ssid = this.$cookie.get('ssid');
            this.ccbType = kitUtils.isMobileBrowser() ? 2 : 16;
            this.selectedPolicy =  JSON.parse(sessionStorage.getItem('selectedPolicy')) || {};
            // 单笔金额  需要除以100
            this.oneCost = (Number(this.$route.query.oneCost)/100).toFixed(2);
            this.personCount = this.$route.query.person_count;
            this.selectArr = JSON.parse(sessionStorage.getItem('sessionSelectArr')) || [];
            // 开始时间
             this.gameStartTime =sessionStorage.getItem('startTime') || "";
            // this.gameStartTime = this.submitInfoObj.startTime = sessionStorage.getItem('startTime') || "";
            // this.submitInfoObj.endTime = sessionStorage.getItem('startTime') || "";    
            //  结束时间
            this.gameEndTime  = sessionStorage.getItem('endTime') || ""; 
            if (sessionStorage.getItem('submitInfoObj')) {
                this.submitInfoObj = JSON.parse(sessionStorage.getItem('submitInfoObj'));
            }      
            this.checkSubmit();
        }
      
    },
    // computed: {  
    //     //vue中的客户信息
    //     selectArr () {
    //         return this.$store.state.selectArr
    //     }
    // },
    created () {
        this.initData();

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
        font-size: 26px;/*px*/
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
    .cue-words{
        padding: 10px 10px 0px 10px;
        font-size: 24px;/*px*/
        color: #3399ff;
        text-indent: 20px;
    }
    .set-time{
        width: 702px;       
        margin: 30px auto 0 auto;
        p{
            font-size: 30px;/*px*/
            .policy-duration{
                font-size: 26px;/*px*/
                color: #999;
                margin-left: 8px;
            }
        }
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
            // .data-picker{
            //     width: 48%;
            //     text-align: center;
            //     flex-shrink: 1;
            //     .el-input__inner{
            //         text-align: center;
            //         // font-size: 28px;
            //         background-color: #eee;
            //         padding-left: 0;
            //         padding-right: 0;
            //         margin-left: 0;
            //     }
            //     .el-input__inner::placeholder{
            //         text-align: center;
            //         // font-size: 28px;
            //     }
            // }
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
                    font-size: 28px;/*px*/
                }
                .name{
                    display: inline-block;
                    width: 140px;
                    color: #333;
                    font-size: 30px;/*px*/
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
            font-size: 30px;/*px*/
        }
    }
    .pay-way{
        width: 702px;
        margin: 30px auto 50px;
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
                            font-size: 30px;/*px*/ 
                            color: #333;
                        }
                        .hint{
                            color: #666;
                            font-size: 24px;/*px*/ 
                        }
                    }
                }
                .balance-right{
                    display: flex;
                    align-items: center;
                    .to-recharge{
                        margin-right: 40px;
                        color: #3399ff;
                        font-size: 24px;/*px*/                        
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
                            font-size: 30px;/*px*/ 
                            color: #333;    
                                               
                        }
                        .bank-number{
                            color: #666;
                            font-size: 24px;/*px*/                             
                        }
                    }                 
                }
                .bank-right{
                    width: 36px;
                    height: 36px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
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
        font-size: 30px;/*px*/
        font-weight: bold;
        letter-spacing: 8px;
    }
    .could{
        color: #fff;
        background-color: #3399ff;
    }
    .qr-code-wrap{
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(255, 255, 255, .7);
        z-index: 200;
    }
}
</style>

