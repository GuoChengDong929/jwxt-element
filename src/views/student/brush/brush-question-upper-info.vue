<template>
    <div>
        <el-dialog  style="height: 100vh" :before-close="beforeCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" title="上机题" :visible.sync="value">
            <Scroll style="height: 40vh">
                <el-table :data="data">
                    <el-table-column type="index" align="center" width="80px" label="序号"></el-table-column>
                    <el-table-column prop="upperContent" label="题干"  show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" plain @click="handleInfo(scope.row)">详情</el-button>
                            <el-button size="mini" type="danger" plain @click="updateOk(scope.row)">加入已答题库</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </Scroll>
            <el-card :style="{border:'0px',height: '60vh',marginTop: '50px',display:infoDisplay}" shadow="never">


                <el-divider content-position="left" style="margin: 20px 0px 20px 0px">上机题题目</el-divider>
                <p>{{content}}</p>

                <el-divider content-position="left" style="margin: 20px 0px 20px 0px">上机题解析</el-divider>

                <p>{{analysis}}</p>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>

    import { updateOk } from "@/api/student/prush";

    export default {
        name: "brush-question-upper-info",
        data(){
            return {
                value:false,
                data:[],
                type:'0',
                chapter:{},
                infoDisplay:'none',
                content:'',
                analysis:''
            }
        },
        methods:{
            beforeCloseDialog(){
                this.content = '';
                this.analysis = '';
                this.infoDisplay = 'none';
                this.value = false;
            },
            handleInfo(upper){
                this.content = upper.upperContent;
                this.analysis = upper.upperAnalysis;
                this.infoDisplay = 'block';
            },
            updateOk(upper){
                this.$confirm("确定吗?","",{type:'warning'}).then(()=>{
                    updateOk({chapterId:this.chapter.id,type:this.type,upperId:upper.id}).then(res=>{
                        if(res.data.success){
                            this.content = '';
                            this.analysis = '';
                            this.infoDisplay = 'none';
                            this.$message.success("加入已答题库成功");
                            this.$parent.getQuestionsByChapter({chapterId:this.chapter.id,type:this.type},'brushQuestionUpperInfo');
                            if(this.data.length == 1){
                                this.value = false;
                            }
                        }else{
                            this.$message.error(res.data.message);
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>