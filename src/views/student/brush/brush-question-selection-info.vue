<template>
    <div>
        <el-dialog  :before-close="beforeCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" :style="{backgroundColor:valueStyle}"  :title="'多选题' + '(' + count + '/' + data.length + ')'" :visible.sync="value">
            <el-alert title="答对背景为绿色,答错背景为红色" type="success" :closable="false"></el-alert>
            <el-alert title="如果只有一道题或该组合的最后一题,请查看答案,将自动把该题加入已答题列表,否则不会" type="warning" :closable="false" style="margin-top: 10px"></el-alert>
            <el-card  v-if="type == '2' && data.length != 0"   shadow="never" style="border: 0px">
                <p style="margin: 10px;font-size: 15px">{{data[index].selectionContent}}</p>
                <el-checkbox-group v-model="checkbox">
                    <el-checkbox style="margin: 5px" label="1" :disabled="disabledValue">A-{{data[index].selectionOptionA}}</el-checkbox><br/>
                    <el-checkbox style="margin: 5px" label="2" :disabled="disabledValue">B-{{data[index].selectionOptionB}}</el-checkbox><br/>
                    <el-checkbox style="margin: 5px" label="3" :disabled="disabledValue">C-{{data[index].selectionOptionC}}</el-checkbox><br/>
                    <el-checkbox style="margin: 5px" label="4" :disabled="disabledValue">D-{{data[index].selectionOptionD}}</el-checkbox><br/>
                </el-checkbox-group>
            </el-card>


            <el-tag style="margin: 5px" v-if="showAnswer" type="success">答案:{{handleAnswer(data[index].selectionAsk)}}</el-tag>

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


    import { updateOk } from "@/api/student/prush";

    export default {
        name: "brush-question-selection-info",
        data(){
            return {
                fullscreenLoading:false,
                value:false,
                chapter:{}, //父组件传入的章节对象
                type:'0', //父组件传入的题型 1单选 2多选 3问答 4上机 ok已答题
                data:[], //查询出来的数据集合
                count:1, //题数记录
                index:0, //试题集合的下标,通过index切换不同的试题
                checkbox:[], //单选题答案
                showAnswer:false, //是否显示答案
                valueStyle:'', //答案对错 如果对显示的样式为green,如果错,显示的样式为red
                disabledValue:false, //点击查看答案后,4个选项禁用
                lastValue:false //最后一题的弹窗
            }
        },
        methods:{
            handleAnswer(data){

                let str = "";

                if(data){
                    if(data.includes("1")){
                        str += "A";
                        str += ",";
                    }
                    if(data.includes("2")){
                        str += "B";
                        str += ",";
                    }
                    if(data.includes("3")){
                        str += "C";
                        str += ",";
                    }
                    if(data.includes("4")){
                        str += "D";
                    }
                }

                return str;
            },
            handleSubmit(){
                if(this.checkbox.length == 0){
                    this.$message.error("没有任何选项");
                    return false;
                }

                if(this.checkbox.length < 2){
                    this.$message.error("多选题至少两个答案");
                    return false;
                }

                //点击查看答案后,选项禁用
                this.disabledValue = true;

                let answer = this.data[this.index].selectionAsk.split(",").sort().join(",");

                if(this.checkbox.sort().join(",") == answer){
                    this.valueStyle = 'green';
                }else{
                    this.valueStyle = 'red';
                }

                this.showAnswer = true;


                    if(this.data.length == 1 || (this.index + 1 )  == this.data.length){
                        setTimeout(()=>{
                            updateOk({chapterId:this.chapter.id,type:this.type,selectionId:this.data[this.index].id}).then(res=>{
                                if(res.data.success){
                                    this.$message.success("已答题,3秒后关闭本窗口");
                                    this.lastValue = true;
                                    setTimeout(()=>{
                                        this.disabledValue = false;
                                        this.valueStyle = "";
                                        this.showAnswer = false;
                                        this.checkbox = [];
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
                            })
                        },2 * 1000);
                    }




            },
            next(){
                if(this.checkbox.length == 0){
                    this.$message.error("没有任何选项");
                    return false;
                }

                if(this.checkbox.length < 2){
                    this.$message.error("多选题至少两个答案");
                    return false;
                }

                if(!this.disabledValue){
                    this.$message.error("请查看答案,认真答题");
                    return false;
                }
                this.fullscreenLoading = true;


                updateOk({chapterId:this.chapter.id,type:this.type,selectionId:this.data[this.index].id}).then(res=>{
                    if(res.data.success){
                        this.$message.success("已答题");
                        this.disabledValue = false;
                        this.valueStyle = "";
                        this.showAnswer = false;
                        this.checkbox = [];
                        if(this.data.length != (this.index + 1)){
                            this.count += 1;
                            this.index += 1;
                        }
                    }else{
                        this.$message.error(res.data.message);
                    }
                    this.fullscreenLoading = false;
                })

            },
            beforeCloseDialog(){
                this.disabledValue = false;
                this.valueStyle = "";
                this.showAnswer = false;
                this.checkbox = [];
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