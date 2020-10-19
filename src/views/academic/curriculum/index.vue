<template><!--课程-->
	<div>
		<div style="margin: 20px 5px 10px 5px;padding: 5px;">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-card shadow="never" style="border:0rem">
							<template slot="header">
								<span>课程列表</span>
								<span class="el-icon-plus" style="float: right;" @click="openCurriculumWindow('curriculumChild',null)"></span>
							</template>
							
							<Scroll height="600">
								<el-timeline style="padding: 0px 20px 0px 0px">
									<el-timeline-item v-for="curriculum in data" :key="curriculum.id">
										<el-link @click="getChapters(curriculum)" type="primary">{{curriculum.name}}</el-link>
										<el-tooltip class="item" effect="dark" content="修改课程" placement="bottom">
											<span class="el-icon-edit" style="float: right;" @click="openCurriculumWindow('curriculumChild',curriculum)"></span>
										</el-tooltip>
										<el-tooltip class="item" effect="dark" content="删除课程" placement="bottom">
											<span class="el-icon-delete" style="float: right;margin-right: 20px;" @click="removeCurriculum(curriculum)"></span>
										</el-tooltip>
									</el-timeline-item>
								</el-timeline>
							</Scroll>
							
							
						</el-card>
					</el-col>
					<el-col :span="19">
						<el-card shadow="never" style="border:0rem">
							<template slot="header">
								<span>章节列表</span>
								<el-tooltip class="item" effect="dark" content="添加章节" placement="bottom">
									<span style="margin-left: 20px" class="el-icon-plus" @click="openChapterWindow('chapterChild',null,curriculumId)"></span>
								</el-tooltip>
							</template>
							<Scroll height="600">
								<el-table :data="chapter.data">
									<el-table-column type="index"></el-table-column>
									<el-table-column align="center" prop="name" label="章节名称"></el-table-column>
									<el-table-column align="center" prop="sortNumber" label="章节排序"></el-table-column>
									<el-table-column align="center" prop="createTime" label="创建时间">
										<template slot-scope="scope">
											{{format(scope.row.createTime)}}
										</template>
									</el-table-column>
									<el-table-column align="center" label="操作">
										<template slot-scope="scope">
											<el-button size="mini" type="success" plain  @click="openChapterWindow('chapterChild',scope.row,curriculumId)"><span class="el-icon-edit"></span>  修改</el-button>
											<el-button size="mini" type="success" plain  @click="removeChapter(scope.row)"><span class="el-icon-delete"></span>删除</el-button>
										</template>
									</el-table-column>
								</el-table>

								<el-pagination background
											   layout="prev,pager,next"
											   :total="chapter.params.total"
											   :page-size="chapter.params.size"
											   :current-page="chapter.params.page"
											   :hide-on-single-page="true"
											   @size-change="handleSizeChange"
											   @current-change="handlePageChange"></el-pagination>
							</Scroll>

						</el-card>
					</el-col>
				</el-row>
			</div>
			<curriculum-child ref="curriculumChild"></curriculum-child>
			<chapter-child ref="chapterChild"></chapter-child>
		</div>
</template>

<script>
	
	import { formatDate } from '@/utils/tools.js'
	
	import { findAll } from '@/api/academic/curriculum.js'
	
	import { list } from '@/api/academic/chapter.js'
	
	export default {
		name:'curriculum-index',
		components:{
			CurriculumChild:()=>import("@/views/academic/curriculum/child/curriculum-child.vue"),
			ChapterChild:()=>import("@/views/academic/curriculum/child/chapter-child.vue")
		},
		data(){
			return {
				data:[],
				chapter:{
					data:[],
					params:{page:1,size:10,total:0}
				},
				curriculumId:''
			}
		},
		methods:{
			format(date){
				return formatDate(date);
			},
			findAll(){
				findAll().then(res=>{
					if(res.data.success){
						this.data = res.data.data;
					}
				});
			},
			openCurriculumWindow(name,data){
				if(data == null){
					this.$refs[name].curriculum = {};
				}else{
					this.$refs[name].curriculum = data;
				}
				this.$refs[name].value = true;
			},

			handleSizeChange(val){
				this.chapter.params.size = val;
				this.getChapters({id:this.curriculumId});
			},
			handlePageChange(val){
				this.chapter.params.page = val;
				this.getChapters({id:this.curriculumId});
			},
			getChapters(curriculum){ //通过课程获得课程内所有的章节
				
				this.curriculumId = curriculum.id;
				let obj = Object.assign({curriculumId:curriculum.id},this.chapter.params);
				
				list(obj).then(res=>{
					if(res.data.success){
						this.chapter.data = res.data.data.rows;
						this.chapter.params.total = res.data.data.total;
					}
				});
			},
			removeCurriculum(curriculum){ //删除课程
				this.$message.info("sorry,目前不提供删除功能");
				return false;
			},
			openChapterWindow(name,data,curriculumId){
				if(data == null){
					this.$refs[name].data = {};
				}else{
					this.$refs[name].data = data;
				}
				this.$refs[name].data.curriculumId = curriculumId;
				this.$refs[name].value = true;
			},
			removeChapter(data){
				this.$message.info("sorry,目前不提供删除功能");
				return false;
			}
		},
		created() {
			this.curriculumId  = '';
			this.findAll();
		}
	}
</script>

<style>
</style>
