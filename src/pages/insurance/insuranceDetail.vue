<template>
    <div class="insurance-detail">
        <ls-head :headName='headName' />
        <div class="insurance-cost">
            <div class="cost-content">
                <span>保险费</span>
                <span class="const">{{real_amount|divisionHundred}}元</span>
            </div>
        </div>
        <div class="event-wrap insu">
            <div class="insu-con">
                <div class="event-name ev-in">
                    <span>赛事名称</span>
                    <span>{{title}}</span>
                </div>
                <div class="group-name ev-in">
                    <span>小组名</span>
                    <span>{{groupname}}</span>
                </div>
                <div class="person-name ev-in">
                    <span>姓名</span><span>{{insured_name}}</span>
                </div>
                <div class="state ev-in">
                    <span>报名状态</span><span>{{applyObj[apply_state]}}</span>
                </div>
            </div>
        </div>
        <div class="insurance-wrap insu">
            <div class="insu-con">
                <div class="insurance-class ev-in">
                    <span>险种</span><span>{{risk_name}}</span>
                </div>
                <div class="insurance-state ev-in">
                    <span>状态</span><span>{{stateObj[state]}}</span>
                </div>
                <div class="insurance-no ev-in">
                    <span>保单号</span><span>{{policy_no}}</span>
                </div>
                <div class="time ev-in">
                    <span>起止时间</span><span>{{start_date| moment('YYYY-MM-DD')}}至{{end_date | moment('YYYY-MM-DD')}}</span>
                </div>
            </div>
        </div>
        <div class="surrender-box" v-if="state == 2">
            <div class="surrender-btn" :class="{'can-surrender':(state == 2)}" @click="toSurrender($event)">
                退保
            </div>
        </div>
    </div>
</template>

<script>
import lsHead from '@/components/lsHead.vue'
import {postPolicyDetail} from '@/api/insurance.js'
    export default {
        data () {
            return {
                headName: '保单详情',
                applyObj:{
                    2: '已报名',
                    4: '已退费'
                },
                stateObj:{
                    1:'为待投保',
                    2:'为成功',
                    3:'为退保',
                    4:'为失败'
                },
                "event_id":"4275",  //赛事id
                "title":"退费测试赛1",  //赛事名
                "groupname":"A",  //小组名
                "apply_state":"2", //报名状态 2已报名 4已退费
                "order_id":"2019021514413116128471",  //订单id
                "policy_no":"PEAA20193301Q000E40004",  //保单号
                "state":"3",  //保单状态 1为待投保,2为成功,3为退保,4为失败
                "insured_id":"123123123", //被保人证件号
                "create_time":"2019-02-15 14:41:22.000",  //创建时间
                "amount_payable":"1000",  //应付金额，实际金额为 amount_payable/100
                "real_amount":"1000",  //实付金额，实际金额为 real_amount/100
                "group_id":"19820",  //组id
                "error_log":"",  //错误信息
                "insured_name":"小丑的品格",  //被保人姓名
                "risk_name":"个人意外险",  //险种名
                "start_date":"2019-02-16 00:00:00.000",  //保险开始时间
                "end_date":"2019-02-17 00:00:00.000",  //保险结束时间
                "policy_holderd_card":"330324199610168172",  //投保人证件号
                "policy_holderd_name":"刘忠良",  //投保人姓名
                "policy_holderd_sex":"1",  //投保人性别 1男,2女
                "policy_holderd_card_type":"1 ",  //投保人证件类型 1--身份证,3--护照,10--港澳通行证,26--台湾居民来往内地通行证
                "policy_holderd_tel":"13868637383",  //投保人电话
                "policy_holderd_email":"1249384402@qq.com",  //投保人邮箱
                "relation":"5 ",  //投保人与被保人关系 0--本人,1--配偶,2--父母,3--子女,5--兄弟姐妹,6--祖父母、外祖父母,7--雇佣,9--其他
                "ROW_NUMBER":"1"
            }
        },
        components: {
            lsHead
        },
        created () {
            this.insuredId = this.$route.query.insured_id;
            this.policy_no = this.$route.query.policy_no;
            this.real_amount = this.$route.query.real_amount;
            this.title = this.$route.query.title;
            this.groupname = this.$route.query.groupname;
            this.insured_name = this.$route.query.insured_name;
            this.apply_state = this.$route.query.apply_state;
            this.risk_name = this.$route.query.risk_name;
            this.state = this.$route.query.state;
            this.start_date = this.$route.query.start_date;
            this.end_date = this.$route.query.end_date;
        },
        methods: {
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
        filters :{
            divisionHundred (value) {
                return (Number(value)/100).toFixed(2);
            }
        }
    }
</script>

<style lang='less'>
.insurance-detail{
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    .insurance-cost{
        width: 100%;
        height: 100px;
        border-top: 2px solid #eee;
        background-color: #fff;
        .cost-content{
            width: 668px;
            height: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span{
                font-size: 30px;/*px*/
                color: #333;
            }
        }
    }
    .insu{
        width: 100%;
        background-color: #fff;
        margin-top: 10px;
        .insu-con{
            width: 668px;
            margin: 0 auto;
            .ev-in{
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;
                padding-top: 18px;
                padding-bottom: 18px;
                span{
                    color: #999;
                    font-size: 30px;/*px*/
                }
                span:first-child{
                    display: inline-block;
                    width: 160px;
                }
                span:last-child{
                    text-align: right;
                    display: inline-block;
                    width: 508px;
                    color: #333;
                }
            }
        }
    }
    .surrender-box{
        position: fixed;
        left: 0;
        bottom: 80px;
        width: 100%;
        height: 80px;
        .surrender-btn{
            width: 580px;
            height: 80px;
            line-height: 80px;
            font-size: 30px;/*px*/
            font-weight: bold;
            text-align: center;
            color: #666;
            margin: 0 auto;
        }
        .surrender-btn.can-surrender{
            background-color: #3399ff;
            color: #fff;
        }
    }
}
</style>