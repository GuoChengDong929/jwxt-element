<template>
	<div style="width:100%">
		
		<div v-for="(item,index) in array" :key="item.id" :style="{'transform':item.transform,'z-index':item.zIndex,'width':item.width,'left':item.left,'top':item.top}" class="x" >
			<el-card :body-style="{ padding: '0px' }">
				<div slot="header" align="left">
					<i style="float: right;" v-if='item.width=="600px"' class="el-icon-close" @click="guan(item)"></i>
					<div @click="xian(item,index)" style="width:90%">点我放大</div>
				</div>
				
				<div :style="{'height':item.height,'overflow':'auto'}">
					<el-card :body-style="{ padding: '0px' }" >
						<div v-for="(data,index2) in item.list" :key="data.id">
							<el-card :body-style="{ padding: '0px'}" style="border:0rem;margin-bottom: 10px" shadow="never">
								<div style="background-color: white;" class="y" align="left">
									问题({{index2+1}}):{{data.ti}}
								</div>
								
								<div style="background-color: gainsboro;margin: 10px" class="y" align="left">
									答案({{index2+1}}):{{data.an}}
								</div>
						
								<div style="height: 10px;"></div>
								
								<div>
									
									<el-row>
										<el-col :span="3">
											<div style="line-height: 40px;height: 40px;text-align:center">分数:</div>
										</el-col>
										<el-col :span="8">
											<el-input-number v-model="data.score"  :min="1" :max="item.maxScore" label="描述文字"></el-input-number>
										</el-col>
										<el-col :span="13">

										</el-col>
									</el-row>
									
									<div style="height: 10px;"></div>
									
									<el-row>
										<el-col :span="3" >
											<div style="line-height: 40px;height: 40px;text-align:center">评语:</div>
										</el-col>
										<el-col :span="21">
											<el-input
											type="textarea" style="height: 50px;"
											:rows="2"
											placeholder="请输入内容"
											v-model="data.teacherComment">
											</el-input>
										</el-col>
									</el-row>
									<div style="height: 10px;"></div>
								</div>
							</el-card>
							
							<div style="height: 10px;"></div>
						</div>
					</el-card>
				</div>

				<div style="padding: 14px;">
					<div class="bottom clearfix">
						<el-button class="button" @click="pan(item,index)">评分</el-button>
					</div>
				</div>
			</el-card>
		</div>

		
		<div :style="{zIndex:mz, backgroundColor:backgroundColor}" class="z"></div>
	
	</div>
</template>

<script>
	export default{
		data(){
			return{
				mz:-1,
				backgroundColor:"#fff",
				array:[],
				transform:"",
				zIndex:""
			}
		},
		methods:{
			
			xian(data,index){
				
				if(!this.transform){
					this.transform=data.transform;
				}
				if(!this.zIndex){
					this.zIndex=data.zIndex;
				}
			
				data.transform="";
				data.width="600px";
				data.top="15%";
				data.left="30%";
				data.height="500px";
				this.mz=998;
				data.zIndex=999;
				this.backgroundColor="#000"
			},
			
			pan(data,index){
				let obj=data;
				this.$confirm('确认给'+obj.name+'评分吗?')
				  .then(_ => {
					delete obj.transform;
					delete obj.height;
					delete obj.zIndex;
					delete obj.width;
					
					this.Scoring(obj);
					
					this.array.splice(index,1);
					this.mz=-1;
					this.backgroundColor="#fff"
					this.zIndex="";
					this.transform="";
				  })
				  .catch(_ => {});
			},
			
			Rendering(arr){
				
				let du=0;
				let y=0;

				if(arr.length<=20){
					du=-60;
					y=-165;
				}else if(arr.length<=30){
					du=-90;
					y=-155;
				}else if(arr.length<=40){
					du=-125;
					y=-110;
				}
				
				for(let i=0;i<arr.length;i++){
					let jiandu=du+i*3.6;
					let transform='rotate('+jiandu+'deg) translate(200px,'+y+'px)';
					let ceng=i+1;
					let style={transform:transform,zIndex:ceng,height:"400px"}
					arr[i]=Object.assign(style,arr[i]);
				}
				
				this.array=arr;
			},
			guan(data){
				data.zIndex=this.zIndex;
				data.transform=this.transform;
				data.width="18%";
				data.height="400px";
				this.backgroundColor="#fff"
				this.mz=-1;
				this.zIndex="";
				this.transform="";
				data.top="";
				data.left="";
			}
		},
		computed:{
			
		},
		components:{
			
		},
		watch:{
			
		},
		props:{
			Scoring:{
				type:Function,
				default:function(data){

				}
			},
		},
		created(){
			this.Rendering(this.array);
		}
	}
</script>

<style scoped>
.z{
	width:100%;
	height:100%;
	position: absolute;
	opacity: 0.1;
	top:0px;
	left: 0px;
}
.x{
	width: 18%;
	position: absolute;
	left:40%;
	top:46%;
	float: left;
	font-size: 15px;
}
.y{
	width: 94.5%;
	border-radius: 5px;
	padding: 15px;
	font-family: '微软雅黑'; 
}
	@media screen and (min-width:1200px){ }
	@media screen and (min-width: 960px) and (max-width: 1199px){ }
	@media screen and (min-width: 768px) and (max-width: 959px){
	    .x{
	    	right:20%;
	    }
	}
	@media screen and (max-width: 959px){
	    .x{
	    	right:20%;
	    }
	}
	@media screen and (max-height:1080px){
		
	}
	@media screen and (max-height:800px){
		.x{
			top: 50%;
		}
	}
	@media screen and (max-height:600px){
		.x{
			top: 50%;
		}
	}
	.clearfix{
		width: 100%;
	}
</style>