<template>
    <div class="person-info">
        <div class="name-box">
            <div class="name">{{insured_name}}</div>
            <div class="is-insurance">{{state | policyState}}</div>
        </div>
        <div class="competite-info">
            <div class="competite-name">
                <span>赛事名称：</span>
                <span>{{title}}</span>
            </div>
            <div class="group-name">
                <span>小组名称：</span>
                <span>{{groupname}}</span>
            </div>
            <div class="begin-time">
                <span>起止时间：</span>
                <span>{{start_date | moment('YYYY-MM-DD')}}至{{end_date | moment('YYYY-MM-DD')}}</span>
            </div>
        </div>
        <div class="insurance-sum">
            <span>保险金额:</span>
            <span>{{real_amount | divisionHundred}}元</span>
        </div>
        <div class="insurance-detail" @click="toInsuranceDetail($event)">
            详情
        </div>
        <div class="surrender-normal" :class="{surrender:(state == 2)}" @click="toSurrender($event)">
            退保
        </div>       
    </div>
</template>

<script>
import {postPolicyCancel} from '@/api/api.js'
    export default {
        props: {
            //被保人姓名
            insured_name: {
                type: String,
                default: '' 
            },
            //保单状态 1为待投保,2为成功,3为退保,4为失败
            state: {
                type: String,
                default: ''
            },
            //赛事名
            title: {
                type: String,
                defalut: ''
            },
            //小组名
            groupname: {
                type: String,
                default: ''
            },
            //保险开始时间
            start_date: {
                type: String,
                default: ''
            },
             //保险结束时间
            end_date: {
                type: String,
                default: ''
            },
            //实付金额，实际金额为 real_amount/100
            real_amount: {
                type: String,
                default: ""
            },
            //订单id
            order_id: {
                type: String,
                default: ''
            },
            //被保人证件号
            insured_id: {
                type: String,
                default: ''
            },
            //报名状态 2已报名 4已退费
            apply_state:{
                type: String,
                default: ""
            },
            //保单号
            policy_no: {
                type: String,
                default: ''
            },
            //险种名
            risk_name:{
                type: String,
                default: ''
            }
        },
        methods: {
            // 去保险详情页面
            toInsuranceDetail (event, index) {
                this.$router.push({
                    path: '/insuranceDetail',
                    query: {
                        insured_id: this.insured_id,
                        policy_no: this.policy_no,
                        real_amount: this.real_amount,
                        title: this.title,
                        groupname: this.groupname,
                        insured_name: this.insured_name,
                        apply_state :this.apply_state,
                        risk_name :this.risk_name,
                        state :this.state,
                        start_date :this.start_date,
                        end_date :this.end_date
                    }
                })
            },
            // 查看保险开始时间是否大于今天
            checkStartTime () {
                let nowTime = Date.now();
                let startTime = new Date(this.start_date).getTime();
                if (startTime < nowTime) {
                    return false
                } else {
                    return true
                }
            },
            toSurrender (event) {
                if (this.state != 2) {
                    return
                }
                
                if (!this.checkStartTime()) {
                    this.$message('保险已经开始，不能退保');
                    return
                }
                this.$confirm('是否确认退保', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        postPolicyCancel({
                            ssid: this.ssid,
                            order_id: this.order_id,
                            insured_id: this.insured_id
                        })
                        .then(res => {
                            console.log(res)
                            if (res.data.errcode === 0) {
                                this.$emit('changeState', 3);                       
                                this.$message({
                                    message: '退保成功',
                                    type: 'success'
                                })
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        },err => {
                                this.$message.error('网络错误')
                        })
                    }).catch(() => {
                        console.log('取消退保')
                    })
            }
        },
        created () {
            this.ssid = this.$cookie.get('ssid');
        },
        filters: {
            divisionHundred (value) {
                return (Number(value)/100).toFixed(2);
            },
            policyState (value) {
                switch (value) {
                    case "1":
                    case 1:
                        return '投保';
                    case "2":
                    case 2:
                        return '已交保';
                    case "3":
                    case 3:
                        return '已退保';
                    case "4":
                    case 4:
                        return '投保失败';
                }
            }           
        }
    }
</script>

<style lang='less' scoped>

.person-info{
    width: 702px;
    margin: 0 auto 20px;
    position: relative;
    padding-bottom: 40px;
    border-bottom: 2px solid #f4f4f4;
    .name-box{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 26px;
        .name{
            font-size: 30px;/*px*/ 
            font-weight: bold;
            color: #333;
        }
        .is-insurance{
            font-size: 28px;/*px*/ 
            color: #999;
        }
    }
    .competite-info{
        width: 100%;
        box-sizing: border-box;
        background-color: #f6f6f6;
        // padding-left: 40px;
        padding: 20px 0 20px 40px;
        font-size: 28px;/*px*/ 
        color: #666;
        margin-bottom: 30px;

        &>div{
            margin-bottom: 10px;
        }
    }
    .insurance-sum{
        span:nth-of-type(1){
            font-size: 28px;/*px*/
            color: #999;
        }
        span:nth-of-type(2) {
            font-size: 28px;/*px*/
            color: #333;
            font-weight: bold;
        }
    }
    .insurance-detail{
        position: absolute;
        bottom: 30px;
        right: 160px;
        width: 140px;
        height: 50px;
        background-color: #fff;
        border-radius: 25px;
        font-size: 30px;/*px*/
        color: #000;
        text-align: center;
        line-height: 50px;
        font-weight: bold;  
        border: 2px solid #000; 

    }
    .surrender-normal{
        position: absolute;
        bottom: 30px;
        right: 4px;
        width: 140px;
        height: 50px;
        background-color: #fff;
        border-radius: 25px;
        font-size: 30px;/*px*/
        color: #9a9a9a;
        text-align: center;
        line-height: 50px;
        font-weight: bold;
        border: 2px solid #9a9a9a; 

    }
    .surrender{
        background-color: #fff;   
        color: #000;             
    }
}
    
</style>