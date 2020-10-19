<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
			<el-row :gutter="20">
				<el-col :span="5">
					<el-card shadow="never" style="border:0rem">
						<template slot="header">
							<span>组织部门</span>
							<span class="el-icon-plus" style="float: right;" @click="openDepartmentWindow('departmentChild',null)"></span>
						</template>
						<Scroll height="650">
							<el-timeline style="padding: 0px 20px 0px 0px">
								<el-timeline-item v-for="department in department.data" :key="department.id">
									<el-link @click="getUsers(department)" type="primary">{{department.name}}</el-link>
									<el-tooltip class="item" effect="dark" content="修改部门信息" placement="bottom">
										<span class="el-icon-edit" style="float: right;" @click="openDepartmentWindow('departmentChild',department)"></span>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="删除部门信息" placement="bottom">
										<span class="el-icon-delete" style="float: right;margin-right: 20px;" @click="removeDepartment(department)"></span>
									</el-tooltip>
								</el-timeline-item>
							</el-timeline>
						</Scroll>
					</el-card>
				</el-col>
				<el-col :span="19">
					<el-card shadow="never" style="border:0rem">
						<template slot="header">
							<span>部门员工</span>
							<el-tooltip class="item" effect="dark" content="添加员工" placement="bottom">
								<span style="margin-left: 20px;float:right" class="el-icon-plus" @click="openUserWindow('userChild',null)"></span>
							</el-tooltip>
						</template>
						<Scroll height="650">
							<el-table :data="user.data" style="padding: 0px 20px 0px 0px">
								<el-table-column type="expand">
									<template slot-scope="props">
										<el-form inline label-position="right" class="demo-table-expand">
											<el-form-item label="用户名"><span>{{props.row.username}}</span></el-form-item>
											<el-form-item label="密码"><span>{{props.row.password}}</span></el-form-item>
											<el-form-item label="等级"><span>{{props.row.level}}</span></el-form-item>
											<el-form-item label="角色"><span>{{handleRole(props.row.roles)}}</span></el-form-item>
										</el-form>
									</template>
								</el-table-column>
								<el-table-column align="center" prop="nickName" label="姓名"></el-table-column>
								<el-table-column align="center" label="操作">
									<template slot-scope="scope">
										<el-button size="mini" type="success" plain  @click="openUserWindow('userChild',scope.row)"> <span class="el-icon-edit"></span>修改</el-button>
										<el-button size="mini" type="success" plain  @click="removeUser(scope.row)"> <span class="el-icon-delete"></span> 删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</Scroll>

						
						<el-pagination background
										layout="prev,pager,next"
										:total="user.params.total"
										:page-size="user.params.size"
										:current-page="user.params.page"
										:hide-on-single-page="true"
										@size-change="handleSizeChange"
										@current-change="handlePageChange"></el-pagination>

					</el-card>
				</el-col>
			</el-row>
		</div>
		<department-child ref="departmentChild"></department-child>
		<user-child ref="userChild"></user-child>
    </div>
</template>

<script>
	
	import { findAll,removeDepartment } from '@/api/access/department.js'
	import { userList } from '@/api/access/user.js'
	
	
    export default {
        name: "perm-user",
		components:{
			DepartmentChild:()=>import("@/views/permission/child/department-child.vue"),
			UserChild:()=>import("@/views/permission/child/user-child.vue")
		},
		data(){
			return {
				department:{
					data:[]
				},
				user:{
					data:[],
					params:{page:1,size:10,total:0},
					departmentId:''
					
				}
			}
		},
		methods:{
			handleSizeChange(val){
				this.user.params.size = val;
				this.getUsers({id:this.departmentId});
			},
			handlePageChange(val){
				this.user.params.page = val;
				this.getUsers({id:this.departmentId});
			},
			getDepartments(){ //获得部门列表
				findAll().then(res=>{
					if(res.data.data){
						this.department.data = res.data.data;
					}
				});
			},
			getUsers(department){ //获得用户列表
				
				this.departmentId = department.id;

				let obj = this.user.params;
				
				if(department){ //如果不等于null,说明是根据departmentId来查询相应员工列表
					obj = Object.assign({departmentId:department.id},this.user.params);// {page:1,size:10,total:0,departmentId:xxxx}
				}
				
				userList(obj).then(res=>{
					if(res.data.success){
						this.user.data = res.data.data.rows;
						this.user.params.total = res.data.data.total;
					}
				});
			},
			openDepartmentWindow(name,data){ //打开添加修改部门页面
				if(data == null){
					this.$refs[name].department = {};
				}else{
					this.$refs[name].department = data;
				}
				this.$refs[name].value = true;
			},
			removeDepartment(data){ //删除部门
				this.$confirm("确认删除部门吗?","友情提示",{type:'warning'}).then(()=>{
					removeDepartment(data).then(res=>{
						this.$message({
							type: res.data.success ? 'success' : 'error',
							message: res.data.message
						});
						this.getDepartments();
					});
				});
			},
			openUserWindow(name,data){ //打开添加,修改用户页面
				if(data == null){
					this.$refs[name].user = {};
				}else {
					this.$refs[name].user = data;
				}
				this.$refs[name].value = true;
			},
			handleRole(roles){
				if(roles.length > 0){
					let roleNames = [];
					roles.forEach(role=>{
						roleNames.push(role.name);
					});
					return roleNames.join(",");
				}else{
					return "";
				}
			},
			removeUser(user){
				this.$message.info("sorry,目前不提供删除功能");
				return false;
			}
		},
		created(){
			this.departmentId = "";
			this.getDepartments();
		}
    }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>