<template>
    <div>
        <el-dialog itle="章节列表" style="background: #F0F0F0;" :visible.sync="value" width="1280px">
            <Scroll height="600">
                <List>
                    <ListItem v-for="chapter in chapterList" :key="chapter.id">
                        <ListItemMeta :title="chapter.name" avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" />
                        <Progress style="width: 300px" :percent="handle_value(chapter)" />
                        <template slot="action">
                            <li>
                                <Icon type="ios-thumbs-up-outline" slot="reference" />
                                <el-link type="success" slot="reference" @click="handleOpenAnswerWindow(chapter,'ok')">已答（{{chapter.okCount}}）</el-link>
                            </li>
                            <li><a href="javascript:void(0)" @click="handleOpenAnswerWindow(chapter,'1')">单选({{chapter.singleCount}})</a></li>
                            <li><a href="javascript:void(0)" @click="handleOpenAnswerWindow(chapter,'2')">多选({{chapter.selectionCount}})</a></li>
                            <li><a href="javascript:void(0)" @click="handleOpenAnswerWindow(chapter,'3')">问答({{chapter.askCount}})</a></li>
                            <li><a href="javascript:void(0)" @click="handleOpenAnswerWindow(chapter,'4')">上机({{chapter.upperCount}})</a></li>
                        </template>

                    </ListItem>
                </List>
            </Scroll>
        </el-dialog>
        <brush-question-single-info ref="brushQuestionSingleInfo"></brush-question-single-info>
        <brush-question-selection-info ref="brushQuestionSelectionInfo"></brush-question-selection-info>
        <brush-question-ask-info ref="brushQuestionAskInfo"></brush-question-ask-info>
        <brush-question-upper-info ref="brushQuestionUpperInfo"></brush-question-upper-info>
        <brush-question-ok-info ref="brushQuestionOkInfo"></brush-question-ok-info>
    </div>
</template>

<script>

    import { getChapterList,list } from "@/api/academic/chapter";
    import { getQuestionsByChapter } from "@/api/student/prush";


    export default {
        name: "brush-question-show",
        components:{
            BrushQuestionSingleInfo:()=>import("@/views/student/brush/brush-question-single-info.vue"),
            BrushQuestionSelectionInfo:()=>import("@/views/student/brush/brush-question-selection-info.vue"),
            BrushQuestionAskInfo:()=>import("@/views/student/brush/brush-question-ask-info.vue"),
            BrushQuestionUpperInfo:()=>import("@/views/student/brush/brush-question-upper-info.vue"),
            BrushQuestionOkInfo:()=>import("@/views/student/brush/brush-question-ok-info.vue"),

        },
        data(){
            return {
                value : false,
                chapterList:[],
                curriculumData:null,
                studentAnswerCount : 0, //当前学生的答题总数
            }
        },
        watch:{
            value(data){
                if(data){
                    this.getChapterList(this.curriculumData);
                }
            },
            chapterList(data){
                if(data.length > 0){

                }
            }
        },
        methods:{
            getChapterList(data){
                getChapterList(data).then(res=>{
                    if(res.data.success){
                        this.chapterList = res.data.data;
                    }else{
                        this.$message.error(res.data.message);
                        return false;
                    }
                })
            },
            handle_value(chapter){
                if(chapter){
                    let okCount = chapter.okCount;
                    let total = chapter.total;
                    if(total == 0){
                        return 0;
                    }else{
                        let value = (okCount / total) * 100;
                        if(value == 0){
                            return 0;
                        }else{
                            return parseFloat(value.toFixed(2));
                        }
                    }
                }
            },
            getQuestionsByChapter(data,name){
                getQuestionsByChapter(data).then(res=>{
                    if(res.data.success){
                        this.$refs[name].data = res.data.data;
                        this.$refs[name].value = true;
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
            },
            handleOpenAnswerWindow(chapter,type){
                if(type == '1'){
                    this.$refs['brushQuestionSingleInfo'].disabledValue = false;
                    this.$refs['brushQuestionSingleInfo'].valueStyle = "";
                    this.$refs['brushQuestionSingleInfo'].showAnswer = false;
                    this.$refs['brushQuestionSingleInfo'].radio = "";
                    this.$refs['brushQuestionSingleInfo'].data = [];
                    this.$refs['brushQuestionSingleInfo'].chapter = chapter;
                    this.$refs['brushQuestionSingleInfo'].type = type;
                    this.getQuestionsByChapter({chapterId:chapter.id,type:type},'brushQuestionSingleInfo');
                }else if(type == '2'){
                    this.$refs['brushQuestionSelectionInfo'].disabledValue = false;
                    this.$refs['brushQuestionSelectionInfo'].valueStyle = "";
                    this.$refs['brushQuestionSelectionInfo'].showAnswer = false;
                    this.$refs['brushQuestionSelectionInfo'].checkbox = [];
                    this.$refs['brushQuestionSelectionInfo'].data = [];
                    this.$refs['brushQuestionSelectionInfo'].chapter = chapter;
                    this.$refs['brushQuestionSelectionInfo'].type = type;
                    this.getQuestionsByChapter({chapterId:chapter.id,type:type},'brushQuestionSelectionInfo');
                }else if(type == '3'){
                    this.$refs['brushQuestionAskInfo'].data = [];
                    this.$refs['brushQuestionAskInfo'].textarea = "";
                    this.$refs['brushQuestionAskInfo'].chapter = chapter;
                    this.$refs['brushQuestionAskInfo'].type = type;
                    this.getQuestionsByChapter({chapterId:chapter.id,type:type},'brushQuestionAskInfo');
                }else if(type == '4'){
                    this.$refs['brushQuestionUpperInfo'].data = [];
                    this.$refs['brushQuestionUpperInfo'].chapter = chapter;
                    this.$refs['brushQuestionUpperInfo'].type = type;
                    this.getQuestionsByChapter({chapterId:chapter.id,type:type},'brushQuestionUpperInfo');
                }else if(type == 'ok'){
                    this.$refs['brushQuestionOkInfo'].data = [];
                    this.$refs['brushQuestionOkInfo'].chapter = chapter;
                    this.getQuestionsByChapter({chapterId:chapter.id,type:type},'brushQuestionOkInfo');
                }
            }
        }
    }
</script>

<style scoped>

</style>