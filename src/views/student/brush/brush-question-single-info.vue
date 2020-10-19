<template>
    <div>
        <el-dialog  :before-close="beforeCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" :style="{backgroundColor:valueStyle}"  :title="'单选题' + '(' + count + '/' + data.length + ')'" :visible.sync="value">
            <el-alert title="答对背景为绿色,答错背景为红色" type="success" :closable="false"></el-alert>
            <el-alert title="如果只有一道题或该组合的最后一题,请查看答案,将自动把该题加入已答题列表,否则不会" type="warning" :closable="false" style="margin-top: 10px"></el-alert>
            <el-card  v-if="type == '1' && data.length != 0"   shadow="never" style="border: 0px">
                <p style="margin: 10px;font-size: 15px">{{data[index].singleContent}}</p>
                <el-radio-group v-model="radio" style="margin: 5px" @change="(value)=>{radioChange(value,data[index])}">
                    <el-radio  :disabled="disabledValue" style="margin-bottom: 5px" label="1">A:{{data[index].singleOptionA}}</el-radio><br />
                    <el-radio  :disabled="disabledValue" style="margin-bottom: 5px" label="2">B:{{data[index].singleOptionB}}</el-radio><br />
                    <el-radio  :disabled="disabledValue" style="margin-bottom: 5px" label="3">C:{{data[index].singleOptionC}}</el-radio><br />
                    <el-radio  :disabled="disabledValue" style="margin-bottom: 5px" label="4">D:{{data[index].singleOptionD}}</el-radio><br />
                </el-radio-group>
            </el-card>

            <el-tag style="margin: 5px" v-if="showAnswer" type="success">答案:{{handleAnswer(data[index].singleAsk || "0")}}</el-tag>

            <template slot="footer">
                <el-button type="info" @click="handleSubmit">查看答案</el-button>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" type="success" @click="next" :disabled="index + 1 == data.length">下一题</el-button>
            </template>
        </el-dialog>

        <el-dialog style="background-color: black" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="lastValue" :show-close="false">
            <span>试题已结束,3秒后关闭本窗口</span>
        </el-dialog>
    </div>
</template>

<script>

    import { getQuestionsByChapter,updateOk } from "@/api/student/prush";


    export default {
        name: "brush-question-single-info",
        data(){
            return {
                fullscreenLoading:false,
                value:false,
                chapter:{}, //父组件传入的章节对象
                type:'0', //父组件传入的题型 1单选 2多选 3问答 4上机 ok已答题
                data:[], //查询出来的数据集合
                count:1, //题数记录
                index:0, //试题集合的下标,通过index切换不同的试题
                radio:"", //单选题答案
                showAnswer:false, //是否显示答案
                valueStyle:'', //答案对错 如果对显示的样式为green,如果错,显示的样式为red
                disabledValue:false, //点击查看答案后,4个选项禁用
                lastValue:false //最后一题的弹窗
            }
        },
        methods:{
            handleAnswer(data){
                //点击查看答案后,选项禁用
                this.disabledValue = true;
                //点击查看答案后,对比答案, 如果对则背景为绿色,如果错则背景为红色
                if(this.radio == this.data[this.index].singleAsk){
                    this.valueStyle = 'green';
                }else{
                    this.valueStyle = 'red';
                }

                if(data == '1'){
                    return "A";
                }else if(data == '2'){
                    return "B";
                }else if(data == '3'){
                    return "C";
                }else if(data == "4"){
                    return "D";
                }
            },
            next(){
                if(!this.radio){
                    this.$message.error("请选择答案");
                    return false;
                }
                if(!this.disabledValue){
                    this.$message.error("请查看答案,认真答题");
                    return false;
                }
                this.fullscreenLoading = true;
                updateOk({chapterId:this.chapter.id,type:this.type,singleId:this.data[this.index].id}).then(res=>{
                    if(res.data.success){
                        this.$message.success("已答题");
                        this.disabledValue = false;
                        this.valueStyle = "";
                        this.showAnswer = false;
                        this.radio = "";
                        if(this.data.length != (this.index + 1)){
                            this.count += 1;
                            this.index += 1;
                        }
                    }else{
                        this.$message.error(res.data.message);
                    }
                    this.fullscreenLoading = false;
                });
            },
            radioChange(value,data){

            },
            handleSubmit(){

                if(!this.radio){
                    this.$message.error("请选择选项");
                    return false;
                }

              this.showAnswer = true;



                    if(this.data.length == 1 || (this.index + 1 )  == this.data.length){
                        setTimeout(()=>{
                            updateOk({chapterId:this.chapter.id,type:this.type,singleId:this.data[this.index].id}).then(res=>{
                                if(res.data.success){
                                    this.$message.success("已答题,3秒后关闭本窗口");
                                    this.lastValue = true;
                                    setTimeout(()=>{
                                        this.disabledValue = false;
                                        this.valueStyle = "";
                                        this.showAnswer = false;
                                        this.radio = "";
                                        this.data = [];
                                        this.lastValue = false;
                                        this.value = false;
                                        this.count = 1;
                                        this.index = 0;
                                        this.$parent.getChapterList(this.$parent.curriculumData);
                                    },1000 * 3)
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            });
                        },2 * 1000);
                    }


            },
            beforeCloseDialog(){
                this.disabledValue = false;
                this.valueStyle = "";
                this.showAnswer = false;
                this.radio = "";
                this.data = [];
                this.lastValue = false;
                this.value = false;
                this.count = 1;
                this.index = 0;
                this.$parent.getChapterList(this.$parent.curriculumData);
            }
        }
    }
</script>

<style scoped>

</style>