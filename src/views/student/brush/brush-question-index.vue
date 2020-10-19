<template>
    <div>
        <List  item-layout="vertical" style="margin: 20px;padding: 20px" size="small">
            <ListItem v-for="(item,index) in data" :key="item.title" @click.native="handleWindow(item)">
                <ListItemMeta avatar="http://q2p8ry5xb.bkt.clouddn.com/13744491-f150-4d52-b1c5-60da52e5d3c4.png" :title="item.title" :description="item.description"  />
                <template slot="extra">
                    <img :src="item.avatar" style="width: 140px">
                </template>
            </ListItem>
        </List>

        <el-pagination background style="text-align: center"
                       layout="prev,pager,next"
                       :total="params.total"
                       :page-size="params.size"
                       :current-page="params.page"
                       :hide-on-single-page="true"
                       @size-change="handleSizeChange"
                       @current-change="handlePageChange"></el-pagination>

        <brush-question-show ref="brushQuestionShow"></brush-question-show>
    </div>
</template>

<script>

    import { list } from "@/api/academic/curriculum";

    export default {
        name: "brush-question-index",
        components:{
          BrushQuestionShow:()=>import("@/views/student/brush/brush-question-show.vue")
        },
        methods:{
            handleSizeChange(val){
                this.params.size = val;
                this.getCurriculumList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getCurriculumList(this.params);
            },
            getCurriculumList(data){
                list(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.rows;
                        this.params.total = res.data.data.total;
                    }
                });
            },
            handleWindow(data){
                this.$refs['brushQuestionShow'].data = [];
                this.$refs['brushQuestionShow'].curriculumData = data;
                this.$refs['brushQuestionShow'].value = true;
            }
        },
        data(){
            return {
                params:{page:1,size:5,total:10},
                data: []
            }
        },
        created() {
            this.getCurriculumList(this.params);
        }
    }
</script>

<style scoped>

</style>