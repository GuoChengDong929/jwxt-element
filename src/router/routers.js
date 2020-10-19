import Main from "@/components/layout/index.vue";

export default [
	{
	    path:"/login",
	    name:'login',
	    component:()=>import("@/components/login/login-new.vue"),
	    meta:{
	      title: "登录页",
	      icon:'md-add',
	      hideInMenu: true,
	      isParent: false
	    }
	},
    {
        path: "/",
        name: "home",
        component: Main,
        meta: { //元数据
            title: "首页",
            icon:'md-add',
            hideInMenu: false,
        }
    },
	{
		path:"/access",
		name:'access',
		component: Main,
		meta:{
			title:'权限管理',
			icon:'el-icon-star-off',
			hideInMenu: false
		},
		children:[
			{
				path:"perm",
				name:'perm-permission',
				component: ()=>import("@/views/permission/perm-permission.vue"),
				meta:{
					title:'权限管理',
					icon:'el-icon-view',
					hideInMenu: false
				}
			},
			{
				path:"role",
				name:'perm-role',
				component: ()=>import("@/views/permission/perm-role.vue"),
				meta:{
					title:'角色管理',
					icon:'el-icon-s-flag',
					hideInMenu: false
				}
			},
			{
				path:"user",
				name:'perm-user',
				component: ()=>import("@/views/permission/perm-user.vue"),
				meta:{
					title:'用户管理',
					icon:'el-icon-user-solid',
					hideInMenu: false
				}
			}
		]
	},
	{
		path:'/academic',
		name:'academic',
		component:Main,
		meta:{
			title:'学术管理',
			icon:'el-icon-s-finance',
			hideInMenu:false
		},
		children:[
			{
				path:'curriculum',
				name:'curriculum',
				component:()=>import("@/views/academic/curriculum/index.vue"),
				meta:{
					title:'课程设计',
					icon:'el-icon-reading',
					hideInMenu:false
				}
			},
			{
				path:'single',
				name:'single',
				component:()=>import("@/views/academic/question/single-index.vue"),
				meta:{
					title:'录入单选',
					icon:'el-icon-caret-left',
					hideInMenu:false
				}
			},
			{
				path:'selection',
				name:'selection',
				component:()=>import("@/views/academic/question/selection-index.vue"),
				meta:{
					title:'录入多选',
					icon:'el-icon-caret-right',
					hideInMenu:false
				}
			},
			{
				path:'ask',
				name:'ask',
				component:()=>import("@/views/academic/question/ask-index.vue"),
				meta:{
					title:'录入问答',
					icon:'el-icon-caret-top',
					hideInMenu:false
				}
			},
			{
				path:'upper',
				name:'upper',
				component:()=>import("@/views/academic/question/upper-index.vue"),
				meta:{
					title:'录入上机',
					icon:'el-icon-caret-bottom',
					hideInMenu:false
				}
			},
			{
				path:"exam",
				name:"exam",
				component:()=>import("@/views/academic/exam/exam-index.vue"),
				meta:{
					title:"试卷列表",
					icon:"el-icon-edit-outline",
					hideInMenu:false
				}
			}
		]
	},
	{
		path:'/supervise',
		name:'supervise',
		component:Main,
		meta:{
			title:'成绩监测',
			icon:'el-icon-data-line',
			hideInMenu: false
		},
		children:[
			{
				path:'day',
				name:'day',
				component:()=>import("@/views/academic/supervise/day-supervise-index.vue"),
				meta:{
					title:'日测成绩',
					icon:'el-icon-news',
					hideInMenu:false
				}
			},
			{
				path:'week',
				name:'week',
				component:()=>import("@/views/academic/supervise/week-supervise-index.vue"),
				meta:{
					title:'周测成绩',
					icon:'el-icon-news',
					hideInMenu:false
				}
			},
			{
				path:'month',
				name:'month',
				component:()=>import("@/views/academic/supervise/month-supervise-index.vue"),
				meta:{
					title:'月考成绩',
					icon:'el-icon-news',
					hideInMenu:false
				}
			}
		]
	},
	{
		path:'/quality',
		name:'quality',
		component:Main,
		meta:{
			title:'教质管理',
			icon:'el-icon-magic-stick',
			hideInMenu:false
		},
		children:[
			{
				path:'classes',
				name:'classes',
				component:()=>import("@/views/quality/transact/classes-index.vue"),
				meta:{
					title:'班级管理',
					icon:"el-icon-copy-document",
					hideInMenu:false
				}
			},
			{
				path:'student',
				name:'student',
				component:()=>import("@/views/quality/student/student-index.vue"),
				meta:{
					title:'学生管理',
					icon:"el-icon-money",
					hideInMenu:false
				}
			},
            {
                path:'credit',
                name:'credit',
                component:()=>import("@/views/quality/credit/index.vue"),
                meta:{
                    title:'学分统计',
                    icon:'el-icon-s-data',
                    hideInMenu: false
                }
            },
            {
                path:'interview',
                name:'interview',
                component:()=>import("@/views/quality/interview/index.vue"),
                meta:{
                    title:'访谈管理',
                    icon:'el-icon-s-order',
                    hideInMenu: false
                }
            }
		]
	},
	{
		path:'/student_only',
		name:'student_only',
		component:Main,
		meta:{
			title:'学生专栏',
			icon:'el-icon-s-custom',
			hideInMenu:false
		},
		children:[
			{
				path:'student_exam',
				name:'student_exam',
				component:()=>import("@/views/student/exam/exam-student-index.vue"),
				meta:{
					title:'笔试管理',
					icon:'el-icon-edit',
					hideInMenu:false
				}
			},
			{
				path:'student-brush',
				name:'student-brush',
				component:()=>import("@/views/student/brush/brush-question-index.vue"),
				meta:{
					title:'我要刷题',
					icon:'el-icon-s-claim',
					hideInMenu: false
				}
			}
		]
	},
	{
		path:'/system',
		name:'system',
		component:Main,
		meta:{
			title:'系统管理',
			icon:'el-icon-set-up',
			hideInMenu:false
		},
		children:[
			{
				path:'dictionaries',
				name:'dictionaries',
				component:()=>import("@/views/system/dictionaries/index.vue"),
				meta:{
					title:'字典管理',
					icon:'el-icon-collection',
					hideInMenu: false
				}
			},
			{
				path:'log',
				name:'log',
				component:()=>import("@/views/system/log/log-index.vue"),
				meta:{
					title:'接口日志',
					icon:'el-icon-postcard',
					hideInMenu:false
				}
			},
			{
				path:'error-log',
				name:'error-log',
				component:()=>import("@/views/system/log/error-log-index.vue"),
				meta:{
					title:'错误日志',
					icon:'el-icon-view',
					hideInMenu:false
				}
			},
			{
				path:'traces',
				name:'traces',
				component:()=>import("@/views/system/actuator/traces-index.vue"),
				meta:{
					title:'请求监控',
					icon:'el-icon-share',
					hideInMenu:false
				}
			},
            {
                path:'device',
                name:'device',
                component:()=>import("@/views/demo/device.vue"),
                meta:{
                    title:'设备购置',
                    icon:'el-icon-s-goods',
                    hideInMenu:false
                }
            },
		]
	}
]