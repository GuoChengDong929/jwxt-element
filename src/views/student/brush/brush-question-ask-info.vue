<template>
    <div>
        <el-dialog fullscreen :before-close="beforeCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" :title="'问答题' + '(' + count + '/' + data.length + ')'" :visible.sync="value">
            <el-alert title="如果只有一道题或该组合的最后一题,请查看解析,将自动把该题加入已答题列表,否则不会" type="warning" :closable="false" style="margin-top: 10px"></el-alert>

            <el-card  v-if="type == '3' && data.length != 0"   shadow="never" style="border: 0px">
                <p style="margin: 10px;font-size: 15px">{{data[index].askContent}}</p>
                <el-input style="margin: 10px;padding: 5px" type="textarea" v-model="textarea" placeholder="请输入你想写的内容"></el-input>
                <p v-if="showAnswer" style="margin: 10px;font-size: 15px;color: #63a35c">试题解析:{{data[index].askAnalysis}}</p>
            </el-card>


            <template slot="footer">
                <el-button type="info" @click="handleSubmit">查看解析</el-button>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" type="success" @click="next" :disabled="index + 1 == data.length">下一题</el-button>
            </template>


            <el-card v-if="textarea" style="margin: 10px;border: 0px" shadow="never">
                <iframe :src="'http://www.baidu.com/baidu?word=' + textarea" height="400" width="100%" frameborder="0" target="_self"></iframe>
            </el-card>
        </el-dialog>

        <el-dialog style="background-color: black" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="lastValue" :show-close="false">
            <span>试题已结束,3秒后关闭本窗口</span>
        </el-dialog>
    </div>
</template>

<script>

    import { updateOk } from "@/api/student/prush";

    export default {
        name: "brush-question-ask-info",
        data(){
            return {
                fullscreenLoading:false,
                lastValue:false,
                textarea:'',
                value:false,
                showAnswer:false,
                chapter:{}, //父组件传入的章节对象
                type:'0', //父组件传入的题型 1单选 2多选 3问答 4上机 ok已答题
                data:[], //查询出来的数据集合
                count:1, //题数记录
                index:0, //试题集合的下标,通过index切换不同的试题
            }
        },
        methods:{
            beforeCloseDialog(){
                this.lastValue = false;
                this.textarea = "";
                this.showAnswer = false;
                this.chapter = {};
                this.type = "0";
                this.data = [];
                this.count = 1;
                this.index = 0;

                this.value = false;
                this.$parent.getChapterList(this.$parent.curriculumData);
            },
            handleSubmit(){
                this.showAnswer = true;


                    if(this.data.length == 1 || (this.index + 1 )  == this.data.length){
                        setTimeout(()=>{
                            updateOk({chapterId:this.chapter.id,type:this.type,askId:this.data[this.index].id}).then(res=>{
                                if(res.data.success){
                                    this.$message.success("已答题,3秒后关闭本窗口");
                                    this.lastValue = true;
                                    setTimeout(()=>{
                                        this.showAnswer = false;
                                        this.data = [];
                                        this.lastValue = false;
                                        this.textarea = "";
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
                this.fullscreenLoading = true;

                updateOk({chapterId:this.chapter.id,type:this.type,askId:this.data[this.index].id}).then(res=>{
                    if(res.data.success){
                        this.$message.success("已加入已答题库");

                        this.showAnswer = false;
                        this.textarea = "";
                        if(this.data.length != (this.index + 1)){
                            this.count += 1;
                            this.index += 1;
                        }
                    }else{
                        this.$message.error(res.data.message);
                    }
                    this.fullscreenLoading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>