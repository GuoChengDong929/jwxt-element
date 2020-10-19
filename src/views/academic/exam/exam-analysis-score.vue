<template>
    <div>
        <el-dialog :visible.sync="value" fullscreen center>

            <el-card shadow="never" style="border:0rem">
                <template slot="header">
                    <span style="font-size: 20px;font-family: 'Arial Black'">结果分布</span>
                </template>
                <div>
                    <Row :gutter="20">
                        <i-col :xs="12" :md="6" :lg="6" style="height: 120px;padding-bottom: 10px;">
                            <infor-card shadow color="#2d8cf0" icon="md-person-add" :icon-size="36">
                                <p style="color:red;font-size: 30px;font-weight: bold">{{good}} %</p>
                                <p>优秀占比</p>
                            </infor-card>
                        </i-col>
                        <i-col :xs="12" :md="6" :lg="6" style="height: 120px;padding-bottom: 10px;">
                            <infor-card shadow color="#19be6b" icon="md-locate" :icon-size="36">
                                <p style="color:red;font-size: 30px;font-weight: bold">{{hg}} %</p>
                                <p>合格占比</p>
                            </infor-card>
                        </i-col>
                        <i-col :xs="12" :md="6" :lg="6" style="height: 120px;padding-bottom: 10px;">
                            <infor-card shadow color="#ff9900" icon="md-help-circle" :icon-size="36">
                                <p style="color:red;font-size: 30px;font-weight: bold">{{bhg}} %</p>
                                <p>不合格占比</p>
                            </infor-card>
                        </i-col>
                        <i-col :xs="12" :md="6" :lg="6" style="height: 120px;padding-bottom: 10px;">
                            <infor-card shadow color="#ed3f14" icon="md-share" :icon-size="36">
                                <p style="color:red;font-size: 30px;font-weight: bold">{{no}} %</p>
                                <p>未参考占比</p>
                            </infor-card>
                        </i-col>
                    </Row>
                </div>
            </el-card>

            <el-card shadow="never" style="border:0rem">
                <template slot="header">
                    <span style="font-size: 20px;font-family: 'Arial Black'">成绩分析</span>
                </template>
                <div id="myChart" :style="{width: '1400px', height: '400px',marginLeft:'200px'}"></div>
            </el-card>

            <el-card shadow="never" style="border:0rem" v-if="parentData.singleCount > 0">
                <template slot="header">
                    <span style="font-size: 20px;font-family: 'Arial Black'">单选题分析</span>
                </template>
                <el-table :data="singleData">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column prop="title" label="第几题" align="center"></el-table-column>
                    <el-table-column prop="ok" label="对题占比" align="center"></el-table-column>
                    <el-table-column prop="no" label="错题占比" align="center"></el-table-column>
                </el-table>
            </el-card>

            <el-card shadow="never" style="border:0rem" v-if="parentData.selectionCount > 0">
                <template slot="header">
                    <span style="font-size: 20px;font-family: 'Arial Black'">多选题分析</span>
                </template>

                <el-table :data="selectionData">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column prop="title" label="第几题" align="center"></el-table-column>
                    <el-table-column prop="ok" label="对题占比" align="center"></el-table-column>
                    <el-table-column prop="no" label="错题占比" align="center"></el-table-column>
                </el-table>
            </el-card>

            <el-card shadow="never" style="border:0rem">
                <template slot="header">
                    <span style="font-size: 20px;font-family: 'Arial Black'">成绩排行</span>
                </template>
                <el-table :data="scoreArray">
                    <el-table-column type="index" align="center" label="序号"></el-table-column>
                    <el-table-column prop="nickName" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="score" label="成绩" align="center"></el-table-column>
                    <el-table-column prop="sort" label="排名" align="center">
                        <template slot-scope="scope">
                            {{mingci111(scope.row.score)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            {{scope.row.status == '0' ? '未考':'已考'}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

        </el-dialog>
    </div>
</template>

<script>

    import { analysisExam } from "@/api/academic/exam";

    export default {
        name: "exam-analysis-score",
        components:{
            InforCard:()=>import('@/components/info-card/infor-card.vue')
        },
        data() {
            return {
                parentData: {},
                value: false,
                scoreArray:[],
                xData:[],
                yData:[]
            }
        },
        watch:{
            value(data){
                if(data){ //加载成绩集合
                    this.yData = [];
                    this.xData = [];
                    analysisExam(this.parentData).then(res=>{
                        if(res.data.success){
                            this.scoreArray = res.data.data;
                        }
                    });
                }
            },
            scoreArray(data){ //监听该试卷下的学生的成绩集合,填充图表数据
                if(data && data.length > 0){
                    console.log(data)
                    data.forEach(item=>{
                        this.xData.push(item.nickName);
                        this.yData.push(parseInt(item.score));
                    })
                }
                this.init();
            }
        },
        computed:{
            singleData(){ //单选题分析的基础数据
                let arr = [];
                this.parentData.singleJoins.split(",").forEach((exam_single_id,index)=>{
                    let ele = {title:'',ok:0,no:0};
                    ele.title = "第" + ( index + 1 ) + "题";
                    let person_number = this.scoreArray.length;
                    this.scoreArray.forEach(score=>{
                        if(score.singleSuccIds.includes(exam_single_id)){
                            ele.ok += 1;
                        }
                    });
                    ele.no = person_number - ele.ok;
                    arr.push(ele);
                });
                return arr;
            },
            selectionData(){
                let arr = [];
                this.parentData.selectionJoins.split(",").forEach((exam_selection_id,index)=>{
                    let ele = {title:'',ok:0,no:0};
                    ele.title = "第" + ( index + 1 ) + "题";
                    let person_number = this.scoreArray.length;
                    this.scoreArray.forEach(score=>{
                       if(score.selectionSuccIds.includes(exam_selection_id)){
                           ele.ok += 1;
                       }
                    });
                    ele.no = person_number - ele.ok;
                    arr.push(ele);
                });
                return arr;
            },
            good(){
                let count = this.scoreArray.filter(item=>{
                    return item.score >= 90;
                }).length;

                let num = (count / this.scoreArray.length) * 100;

                return num.toFixed(2);
            },
            hg(){
                let count = this.scoreArray.filter(item=>{
                    return (item.score < 90 && item.score >= 60);
                }).length;
                let num = (count / this.scoreArray.length) * 100;

                return num.toFixed(2);
            },
            bhg(){
                let count = this.scoreArray.filter(item=>{
                    return (item.status != '0' && item.score < 60);
                }).length;
                let num = (count / this.scoreArray.length) * 100;

                return num.toFixed(2);
            },
            no(){ //未参考
                let count = this.scoreArray.filter(item=>{
                    return item.status == '0';
                }).length;

                let num = (count / this.scoreArray.length) * 100;

                return num.toFixed(2);
                //return Math.floor((count / this.scoreArray.length) * 100);
            }
        },
        methods: {
            init() { //初始化图表
                let that = this;
                let myChart = this.$echarts.init(document.getElementById('myChart'));  //实例化echarts容器
                // 绘制图表
                myChart.setOption({
                    title: { //标题项
                        show: true, //是否显示标题
                        text: '试卷名称:' + that.parentData.examName,
                        textAlign: 'auto'//标题位置 left right center
                    },
                    color: ['#3398DB'], //图形颜色
                    tooltip: { //提示框组件
                        trigger: 'axis', //触发类型 'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                        axisPointer: {  // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',        // 指示器类型 'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器 'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
                            label: {
                                show: true    //强调x轴文本标签
                            }
                        }
                    },
                    grid: {
                        left: '3%', //组件离容器左侧的距离
                        right: '4%', //组件离容器右侧的距离
                        bottom: '3%',
                        containLabel: true //区域是否包含坐标轴的刻度标签
                    },
                    xAxis: [
                        {
                            type: 'category', //坐标轴类型 default: 'category'  类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
                            // value : 数值轴，适用于连续数据。  time  时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
                            // log  对数轴。适用于对数数据。
                            boundaryGap: true, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                            data: that.xData, //数据
                            axisTick: { //坐标轴刻度相关设置。
                                alignWithLabel: true //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐。
                            },
                            axisLabel: {interval:'auto',rotate:40 }
                        }
                    ],
                    yAxis: [ //y轴
                        {
                            type: 'value' //数值轴，适用于连续数据
                        }
                    ],
                    series: [
                        {
                            name: '数据:', //提示文本
                            type: 'line', //非常关键的属性:  决定了是哪个类别的图形 line 折线图 bar 柱状图  pie饼状图  scatter气泡(散点)图
                            label: {
                                show: true  //在图形上是否显示数据
                            },
                            barWidth: '60%',
                            data: that.yData
                        }
                    ],
                    animation: true //是否开启动画
                }, true);
            },
            mingci111(chengjiRow){
                let chengji = [];
                this.scoreArray.forEach(score=>{
                    chengji.push(score.score);
                });


                //成绩数组
                let len = chengji.length;
                let list = chengji;
                //排序后数组
                let swap;
                for (let i = 0; i < len-1; i++){
                    for (let j = 0; j < len-1-i; j++){
                        if (list[j] < list[j+1]){
                            swap  = list[j];
                            list[j] = list[j+1];
                            list[j+1] = swap;
                        }
                    }
                }

                //去重且，将成绩和该成绩的排名保存为对象数组
                let set = [];
                let listNew = []
                for (let i = 0, j = list.length; i < j; i++) {
                    if (listNew.indexOf(list[i]) === -1) {
                        let aaa = {}
                        aaa.chengji = list[i];
                        aaa.mingci = i+1
                        set.push(aaa);
                        listNew.push(list[i])
                    }
                }
                let a = {};
                //循环遍历对象数组查询该成绩的排名
                for (let i = 0; i < set.length; i++){
                    a =  set[i];
                    if(a.chengji == chengjiRow){
                        //返回该成绩的排名
                        return a.mingci;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>