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
        <div class="surrender-normal" :class="{surrender:(state == 2)}" @click="toSurrender($event)">
            退保
        </div>       
    </div>
</template>

<script>
import {postPolicyCancel} from '@/api/insurance.js'
    export default {
        props: {
            insured_name: {
                type: String,
                default: '' 
            },
            state: {
                type: String,
                default: 0
            },
            title: {
                type: String,
                defalut: ''
            },
            groupname: {
                type: String,
                default: ''
            },
            start_date: {
                type: String,
                default: ''
            },
            end_date: {
                type: String,
                default: ''
            },
            real_amount: {
                type: String,
                default: 0
            },
            order_id: {
                type: String,
                default: ''
            },
            insured_id: {
                type: String,
                default: ''
            }
        },
        methods: {
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
            font-size: 30px; 
            font-weight: bold;
            color: #333;
        }
        .is-insurance{
            font-size: 28px; 
            color: #999;
        }
    }
    .competite-info{
        width: 100%;
        box-sizing: border-box;
        background-color: #f6f6f6;
        // padding-left: 40px;
        padding: 20px 0 20px 40px;
        font-size: 28px; 
        color: #666;
        margin-bottom: 30px;

        &>div{
            margin-bottom: 10px;
        }
    }
    .insurance-sum{
        span:nth-of-type(1){
            font-size: 28px;
            color: #999;
        }
        span:nth-of-type(2) {
            font-size: 28px;
            color: #333;
            font-weight: bold;
        }
    }
    .surrender-normal{
        position: absolute;
        bottom: 30px;
        right: 4px;
        width: 140px;
        height: 50px;
        background-color: #eee;
        border-radius: 25px;
        font-size: 30px;
        color: #666;
        text-align: center;
        line-height: 50px;
        font-weight: bold;
    }
    .surrender{
        background-color: #3399ff;   
        color: #fff;             
    }
}
    
</style>