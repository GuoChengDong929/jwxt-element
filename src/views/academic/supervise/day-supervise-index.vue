<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px">
            <el-select v-model="params.classesId" style="margin-right: 10px">
                <el-option :value="classes.id" :label="classes.classesName" :key="classes.id" v-for="classes in classesList"></el-option>
            </el-select>
            <el-date-picker
                    style="margin-right: 10px"
                    type="daterange"
                    v-model="params.date"
                    :editable="false"
                    :clearable="false"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="~"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-button type="success" plain @click="search"> <i class="el-icon-search" style="margin-right: 5px"></i>查询 </el-button>
            <el-button type="danger" plain @click="comparisonDay"> <i class="el-icon-paperclip" style="margin-right: 5px"></i>考核对比</el-button>
        </div>

        <div style="margin: 0px 5px 0px 5px">
            <el-table :data="data_list" :render-header="labelHead" size="mini" border stripe v-loading="loading">
                <el-table-column type="index" label="序号"  align="center"></el-table-column>
                <el-table-column prop="nickName" label="姓名" align="center" width="120px"></el-table-column>
                <el-table-column label="个人平均分" prop="avg" align="center"></el-table-column>
                <el-table-column :label="date" v-for="(date, key) in header" :key="date"  align="center">
                    <template slot-scope="scope">
                        <span v-if="data_list[scope.$index].scores[key] == -1" style="font-weight: bolder;color: red">未考</span>
                        <span v-if="data_list[scope.$index].scores[key] >= 80" style="color: green">{{data_list[scope.$index].scores[key]}}</span>
                        <span v-if="data_list[scope.$index].scores[key] >= 60 && data_list[scope.$index].scores[key] < 80" style="color: #ee9900">{{data_list[scope.$index].scores[key]}}</span>
                        <span v-if="data_list[scope.$index].scores[key] < 60 && data_list[scope.$index].scores[key] >= 0" style="color: red">{{data_list[scope.$index].scores[key]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-drawer :visible.sync="drawer.drawerValue" direction="btt" size="50%">
            <div id="myChart" :style="{width: '1400px', height: '400px',marginLeft:'200px'}"></div>
        </el-drawer>

    </div>
</template>
<script>

    import { findAll } from "@/api/quality/transact/classes";

    import { getDayScoreByDate,comparisonDay } from "@/api/academic/supervise";

    import { formatDateNoWeekNoSeconds } from "../../../utils/tools";

    export default {
        name:"day-supervise-index",
        data(){
            return {
                loading:false,
                params:{classesId:'',date:null},
                header:[],
                data_list:[], //data_list.score存放了多个scores[[1,2,3,4],[1,2]]
                classesList:[],
                drawer:{
                    drawerValue:false,
                    xData:[],
                    yData:[]
                }
            }
        },
        methods:{
            comparisonDay(){
                if(!this.params.classesId){
                    this.$message.error("请选择班级");
                    return false;
                }

                if(!this.params.date){
                    this.$message.error("请选择日期");
                    return false;
                }

                comparisonDay(this.params).then(res=>{
                    if(res.data.success){

                        console.log(res.data);

                        let dates = [];
                        let scores = [];

                        res.data.data.dates.forEach(item=>{
                            dates.push(formatDateNoWeekNoSeconds(item));
                        });

                        res.data.data.scores.forEach(item=>{
                            scores.push(item.toFixed(2));
                        });

                        this.xData = dates;
                        this.yData = scores;

                        setTimeout(()=>{
                            this.init();
                        },500);
                        this.drawer.drawerValue = true;
                    }else{
                        this.$message.error(res.data.message);
                    }
                });
            },
            labelHead(h,{column,index}){ //动态表头渲染
                //let l = column.label.length;
                //let f = 12; //每个字大小,其实是每个字的比例值,大概会比字体大小打差不多大
                //column.minWidth = f * l; //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
                //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
                return h('span',{class:'table-head',style:{width:'100%'}},[column.label])
            },
            search(){
                if(!this.params.classesId){
                    this.$message.error("请选择班级");
                    return false;
                }

                if(!this.params.date){
                    this.$message.error("请选择日期");
                    return false;
                }

                this.loading = true;

                getDayScoreByDate(this.params).then(res=>{
                    if(res.data.success){
                        this.header = res.data.data.headers;
                        this.data_list = res.data.data.vos;
                        this.loading = false;
                    }
                }).catch(e=>{
                   this.$message.error("加载出错!" + e);
                   this.loading = false;
                });
            },

            init() { //初始化图表
                let that = this;
                let myChart = this.$echarts.init(document.getElementById('myChart'));  //实例化echarts容器
                // 绘制图表
                myChart.setOption({
                    title: { //标题项
                        show: true, //是否显示标题
                        text: '日测对比(相比前一天,低1个百分点将扣除1分考核)',
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
                            name: '当前日测总分/班级人数', //提示文本
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
            }
        },
        created() {
            findAll().then(res=>{
                if(res.data.success){
                    this.classesList = res.data.data;
                }
            });
        }
    }
</script>
<style scoped>

</style>