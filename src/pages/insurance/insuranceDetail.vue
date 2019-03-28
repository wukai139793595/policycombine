<template>
    <div class="insurance-detail">
        <ls-head :headName='headName' />
        <div class="insurance-cost">
            <div class="cost-content">
                <span>保险费</span>
                <span class="const">{{insuranceDetail.real_amount}}元</span>
            </div>
        </div>
        <div class="event-wrap insu">
            <div class="insu-con">
                <div class="event-name ev-in">
                    <span>赛事名称</span>
                    <span>{{eventDetail.title}}</span>
                </div>
                <div class="group-name ev-in">
                    <span>小组名</span>
                    <span>{{eventDetail.groupname}}</span>
                </div>
                <div class="person-name ev-in">
                    <span>姓名</span><span>{{eventDetail.insured_name}}</span>
                </div>
                <div class="state ev-in">
                    <span>报名状态</span><span>{{}}</span>
                </div>
            </div>
        </div>
        <div class="insurance-wrap insu">
            <div class="insu-con">
                <div class="insurance ev-in">
                    <span>险种</span><span>{{eventDetail.risk_name}}</span>
                </div>
                <div class="insurance-state ev-in">
                    <span>状态</span><span>{{}}</span>
                </div>
                <div class="insurance-no ev-in">
                    <span>保单号</span><span>{{eventDetail.policy_no}}</span>
                </div>
                <div class="time ev-in">
                    <span>起止时间</span><span>{{eventDetail.start_date| moment('YYYY-MM-DD')}}至{{eventDetail.end_date | moment('YYYY-MM-DD')}}</span>
                </div>
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
                insuranceDetail: {
                    "policy_no": "PEAC20193301Q000E00511",//保单号
                    "policy_download_url": " http://partnertest.mypicc.com.cn/ecooperation/policydownload/downloadurl.do?platfromcodes=CPI000592&policyNo=AC98BC049426C7DD11E90E1263FF0CA3B3F7736CEF88170218BAAF684A198642&insuredID=3B63ED25D1665DC0BA32F6EBA1122A1A459DE918FEBAE7CF0A77F149CBF2DE01&flag=Y ",//电子保单下载链接
                    "real_amount": "450",//保费 实际金额要除以100
                    "risk_name": "团体意外险", //险种名字
                    "start_date": "2019-02-26 00:00:00.000",//保险生效时间
                    "end_date": "2019-02-27 00:00:00.000",//保险结束时间
                    "groupname": "A", //小组名字
                    "title": "退费测试赛1", //赛事名
                    "insured_id": "330821199212080018",  //被保人证件号
                    "row_number": "1"
                },
                eventDetail: {
                    "policy_no": "PEAC20193301Q000E00511", //保单号
                    "policy_download_url": " http://partnertest.mypicc.com.cn/ecooperation/policydownload/downloadurl.do?platfromcodes=CPI000592&policyNo=AC98BC049426C7DD11E90E1263FF0CA3B3F7736CEF88170218BAAF684A198642&insuredID=3B63ED25D1665DC0BA32F6EBA1122A1A459DE918FEBAE7CF0A77F149CBF2DE01&flag=Y ",//电子保单下载链接
                    "insured_name": "方亮",//被保人姓名
                    "risk_name": "团体意外险", //险种名字
                    "start_date": "2019-02-26 00:00:00.000",//保险生效时间
                    "end_date": "2019-02-27 00:00:00.000",//保险结束时间
                    "groupname": "A",//小组名字
                    "policy_holderd_name": "刘忠良", //投保人姓名
                    "title": "退费测试赛1", //赛事名
                    "amount": "200600", //保额
                    "row_number": "1"
                }
            }
        },
        components: {
            lsHead
        },
        created () {
            this.insuredId = this.$route.query.insured_id;
            this.policyNo = this.$route.query.policy_no;
            this.getInfo();

        },
        methods: {
            getInfo () {
                postPolicyDetail({
                    insured_id: this.insuredId,
                    policy_no: this.policyNo
                }).then(res => {
                    console.log(res)
                    if (res.data.errcode === 0) {
                        this.eventDetail = res.data.list[0]
                    }
                }, err => {
                    this.$message.error('网络错误')
                })
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
                font-size: 30px;
                color: #333;
            }
        }
        .insu{
            width: 100%;
            background-color: #fff;
            margin-top: 20px;
            
        }
    }
}
</style>