var KakigoriShell=(()=>{var Cl=Object.defineProperty;var Sm=Object.getOwnPropertyDescriptor;var Mm=Object.getOwnPropertyNames;var bm=Object.prototype.hasOwnProperty;var Cc=(e,t)=>{for(var i in t)Cl(e,i,{get:t[i],enumerable:!0})},Em=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Mm(t))!bm.call(e,a)&&a!==i&&Cl(e,a,{get:()=>t[a],enumerable:!(r=Sm(t,a))||r.enumerable});return e};var wm=e=>Em(Cl({},"__esModule",{value:!0}),e);var RM={};Cc(RM,{start:()=>AM});var Ki={};Cc(Ki,{ACESFilmicToneMapping:()=>Nh,AddEquation:()=>ta,AddOperation:()=>Dd,AdditiveAnimationBlendMode:()=>Xh,AdditiveBlending:()=>Nn,AgXToneMapping:()=>Fh,AlphaFormat:()=>Vh,AlwaysCompare:()=>Yh,AlwaysDepth:()=>co,AlwaysStencilFunc:()=>Hd,AmbientLight:()=>Rf,AnimationAction:()=>zf,AnimationClip:()=>Jn,AnimationLoader:()=>_v,AnimationMixer:()=>qv,AnimationObjectGroup:()=>Xv,AnimationUtils:()=>dv,ArcCurve:()=>Lp,ArrayCamera:()=>Nf,ArrowHelper:()=>y_,AttachedBindMode:()=>_h,Audio:()=>Ff,AudioAnalyser:()=>Nv,AudioContext:()=>Mc,AudioListener:()=>Lv,AudioLoader:()=>Rv,AxesHelper:()=>x_,BackSide:()=>gi,BasicDepthPacking:()=>Bd,BasicShadowMap:()=>Pm,BatchedMesh:()=>_p,BezierInterpolant:()=>Mf,Bone:()=>ec,BooleanKeyframeTrack:()=>ma,Box2:()=>Gf,Box3:()=>ci,Box3Helper:()=>v_,BoxGeometry:()=>Qt,BoxHelper:()=>g_,BufferAttribute:()=>Dt,BufferGeometry:()=>dt,BufferGeometryLoader:()=>Uf,ByteType:()=>zh,Cache:()=>ir,Camera:()=>xl,CameraHelper:()=>m_,CanvasTexture:()=>rc,CapsuleGeometry:()=>fl,CatmullRomCurve3:()=>Dp,CineonToneMapping:()=>Uh,CircleGeometry:()=>Ep,ClampToEdgeWrapping:()=>Kt,Clock:()=>e_,Color:()=>ke,ColorKeyframeTrack:()=>vc,ColorManagement:()=>yt,Compatibility:()=>_g,CompressedArrayTexture:()=>P0,CompressedCubeTexture:()=>I0,CompressedTexture:()=>pl,CompressedTextureLoader:()=>yv,ConeGeometry:()=>pa,ConstantAlphaFactor:()=>Pd,ConstantColorFactor:()=>Rd,Controls:()=>M_,CubeCamera:()=>Ko,CubeDepthTexture:()=>ac,CubeReflectionMapping:()=>_r,CubeRefractionMapping:()=>oa,CubeTexture:()=>ts,CubeTextureLoader:()=>xv,CubicBezierCurve:()=>oc,CubicBezierCurve3:()=>Up,CubicInterpolant:()=>xf,CullFaceBack:()=>mh,CullFaceFront:()=>dd,CullFaceFrontBack:()=>Cm,CullFaceNone:()=>ud,Curve:()=>Ji,CurvePath:()=>Op,CustomBlending:()=>fd,CustomToneMapping:()=>Oh,CylinderGeometry:()=>kt,Cylindrical:()=>i_,Data3DTexture:()=>hl,DataArrayTexture:()=>ll,DataTexture:()=>Ui,DataTextureLoader:()=>Sv,DataUtils:()=>i0,DecrementStencilOp:()=>Zm,DecrementWrapStencilOp:()=>Km,DefaultLoadingManager:()=>wf,DepthFormat:()=>yr,DepthStencilFormat:()=>fr,DepthTexture:()=>ua,DetachedBindMode:()=>Ud,DirectionalLight:()=>Ml,DirectionalLightHelper:()=>f_,DiscreteInterpolant:()=>Sf,DodecahedronGeometry:()=>Cp,DoubleSide:()=>Di,DstAlphaFactor:()=>bd,DstColorFactor:()=>wd,DynamicCopyUsage:()=>dg,DynamicDrawUsage:()=>sg,DynamicReadUsage:()=>hg,EdgesGeometry:()=>Ip,EllipseCurve:()=>ml,EqualCompare:()=>Vd,EqualDepth:()=>po,EqualStencilFunc:()=>tg,EquirectangularReflectionMapping:()=>wn,EquirectangularRefractionMapping:()=>Tn,Euler:()=>Yi,EventDispatcher:()=>Zi,ExternalTexture:()=>nc,ExtrudeGeometry:()=>Gp,FileLoader:()=>Mr,Float16BufferAttribute:()=>h0,Float32BufferAttribute:()=>qe,FloatType:()=>mi,Fog:()=>op,FogExp2:()=>np,FramebufferTexture:()=>C0,FrontSide:()=>Ir,Frustum:()=>ca,FrustumArray:()=>tc,GLBufferAttribute:()=>Qv,GLSL1:()=>fg,GLSL3:()=>xh,GreaterCompare:()=>Wd,GreaterDepth:()=>mo,GreaterEqualCompare:()=>qh,GreaterEqualDepth:()=>fo,GreaterEqualStencilFunc:()=>ng,GreaterStencilFunc:()=>rg,GridHelper:()=>d_,Group:()=>$t,HTMLTexture:()=>L0,HalfFloatType:()=>qi,HemisphereLight:()=>_l,HemisphereLightHelper:()=>u_,IcosahedronGeometry:()=>Wp,ImageBitmapLoader:()=>Av,ImageLoader:()=>Kn,ImageUtils:()=>Qd,IncrementStencilOp:()=>Ym,IncrementWrapStencilOp:()=>Jm,InstancedBufferAttribute:()=>Ja,InstancedBufferGeometry:()=>Df,InstancedInterleavedBuffer:()=>$v,InstancedMesh:()=>Or,Int16BufferAttribute:()=>o0,Int32BufferAttribute:()=>l0,Int8BufferAttribute:()=>a0,IntType:()=>Qo,InterleavedBuffer:()=>dl,InterleavedBufferAttribute:()=>Xn,Interpolant:()=>tn,InterpolateBezier:()=>yh,InterpolateDiscrete:()=>zn,InterpolateLinear:()=>qo,InterpolateSmooth:()=>ro,InterpolationSamplingMode:()=>vg,InterpolationSamplingType:()=>gg,InvertStencilOp:()=>$m,KeepStencilOp:()=>ao,KeyframeTrack:()=>Bi,LOD:()=>pp,LatheGeometry:()=>rs,Layers:()=>cl,LessCompare:()=>Gd,LessDepth:()=>uo,LessEqualCompare:()=>jh,LessEqualDepth:()=>qa,LessEqualStencilFunc:()=>ig,LessStencilFunc:()=>eg,Light:()=>Br,LightProbe:()=>Pf,LightShadow:()=>yl,Line:()=>Nr,Line3:()=>s_,LineBasicMaterial:()=>_i,LineCurve:()=>lc,LineCurve3:()=>Np,LineDashedMaterial:()=>vf,LineLoop:()=>yp,LineSegments:()=>ar,LinearFilter:()=>Nt,LinearInterpolant:()=>gc,LinearMipMapLinearFilter:()=>Nm,LinearMipMapNearestFilter:()=>Um,LinearMipmapLinearFilter:()=>ji,LinearMipmapNearestFilter:()=>An,LinearSRGBColorSpace:()=>kn,LinearToneMapping:()=>Lh,LinearTransfer:()=>Gn,Loader:()=>Ei,LoaderUtils:()=>wh,LoadingManager:()=>yc,LoopOnce:()=>Nd,LoopPingPong:()=>Fd,LoopRepeat:()=>Od,MOUSE:()=>Am,Material:()=>ii,MaterialBlending:()=>Im,MaterialLoader:()=>If,MathUtils:()=>kg,Matrix2:()=>r_,Matrix3:()=>ut,Matrix4:()=>lt,MaxEquation:()=>_d,Mesh:()=>it,MeshBasicMaterial:()=>vi,MeshDepthMaterial:()=>fc,MeshDistanceMaterial:()=>mc,MeshLambertMaterial:()=>fa,MeshMatcapMaterial:()=>gf,MeshNormalMaterial:()=>mf,MeshPhongMaterial:()=>pf,MeshPhysicalMaterial:()=>df,MeshStandardMaterial:()=>ri,MeshToonMaterial:()=>ff,MinEquation:()=>vd,MirroredRepeatWrapping:()=>On,MixOperation:()=>Ld,MultiplyBlending:()=>vh,MultiplyOperation:()=>$n,NearestFilter:()=>Ht,NearestMipMapLinearFilter:()=>Dm,NearestMipMapNearestFilter:()=>Lm,NearestMipmapLinearFilter:()=>Ga,NearestMipmapNearestFilter:()=>Bh,NeutralToneMapping:()=>Qn,NeverCompare:()=>kd,NeverDepth:()=>ho,NeverStencilFunc:()=>Qm,NoBlending:()=>na,NoColorSpace:()=>dr,NoNormalPacking:()=>Vm,NoToneMapping:()=>rr,NormalAnimationBlendMode:()=>nl,NormalBlending:()=>Xa,NormalGAPacking:()=>Xm,NormalRGPacking:()=>Wm,NotEqualCompare:()=>Xd,NotEqualDepth:()=>go,NotEqualStencilFunc:()=>ag,NumberKeyframeTrack:()=>gl,Object3D:()=>Et,ObjectLoader:()=>wv,ObjectSpaceNormalMap:()=>zd,OctahedronGeometry:()=>dc,OneFactor:()=>xd,OneMinusConstantAlphaFactor:()=>Id,OneMinusConstantColorFactor:()=>Cd,OneMinusDstAlphaFactor:()=>Ed,OneMinusDstColorFactor:()=>Td,OneMinusSrcAlphaFactor:()=>Ih,OneMinusSrcColorFactor:()=>Md,OrthographicCamera:()=>Sl,PCFShadowMap:()=>En,PCFSoftShadowMap:()=>pd,PMREMGenerator:()=>Rh,Path:()=>jn,PerspectiveCamera:()=>Jt,Plane:()=>Ri,PlaneGeometry:()=>Fi,PlaneHelper:()=>__,PointLight:()=>Af,PointLightHelper:()=>h_,Points:()=>xp,PointsMaterial:()=>ic,PolarGridHelper:()=>p_,PolyhedronGeometry:()=>en,PositionalAudio:()=>Uv,PropertyBinding:()=>Rt,PropertyMixer:()=>Bf,QuadraticBezierCurve:()=>hc,QuadraticBezierCurve3:()=>cc,Quaternion:()=>Bt,QuaternionKeyframeTrack:()=>vl,QuaternionLinearInterpolant:()=>Ef,R11_EAC_Format:()=>Eo,RED_GREEN_RGTC2_Format:()=>Bn,RED_RGTC1_Format:()=>Wo,REVISION:()=>Tm,RG11_EAC_Format:()=>Fn,RGBADepthPacking:()=>Hm,RGBAFormat:()=>bi,RGBAIntegerFormat:()=>al,RGBA_ASTC_10x10_Format:()=>Bo,RGBA_ASTC_10x5_Format:()=>No,RGBA_ASTC_10x6_Format:()=>Oo,RGBA_ASTC_10x8_Format:()=>Fo,RGBA_ASTC_12x10_Format:()=>zo,RGBA_ASTC_12x12_Format:()=>Ho,RGBA_ASTC_4x4_Format:()=>Ao,RGBA_ASTC_5x4_Format:()=>Ro,RGBA_ASTC_5x5_Format:()=>Co,RGBA_ASTC_6x5_Format:()=>Po,RGBA_ASTC_6x6_Format:()=>Io,RGBA_ASTC_8x5_Format:()=>Lo,RGBA_ASTC_8x6_Format:()=>Do,RGBA_ASTC_8x8_Format:()=>Uo,RGBA_BPTC_Format:()=>ko,RGBA_ETC2_EAC_Format:()=>bo,RGBA_PVRTC_2BPPV1_Format:()=>xo,RGBA_PVRTC_4BPPV1_Format:()=>yo,RGBA_S3TC_DXT1_Format:()=>Cn,RGBA_S3TC_DXT3_Format:()=>Pn,RGBA_S3TC_DXT5_Format:()=>In,RGBDepthPacking:()=>km,RGBFormat:()=>Wh,RGBIntegerFormat:()=>Om,RGB_BPTC_SIGNED_Format:()=>Go,RGB_BPTC_UNSIGNED_Format:()=>Vo,RGB_ETC1_Format:()=>So,RGB_ETC2_Format:()=>Mo,RGB_PVRTC_2BPPV1_Format:()=>_o,RGB_PVRTC_4BPPV1_Format:()=>vo,RGB_S3TC_DXT1_Format:()=>Rn,RGDepthPacking:()=>Gm,RGFormat:()=>Dr,RGIntegerFormat:()=>rl,RawShaderMaterial:()=>pc,Ray:()=>Qa,Raycaster:()=>as,RectAreaLight:()=>Cf,RedFormat:()=>il,RedIntegerFormat:()=>es,ReinhardToneMapping:()=>Dh,RenderObjectRefreshType:()=>yg,RenderTarget:()=>Jh,RenderTarget3D:()=>Yv,RepeatWrapping:()=>Lr,ReplaceStencilOp:()=>qm,ReverseSubtractEquation:()=>gd,RingGeometry:()=>Zp,SIGNED_R11_EAC_Format:()=>wo,SIGNED_RED_GREEN_RGTC2_Format:()=>jo,SIGNED_RED_RGTC1_Format:()=>Xo,SIGNED_RG11_EAC_Format:()=>To,SRGBColorSpace:()=>Xt,SRGBTransfer:()=>bt,Scene:()=>ul,ShaderChunk:()=>ft,ShaderLib:()=>Xi,ShaderMaterial:()=>Sr,ShadowMaterial:()=>hf,Shape:()=>is,ShapeGeometry:()=>Kp,ShapePath:()=>S_,ShapeUtils:()=>mr,ShortType:()=>Hh,Skeleton:()=>mp,SkeletonHelper:()=>l_,SkinnedMesh:()=>fp,Source:()=>Wg,Sphere:()=>ti,SphereGeometry:()=>yi,Spherical:()=>t_,SphericalHarmonics3:()=>Sc,SplineCurve:()=>uc,SpotLight:()=>Tf,SpotLightHelper:()=>o_,Sprite:()=>dp,SpriteMaterial:()=>Qh,SrcAlphaFactor:()=>Ph,SrcAlphaSaturateFactor:()=>Ad,SrcColorFactor:()=>Sd,StaticCopyUsage:()=>ug,StaticDrawUsage:()=>sl,StaticReadUsage:()=>lg,StereoCamera:()=>Cv,StreamCopyUsage:()=>pg,StreamDrawUsage:()=>og,StreamReadUsage:()=>cg,StringKeyframeTrack:()=>ga,SubtractEquation:()=>md,SubtractiveBlending:()=>gh,TOUCH:()=>Rm,TangentSpaceNormalMap:()=>xr,TetrahedronGeometry:()=>ef,Texture:()=>Yt,TextureLoader:()=>xc,TextureSource:()=>tr,TextureUtils:()=>A_,Timer:()=>Of,TimestampQuery:()=>mg,TorusGeometry:()=>Fr,TorusKnotGeometry:()=>af,Triangle:()=>Pr,TriangleFanDrawMode:()=>zm,TriangleStripDrawMode:()=>Bm,TrianglesDrawMode:()=>Fm,TubeGeometry:()=>sf,UVMapping:()=>$o,Uint16BufferAttribute:()=>Kh,Uint32BufferAttribute:()=>$h,Uint8BufferAttribute:()=>n0,Uint8ClampedBufferAttribute:()=>s0,Uniform:()=>Zv,UniformsGroup:()=>Kv,UniformsLib:()=>Be,UniformsUtils:()=>uf,UnsignedByteType:()=>Mi,UnsignedInt101111Type:()=>Gh,UnsignedInt248Type:()=>la,UnsignedInt5999Type:()=>kh,UnsignedIntType:()=>Ni,UnsignedShort4444Type:()=>el,UnsignedShort5551Type:()=>tl,UnsignedShortType:()=>Ya,VSMShadowMap:()=>ka,Vector2:()=>se,Vector3:()=>R,Vector4:()=>Ct,VectorKeyframeTrack:()=>_c,VideoFrameTexture:()=>R0,VideoTexture:()=>Sp,WebGL3DRenderTarget:()=>qg,WebGLArrayRenderTarget:()=>jg,WebGLCoordinateSystem:()=>Ci,WebGLCubeRenderTarget:()=>bl,WebGLRenderTarget:()=>Pi,WebGLRenderer:()=>wc,WebGLUtils:()=>tm,WebGPUCoordinateSystem:()=>ha,WebXRController:()=>oo,WireframeGeometry:()=>lf,WrapAroundEnding:()=>Hn,ZeroCurvatureEnding:()=>ia,ZeroFactor:()=>yd,ZeroSlopeEnding:()=>ra,ZeroStencilOp:()=>jm,createCanvasElement:()=>qd,error:()=>Qe,getConsoleFunction:()=>bg,log:()=>Wn,setConsoleFunction:()=>Mg,warn:()=>Le,warnOnce:()=>gr});var Tm="187",Am={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Rm={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ud=0,mh=1,dd=2,Cm=3,Pm=0,En=1,pd=2,ka=3,Ir=0,gi=1,Di=2,na=0,Xa=1,Nn=2,gh=3,vh=4,fd=5,Im=6,ta=100,md=101,gd=102,vd=103,_d=104,yd=200,xd=201,Sd=202,Md=203,Ph=204,Ih=205,bd=206,Ed=207,wd=208,Td=209,Ad=210,Rd=211,Cd=212,Pd=213,Id=214,ho=0,co=1,uo=2,qa=3,po=4,fo=5,mo=6,go=7,$n=0,Ld=1,Dd=2,rr=0,Lh=1,Dh=2,Uh=3,Nh=4,Oh=5,Fh=6,Qn=7,_h="attached",Ud="detached",$o=300,_r=301,oa=302,wn=303,Tn=304,Lr=1e3,Kt=1001,On=1002,Ht=1003,Bh=1004,Lm=1004,Ga=1005,Dm=1005,Nt=1006,An=1007,Um=1007,ji=1008,Nm=1008,Mi=1009,zh=1010,Hh=1011,Ya=1012,Qo=1013,Ni=1014,mi=1015,qi=1016,el=1017,tl=1018,la=1020,kh=35902,Gh=35899,Vh=1021,Wh=1022,bi=1023,yr=1026,fr=1027,il=1028,es=1029,Dr=1030,rl=1031,Om=1032,al=1033,Rn=33776,Cn=33777,Pn=33778,In=33779,vo=35840,_o=35841,yo=35842,xo=35843,So=36196,Mo=37492,bo=37496,Eo=37488,wo=37489,Fn=37490,To=37491,Ao=37808,Ro=37809,Co=37810,Po=37811,Io=37812,Lo=37813,Do=37814,Uo=37815,No=37816,Oo=37817,Fo=37818,Bo=37819,zo=37820,Ho=37821,ko=36492,Go=36494,Vo=36495,Wo=36283,Xo=36284,Bn=36285,jo=36286,Nd=2200,Od=2201,Fd=2202,zn=2300,qo=2301,ro=2302,yh=2303,ia=2400,ra=2401,Hn=2402,nl=2500,Xh=2501,Fm=0,Bm=1,zm=2,Bd=3200,Hm=3201,km=3202,Gm=3203,xr=0,zd=1,dr="",Xt="srgb",kn="srgb-linear",Gn="linear",bt="srgb",Vm="",Wm="rg",Xm="ga",jm=0,ao=7680,qm=7681,Ym=7682,Zm=7683,Jm=34055,Km=34056,$m=5386,Qm=512,eg=513,tg=514,ig=515,rg=516,ag=517,ng=518,Hd=519,kd=512,Gd=513,Vd=514,jh=515,Wd=516,Xd=517,qh=518,Yh=519,sl=35044,sg=35048,og=35040,lg=35045,hg=35049,cg=35041,ug=35046,dg=35050,pg=35042,fg="100",xh="300 es",Ci=2e3,ha=2001,mg={COMPUTE:"compute",RENDER:"render"},gg={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},vg={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},_g={TEXTURE_COMPARE:"depthTextureCompare"},yg={NONE:0,SHARED:1,FULL:2};function xg(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}var Sg={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Va(e,t){return new Sg[e](t)}function jd(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Vn(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function qd(){let e=Vn("canvas");return e.style.display="block",e}var Pc={},Ur=null;function Mg(e){Ur=e}function bg(){return Ur}function Wn(...e){let t="THREE."+e.shift();Ur?Ur("log",t,...e):console.log(t,...e)}function Yd(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let i=e[1];i&&i.isStackTrace?e[0]+=" "+i.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Le(...e){e=Yd(e);let t="THREE."+e.shift();if(Ur)Ur("warn",t,...e);else{let i=e[0];i&&i.isStackTrace?console.warn(i.getError(t)):console.warn(t,...e)}}function Qe(...e){e=Yd(e);let t="THREE."+e.shift();if(Ur)Ur("error",t,...e);else{let i=e[0];i&&i.isStackTrace?console.error(i.getError(t)):console.error(t,...e)}}function gr(...e){let t=e.join(" ");t in Pc||(Pc[t]=!0,Le(...e))}function Eg(e,t,i){return new Promise(function(r,a){function n(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(n,i);break;default:r()}}setTimeout(n,i)})}var wg={[ho]:ho,[uo]:mo,[po]:po,[qa]:fo,[co]:co,[mo]:uo,[go]:go,[fo]:qa},Zi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let a=0,n=r.length;a<n;a++)r[a].call(this,e);e.target=null}}},si=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ic=1234567,sa=Math.PI/180,Za=180/Math.PI;function Oi(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(si[e&255]+si[e>>8&255]+si[e>>16&255]+si[e>>24&255]+"-"+si[t&255]+si[t>>8&255]+"-"+si[t>>16&15|64]+si[t>>24&255]+"-"+si[i&63|128]+si[i>>8&255]+"-"+si[i>>16&255]+si[i>>24&255]+si[r&255]+si[r>>8&255]+si[r>>16&255]+si[r>>24&255]).toLowerCase()}function ht(e,t,i){return Math.max(t,Math.min(i,e))}function Zh(e,t){return(e%t+t)%t}function Tg(e,t,i,r,a){return r+(e-t)*(a-r)/(i-t)}function Ag(e,t,i){return e!==t?(i-e)/(t-e):0}function Ln(e,t,i){return(1-i)*e+i*t}function Rg(e,t,i,r){return Ln(e,t,1-Math.exp(-i*r))}function Cg(e,t=1){return t-Math.abs(Zh(e,t*2)-t)}function Pg(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*(3-2*e))}function Ig(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*e*(e*(e*6-15)+10))}function Lg(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Dg(e,t){return e+Math.random()*(t-e)}function Ug(e){return e*(.5-Math.random())}function Ng(e){e!==void 0&&(Ic=e);let t=Ic+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Og(e){return e*sa}function Fg(e){return e*Za}function Bg(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function zg(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function Zd(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function Hg(e,t,i,r,a){let n=Math.cos,s=Math.sin,o=n(i/2),l=s(i/2),h=n((t+r)/2),c=s((t+r)/2),u=n((t-r)/2),p=s((t-r)/2),d=n((r-t)/2),g=s((r-t)/2);switch(a){case"XYX":e.set(o*c,l*u,l*p,o*h);break;case"YZY":e.set(l*p,o*c,l*u,o*h);break;case"ZXZ":e.set(l*u,l*p,o*c,o*h);break;case"XZX":e.set(o*c,l*g,l*d,o*h);break;case"YXY":e.set(l*d,o*c,l*g,o*h);break;case"ZYZ":e.set(l*g,l*d,o*c,o*h);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function ol(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function aa(e,t){if(t.constructor===Float32Array)return e;let i=ol(t);if(i===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(e/i,-1)}function hi(e,t){if(t.constructor===Float32Array)return e;let i=ol(t);if(i===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(e*i)}var kg={DEG2RAD:sa,RAD2DEG:Za,generateUUID:Oi,clamp:ht,euclideanModulo:Zh,mapLinear:Tg,inverseLerp:Ag,lerp:Ln,damp:Rg,pingpong:Cg,smoothstep:Pg,smootherstep:Ig,randInt:Lg,randFloat:Dg,randFloatSpread:Ug,seededRandom:Ng,degToRad:Og,radToDeg:Fg,isPowerOfTwo:Bg,ceilPowerOfTwo:zg,floorPowerOfTwo:Zd,setQuaternionFromProperEuler:Hg,normalize:hi,denormalize:aa},Jd=class{constructor(t=0,i=0){this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let i=this.x,r=this.y,a=t.elements;return this.x=a[0]*i+a[3]*r+a[6],this.y=a[1]*i+a[4]*r+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=ht(this.x,t.x,i.x),this.y=ht(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=ht(this.x,t,i),this.y=ht(this.y,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(ht(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(ht(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y;return i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){let r=Math.cos(i),a=Math.sin(i),n=this.x-t.x,s=this.y-t.y;return this.x=n*r-s*a+t.x,this.y=n*a+s*r+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jd.prototype.isVector2=!0;var se=Jd,Bt=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,a,n,s){let o=i[r+0],l=i[r+1],h=i[r+2],c=i[r+3],u=a[n+0],p=a[n+1],d=a[n+2],g=a[n+3];if(c!==g||o!==u||l!==p||h!==d){let y=o*u+l*p+h*d+c*g;y<0&&(u=-u,p=-p,d=-d,g=-g,y=-y);let v=1-s;if(y<.9995){let m=Math.acos(y),f=Math.sin(m);v=Math.sin(v*m)/f,s=Math.sin(s*m)/f,o=o*v+u*s,l=l*v+p*s,h=h*v+d*s,c=c*v+g*s}else{o=o*v+u*s,l=l*v+p*s,h=h*v+d*s,c=c*v+g*s;let m=1/Math.sqrt(o*o+l*l+h*h+c*c);o*=m,l*=m,h*=m,c*=m}}e[t]=o,e[t+1]=l,e[t+2]=h,e[t+3]=c}static multiplyQuaternionsFlat(e,t,i,r,a,n){let s=i[r],o=i[r+1],l=i[r+2],h=i[r+3],c=a[n],u=a[n+1],p=a[n+2],d=a[n+3];return e[t]=s*d+h*c+o*p-l*u,e[t+1]=o*d+h*u+l*c-s*p,e[t+2]=l*d+h*p+s*u-o*c,e[t+3]=h*d-s*c-o*u-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,a=e._z,n=e._order,s=Math.cos,o=Math.sin,l=s(i/2),h=s(r/2),c=s(a/2),u=o(i/2),p=o(r/2),d=o(a/2);switch(n){case"XYZ":this._x=u*h*c+l*p*d,this._y=l*p*c-u*h*d,this._z=l*h*d+u*p*c,this._w=l*h*c-u*p*d;break;case"YXZ":this._x=u*h*c+l*p*d,this._y=l*p*c-u*h*d,this._z=l*h*d-u*p*c,this._w=l*h*c+u*p*d;break;case"ZXY":this._x=u*h*c-l*p*d,this._y=l*p*c+u*h*d,this._z=l*h*d+u*p*c,this._w=l*h*c-u*p*d;break;case"ZYX":this._x=u*h*c-l*p*d,this._y=l*p*c+u*h*d,this._z=l*h*d-u*p*c,this._w=l*h*c+u*p*d;break;case"YZX":this._x=u*h*c+l*p*d,this._y=l*p*c+u*h*d,this._z=l*h*d-u*p*c,this._w=l*h*c-u*p*d;break;case"XZY":this._x=u*h*c-l*p*d,this._y=l*p*c-u*h*d,this._z=l*h*d+u*p*c,this._w=l*h*c+u*p*d;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+n)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10],u=i+s+c;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-o)*p,this._y=(a-l)*p,this._z=(n-r)*p}else if(i>s&&i>c){let p=2*Math.sqrt(1+i-s-c);this._w=(h-o)/p,this._x=.25*p,this._y=(r+n)/p,this._z=(a+l)/p}else if(s>c){let p=2*Math.sqrt(1+s-i-c);this._w=(a-l)/p,this._x=(r+n)/p,this._y=.25*p,this._z=(o+h)/p}else{let p=2*Math.sqrt(1+c-i-s);this._w=(n-r)/p,this._x=(a+l)/p,this._y=(o+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=t._x,o=t._y,l=t._z,h=t._w;return this._x=i*h+n*s+r*l-a*o,this._y=r*h+n*o+a*s-i*l,this._z=a*h+n*l+i*o-r*s,this._w=n*h-i*s-r*o-a*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=this.dot(e);s<0&&(i=-i,r=-r,a=-a,n=-n,s=-s);let o=1-t;if(s<.9995){let l=Math.acos(s),h=Math.sin(l);o=Math.sin(o*l)/h,t=Math.sin(t*l)/h,this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this._onChangeCallback()}else this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Kd=class{constructor(t=0,i=0,r=0){this.x=t,this.y=i,this.z=r}set(t,i,r){return r===void 0&&(r=this.z),this.x=t,this.y=i,this.z=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(Lc.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(Lc.setFromAxisAngle(t,i))}applyMatrix3(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[3]*r+n[6]*a,this.y=n[1]*i+n[4]*r+n[7]*a,this.z=n[2]*i+n[5]*r+n[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=t.elements,s=1/(n[3]*i+n[7]*r+n[11]*a+n[15]);return this.x=(n[0]*i+n[4]*r+n[8]*a+n[12])*s,this.y=(n[1]*i+n[5]*r+n[9]*a+n[13])*s,this.z=(n[2]*i+n[6]*r+n[10]*a+n[14])*s,this}applyQuaternion(t){let i=this.x,r=this.y,a=this.z,n=t.x,s=t.y,o=t.z,l=t.w,h=2*(s*a-o*r),c=2*(o*i-n*a),u=2*(n*r-s*i);return this.x=i+l*h+s*u-o*c,this.y=r+l*c+o*h-n*u,this.z=a+l*u+n*c-s*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[4]*r+n[8]*a,this.y=n[1]*i+n[5]*r+n[9]*a,this.z=n[2]*i+n[6]*r+n[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=ht(this.x,t.x,i.x),this.y=ht(this.y,t.y,i.y),this.z=ht(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=ht(this.x,t,i),this.y=ht(this.y,t,i),this.z=ht(this.z,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(ht(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){let r=t.x,a=t.y,n=t.z,s=i.x,o=i.y,l=i.z;return this.x=a*l-n*o,this.y=n*s-r*l,this.z=r*o-a*s,this}projectOnVector(t){let i=t.lengthSq();if(i===0)return this.set(0,0,0);let r=t.dot(this)/i;return this.copy(t).multiplyScalar(r)}projectOnPlane(t){return Pl.copy(this).projectOnVector(t),this.sub(Pl)}reflect(t){return this.sub(Pl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(ht(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y,a=this.z-t.z;return i*i+r*r+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,r){let a=Math.sin(i)*t;return this.x=a*Math.sin(r),this.y=Math.cos(i)*t,this.z=a*Math.cos(r),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,r){return this.x=t*Math.sin(i),this.y=r,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){let i=this.setFromMatrixColumn(t,0).length(),r=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=r,this.z=a,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(t),this.y=i,this.z=r*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Kd.prototype.isVector3=!0;var R=Kd,Pl=new R,Lc=new Bt,$d=class{constructor(t,i,r,a,n,s,o,l,h){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h)}set(t,i,r,a,n,s,o,l,h){let c=this.elements;return c[0]=t,c[1]=a,c[2]=o,c[3]=i,c[4]=n,c[5]=l,c[6]=r,c[7]=s,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(t,i,r){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[3],l=r[6],h=r[1],c=r[4],u=r[7],p=r[2],d=r[5],g=r[8],y=a[0],v=a[3],m=a[6],f=a[1],S=a[4],x=a[7],A=a[2],b=a[5],_=a[8];return n[0]=s*y+o*f+l*A,n[3]=s*v+o*S+l*b,n[6]=s*m+o*x+l*_,n[1]=h*y+c*f+u*A,n[4]=h*v+c*S+u*b,n[7]=h*m+c*x+u*_,n[2]=p*y+d*f+g*A,n[5]=p*v+d*S+g*b,n[8]=p*m+d*x+g*_,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return i*s*c-i*o*h-r*n*c+r*o*l+a*n*h-a*s*l}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=c*s-o*h,p=o*l-c*n,d=h*n-s*l,g=i*u+r*p+a*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return t[0]=u*y,t[1]=(a*h-c*r)*y,t[2]=(o*r-a*s)*y,t[3]=p*y,t[4]=(c*i-a*l)*y,t[5]=(a*n-o*i)*y,t[6]=d*y,t[7]=(r*l-h*i)*y,t[8]=(s*i-r*n)*y,this}transpose(){let t,i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,r,a,n,s,o){let l=Math.cos(n),h=Math.sin(n);return this.set(r*l,r*h,-r*(l*s+h*o)+s+t,-a*h,a*l,-a*(-h*s+l*o)+o+i,0,0,1),this}scale(t,i){return gr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Il.makeScale(t,i)),this}rotate(t){return gr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Il.makeRotation(-t)),this}translate(t,i){return gr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Il.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<9;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<9;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t}clone(){return new this.constructor().fromArray(this.elements)}};$d.prototype.isMatrix3=!0;var ut=$d,Il=new ut,Dc=new ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uc=new ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gg(){let e={enabled:!0,workingColorSpace:kn,spaces:{},convert:function(a,n,s){return this.enabled===!1||n===s||!n||!s||(this.spaces[n].transfer===bt&&(a.r=vr(a.r),a.g=vr(a.g),a.b=vr(a.b)),this.spaces[n].primaries!==this.spaces[s].primaries&&(a.applyMatrix3(this.spaces[n].toXYZ),a.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===bt&&(a.r=ja(a.r),a.g=ja(a.g),a.b=ja(a.b))),a},workingToColorSpace:function(a,n){return this.convert(a,this.workingColorSpace,n)},colorSpaceToWorking:function(a,n){return this.convert(a,n,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===dr?Gn:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,n=this.workingColorSpace){return a.fromArray(this.spaces[n].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,n,s){return a.copy(this.spaces[s].fromXYZ).multiply(this.spaces[n].toXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[kn]:{primaries:t,whitePoint:r,transfer:Gn,toXYZ:Dc,fromXYZ:Uc,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:t,whitePoint:r,transfer:bt,toXYZ:Dc,fromXYZ:Uc,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),e}var yt=Gg();function vr(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function ja(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var ya,Qd=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ya===void 0&&(ya=Vn("canvas")),ya.width=e.width,ya.height=e.height;let r=ya.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ya}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Vn("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let n=0;n<a.length;n++)a[n]=vr(a[n]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(vr(t[i]/255)*255):t[i]=vr(t[i]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Vg=0,tr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Vg++}),this.uuid=Oi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let n=0,s=r.length;n<s;n++)r[n].isDataTexture?a.push(Ll(r[n].image)):a.push(Ll(r[n]))}else a=Ll(r);i.url=a}return t||(e.images[this.uuid]=i),i}};function Ll(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Qd.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}var Wg=class extends tr{constructor(e=null){gr('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(e),this.isSource=!0}},Xg=0,Dl=new R,Yt=class no extends Zi{constructor(t=no.DEFAULT_IMAGE,i=no.DEFAULT_MAPPING,r=Kt,a=Kt,n=Nt,s=ji,o=bi,l=Mi,h=no.DEFAULT_ANISOTROPY,c=dr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=Oi(),this.name="",this.source=new tr(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ut,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Dl).x}get height(){return this.source.getSize(Dl).y}get depth(){return this.source.getSize(Dl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let i in t){let r=t[i];if(r===void 0){Le(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}let a=this[i];if(a===void 0){Le(`Texture.setValues(): property '${i}' does not exist.`);continue}a&&r&&a.isVector2&&r.isVector2||a&&r&&a.isVector3&&r.isVector3||a&&r&&a.isMatrix3&&r.isMatrix3?a.copy(r):this[i]=r}}toJSON(t){let i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(t.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$o)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lr:t.x=t.x-Math.floor(t.x);break;case Kt:t.x=t.x<0?0:1;break;case On:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lr:t.y=t.y-Math.floor(t.y);break;case Kt:t.y=t.y<0?0:1;break;case On:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=$o;Yt.DEFAULT_ANISOTROPY=1;var ep=class{constructor(t=0,i=0,r=0,a=1){this.x=t,this.y=i,this.z=r,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,r,a){return this.x=t,this.y=i,this.z=r,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=this.w,s=t.elements;return this.x=s[0]*i+s[4]*r+s[8]*a+s[12]*n,this.y=s[1]*i+s[5]*r+s[9]*a+s[13]*n,this.z=s[2]*i+s[6]*r+s[10]*a+s[14]*n,this.w=s[3]*i+s[7]*r+s[11]*a+s[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,r,a,n,s=t.elements,o=s[0],l=s[4],h=s[8],c=s[1],u=s[5],p=s[9],d=s[2],g=s[6],y=s[10];if(Math.abs(l-c)<.01&&Math.abs(h-d)<.01&&Math.abs(p-g)<.01){if(Math.abs(l+c)<.1&&Math.abs(h+d)<.1&&Math.abs(p+g)<.1&&Math.abs(o+u+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;let m=(o+1)/2,f=(u+1)/2,S=(y+1)/2,x=(l+c)/4,A=(h+d)/4,b=(p+g)/4;return m>f&&m>S?m<.01?(r=0,a=.707106781,n=.707106781):(r=Math.sqrt(m),a=x/r,n=A/r):f>S?f<.01?(r=.707106781,a=0,n=.707106781):(a=Math.sqrt(f),r=x/a,n=b/a):S<.01?(r=.707106781,a=.707106781,n=0):(n=Math.sqrt(S),r=A/n,a=b/n),this.set(r,a,n,i),this}let v=Math.sqrt((g-p)*(g-p)+(h-d)*(h-d)+(c-l)*(c-l));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(h-d)/v,this.z=(c-l)/v,this.w=Math.acos((o+u+y-1)/2),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=ht(this.x,t.x,i.x),this.y=ht(this.y,t.y,i.y),this.z=ht(this.z,t.z,i.z),this.w=ht(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=ht(this.x,t,i),this.y=ht(this.y,t,i),this.z=ht(this.z,t,i),this.w=ht(this.w,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(ht(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this.w=t.w+(i.w-t.w)*r,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ep.prototype.isVector4=!0;var Ct=ep,Jh=class extends Zi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];let r=i.count;for(let a=0;a<r;a++)this.textures[a]=new Yt({width:e,height:t,depth:i.depth}),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new tr(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Pi=class extends Jh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ll=class extends Yt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},jg=class extends Pi{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new ll(null,e,t,i),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},hl=class extends Yt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},qg=class extends Pi{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isWebGL3DRenderTarget=!0,this.depth=i,this.texture=new hl(null,e,t,i),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},tp=class ip{constructor(t,i,r,a,n,s,o,l,h,c,u,p,d,g,y,v){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h,c,u,p,d,g,y,v)}set(t,i,r,a,n,s,o,l,h,c,u,p,d,g,y,v){let m=this.elements;return m[0]=t,m[4]=i,m[8]=r,m[12]=a,m[1]=n,m[5]=s,m[9]=o,m[13]=l,m[2]=h,m[6]=c,m[10]=u,m[14]=p,m[3]=d,m[7]=g,m[11]=y,m[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ip().fromArray(this.elements)}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(t){let i=this.elements,r=t.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(t){let i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,r){return this.determinantAffine()===0?(t.set(1,0,0),i.set(0,1,0),r.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(t,i,r){return this.set(t.x,i.x,r.x,0,t.y,i.y,r.y,0,t.z,i.z,r.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let i=this.elements,r=t.elements,a=1/xa.setFromMatrixColumn(t,0).length(),n=1/xa.setFromMatrixColumn(t,1).length(),s=1/xa.setFromMatrixColumn(t,2).length();return i[0]=r[0]*a,i[1]=r[1]*a,i[2]=r[2]*a,i[3]=0,i[4]=r[4]*n,i[5]=r[5]*n,i[6]=r[6]*n,i[7]=0,i[8]=r[8]*s,i[9]=r[9]*s,i[10]=r[10]*s,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){let i=this.elements,r=t.x,a=t.y,n=t.z,s=Math.cos(r),o=Math.sin(r),l=Math.cos(a),h=Math.sin(a),c=Math.cos(n),u=Math.sin(n);if(t.order==="XYZ"){let p=s*c,d=s*u,g=o*c,y=o*u;i[0]=l*c,i[4]=-l*u,i[8]=h,i[1]=d+g*h,i[5]=p-y*h,i[9]=-o*l,i[2]=y-p*h,i[6]=g+d*h,i[10]=s*l}else if(t.order==="YXZ"){let p=l*c,d=l*u,g=h*c,y=h*u;i[0]=p+y*o,i[4]=g*o-d,i[8]=s*h,i[1]=s*u,i[5]=s*c,i[9]=-o,i[2]=d*o-g,i[6]=y+p*o,i[10]=s*l}else if(t.order==="ZXY"){let p=l*c,d=l*u,g=h*c,y=h*u;i[0]=p-y*o,i[4]=-s*u,i[8]=g+d*o,i[1]=d+g*o,i[5]=s*c,i[9]=y-p*o,i[2]=-s*h,i[6]=o,i[10]=s*l}else if(t.order==="ZYX"){let p=s*c,d=s*u,g=o*c,y=o*u;i[0]=l*c,i[4]=g*h-d,i[8]=p*h+y,i[1]=l*u,i[5]=y*h+p,i[9]=d*h-g,i[2]=-h,i[6]=o*l,i[10]=s*l}else if(t.order==="YZX"){let p=s*l,d=s*h,g=o*l,y=o*h;i[0]=l*c,i[4]=y-p*u,i[8]=g*u+d,i[1]=u,i[5]=s*c,i[9]=-o*c,i[2]=-h*c,i[6]=d*u+g,i[10]=p-y*u}else if(t.order==="XZY"){let p=s*l,d=s*h,g=o*l,y=o*h;i[0]=l*c,i[4]=-u,i[8]=h*c,i[1]=p*u+y,i[5]=s*c,i[9]=d*u-g,i[2]=g*u-d,i[6]=o*c,i[10]=y*u+p}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yg,t,Zg)}lookAt(t,i,r){let a=this.elements;return Ti.subVectors(t,i),Ti.lengthSq()===0&&(Ti.z=1),Ti.normalize(),Er.crossVectors(r,Ti),Er.lengthSq()===0&&(Math.abs(r.z)===1?Ti.x+=1e-4:Ti.z+=1e-4,Ti.normalize(),Er.crossVectors(r,Ti)),Er.normalize(),ds.crossVectors(Ti,Er),a[0]=Er.x,a[4]=ds.x,a[8]=Ti.x,a[1]=Er.y,a[5]=ds.y,a[9]=Ti.y,a[2]=Er.z,a[6]=ds.z,a[10]=Ti.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[4],l=r[8],h=r[12],c=r[1],u=r[5],p=r[9],d=r[13],g=r[2],y=r[6],v=r[10],m=r[14],f=r[3],S=r[7],x=r[11],A=r[15],b=a[0],_=a[4],M=a[8],E=a[12],P=a[1],I=a[5],L=a[9],Y=a[13],D=a[2],B=a[6],Z=a[10],V=a[14],pe=a[3],z=a[7],W=a[11],Q=a[15];return n[0]=s*b+o*P+l*D+h*pe,n[4]=s*_+o*I+l*B+h*z,n[8]=s*M+o*L+l*Z+h*W,n[12]=s*E+o*Y+l*V+h*Q,n[1]=c*b+u*P+p*D+d*pe,n[5]=c*_+u*I+p*B+d*z,n[9]=c*M+u*L+p*Z+d*W,n[13]=c*E+u*Y+p*V+d*Q,n[2]=g*b+y*P+v*D+m*pe,n[6]=g*_+y*I+v*B+m*z,n[10]=g*M+y*L+v*Z+m*W,n[14]=g*E+y*Y+v*V+m*Q,n[3]=f*b+S*P+x*D+A*pe,n[7]=f*_+S*I+x*B+A*z,n[11]=f*M+S*L+x*Z+A*W,n[15]=f*E+S*Y+x*V+A*Q,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[12],s=t[1],o=t[5],l=t[9],h=t[13],c=t[2],u=t[6],p=t[10],d=t[14],g=t[3],y=t[7],v=t[11],m=t[15],f=l*d-h*p,S=o*d-h*u,x=o*p-l*u,A=s*d-h*c,b=s*p-l*c,_=s*u-o*c;return i*(y*f-v*S+m*x)-r*(g*f-v*A+m*b)+a*(g*S-y*A+m*_)-n*(g*x-y*b+v*_)}determinantAffine(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10];return i*(s*c-o*h)-r*(n*c-o*l)+a*(n*h-s*l)}transpose(){let t=this.elements,i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,r){let a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=i,a[14]=r),this}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=t[9],p=t[10],d=t[11],g=t[12],y=t[13],v=t[14],m=t[15],f=i*o-r*s,S=i*l-a*s,x=i*h-n*s,A=r*l-a*o,b=r*h-n*o,_=a*h-n*l,M=c*y-u*g,E=c*v-p*g,P=c*m-d*g,I=u*v-p*y,L=u*m-d*y,Y=p*m-d*v,D=f*Y-S*L+x*I+A*P-b*E+_*M;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/D;return t[0]=(o*Y-l*L+h*I)*B,t[1]=(a*L-r*Y-n*I)*B,t[2]=(y*_-v*b+m*A)*B,t[3]=(p*b-u*_-d*A)*B,t[4]=(l*P-s*Y-h*E)*B,t[5]=(i*Y-a*P+n*E)*B,t[6]=(v*x-g*_-m*S)*B,t[7]=(c*_-p*x+d*S)*B,t[8]=(s*L-o*P+h*M)*B,t[9]=(r*P-i*L-n*M)*B,t[10]=(g*b-y*x+m*f)*B,t[11]=(u*x-c*b-d*f)*B,t[12]=(o*E-s*I-l*M)*B,t[13]=(i*I-r*E+a*M)*B,t[14]=(y*S-g*A-v*f)*B,t[15]=(c*A-u*S+p*f)*B,this}scale(t){let i=this.elements,r=t.x,a=t.y,n=t.z;return i[0]*=r,i[4]*=a,i[8]*=n,i[1]*=r,i[5]*=a,i[9]*=n,i[2]*=r,i[6]*=a,i[10]*=n,i[3]*=r,i[7]*=a,i[11]*=n,this}getMaxScaleOnAxis(){let t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,r,a))}makeTranslation(t,i,r){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(t){let i=Math.cos(t),r=Math.sin(t);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){let r=Math.cos(i),a=Math.sin(i),n=1-r,s=t.x,o=t.y,l=t.z,h=n*s,c=n*o;return this.set(h*s+r,h*o-a*l,h*l+a*o,0,h*o+a*l,c*o+r,c*l-a*s,0,h*l-a*o,c*l+a*s,n*l*l+r,0,0,0,0,1),this}makeScale(t,i,r){return this.set(t,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(t,i,r,a,n,s){return this.set(1,r,n,0,t,1,s,0,i,a,1,0,0,0,0,1),this}compose(t,i,r){let a=this.elements,n=i._x,s=i._y,o=i._z,l=i._w,h=n+n,c=s+s,u=o+o,p=n*h,d=n*c,g=n*u,y=s*c,v=s*u,m=o*u,f=l*h,S=l*c,x=l*u,A=r.x,b=r.y,_=r.z;return a[0]=(1-(y+m))*A,a[1]=(d+x)*A,a[2]=(g-S)*A,a[3]=0,a[4]=(d-x)*b,a[5]=(1-(p+m))*b,a[6]=(v+f)*b,a[7]=0,a[8]=(g+S)*_,a[9]=(v-f)*_,a[10]=(1-(p+y))*_,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,i,r){let a=this.elements;t.x=a[12],t.y=a[13],t.z=a[14];let n=this.determinantAffine();if(n===0)return r.set(1,1,1),i.identity(),this;let s=xa.set(a[0],a[1],a[2]).length(),o=xa.set(a[4],a[5],a[6]).length(),l=xa.set(a[8],a[9],a[10]).length();n<0&&(s=-s),ki.copy(this);let h=1/s,c=1/o,u=1/l;return ki.elements[0]*=h,ki.elements[1]*=h,ki.elements[2]*=h,ki.elements[4]*=c,ki.elements[5]*=c,ki.elements[6]*=c,ki.elements[8]*=u,ki.elements[9]*=u,ki.elements[10]*=u,i.setFromRotationMatrix(ki),r.x=s,r.y=o,r.z=l,this}makePerspective(t,i,r,a,n,s,o=Ci,l=!1){let h=this.elements,c=2*n/(i-t),u=2*n/(r-a),p=(i+t)/(i-t),d=(r+a)/(r-a),g,y;if(l)g=n/(s-n),y=s*n/(s-n);else if(o===Ci)g=-(s+n)/(s-n),y=-2*s*n/(s-n);else if(o===ha)g=-s/(s-n),y=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=p,h[12]=0,h[1]=0,h[5]=u,h[9]=d,h[13]=0,h[2]=0,h[6]=0,h[10]=g,h[14]=y,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,i,r,a,n,s,o=Ci,l=!1){let h=this.elements,c=2/(i-t),u=2/(r-a),p=-(i+t)/(i-t),d=-(r+a)/(r-a),g,y;if(l)g=1/(s-n),y=s/(s-n);else if(o===Ci)g=-2/(s-n),y=-(s+n)/(s-n);else if(o===ha)g=-1/(s-n),y=-n/(s-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=0,h[12]=p,h[1]=0,h[5]=u,h[9]=0,h[13]=d,h[2]=0,h[6]=0,h[10]=g,h[14]=y,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<16;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<16;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t[i+9]=r[9],t[i+10]=r[10],t[i+11]=r[11],t[i+12]=r[12],t[i+13]=r[13],t[i+14]=r[14],t[i+15]=r[15],t}};tp.prototype.isMatrix4=!0;var lt=tp,xa=new R,ki=new lt,Yg=new R(0,0,0),Zg=new R(1,1,1),Er=new R,ds=new R,Ti=new R,Nc=new lt,Oc=new Bt,Yi=class rp{constructor(t=0,i=0,r=0,a=rp.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=r,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,r,a=this._order){return this._x=t,this._y=i,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,r=!0){let a=t.elements,n=a[0],s=a[4],o=a[8],l=a[1],h=a[5],c=a[9],u=a[2],p=a[6],d=a[10];switch(i){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,d),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,n),this._z=0);break;case"ZXY":this._x=Math.asin(ht(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-s,h)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-ht(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,h));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,n)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ht(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-c,d),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,r){return Nc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Nc,i,r)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return Oc.setFromEuler(this),this.setFromQuaternion(Oc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yi.DEFAULT_ORDER="XYZ";var cl=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Jg=0,Fc=new R,Sa=new Bt,sr=new lt,ps=new R,hn=new R,Kg=new R,$g=new Bt,Bc=new R(1,0,0),zc=new R(0,1,0),Hc=new R(0,0,1),kc={type:"added"},Qg={type:"removed"},Ma={type:"childadded",child:null},Ul={type:"childremoved",child:null},Et=class so extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jg++}),this.uuid=Oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=so.DEFAULT_UP.clone();let t=new R,i=new Yi,r=new Bt,a=new R(1,1,1);function n(){r.setFromEuler(i,!1)}function s(){i.setFromQuaternion(r,void 0,!1)}i._onChange(n),r._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new lt},normalMatrix:{value:new ut}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=so.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=so.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return Sa.setFromAxisAngle(t,i),this.quaternion.multiply(Sa),this}rotateOnWorldAxis(t,i){return Sa.setFromAxisAngle(t,i),this.quaternion.premultiply(Sa),this}rotateX(t){return this.rotateOnAxis(Bc,t)}rotateY(t){return this.rotateOnAxis(zc,t)}rotateZ(t){return this.rotateOnAxis(Hc,t)}translateOnAxis(t,i){return Fc.copy(t).applyQuaternion(this.quaternion),this.position.add(Fc.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(Bc,t)}translateY(t){return this.translateOnAxis(zc,t)}translateZ(t){return this.translateOnAxis(Hc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(sr.copy(this.matrixWorld).invert())}lookAt(t,i,r){t.isVector3?ps.copy(t):ps.set(t,i,r);let a=this.parent;this.updateWorldMatrix(!0,!1),hn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?sr.lookAt(hn,ps,this.up):sr.lookAt(ps,hn,this.up),this.quaternion.setFromRotationMatrix(sr),a&&(sr.extractRotation(a.matrixWorld),Sa.setFromRotationMatrix(sr),this.quaternion.premultiply(Sa.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(Qe("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(kc),Ma.child=t,this.dispatchEvent(Ma),Ma.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}let i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(Qg),Ul.child=t,this.dispatchEvent(Ul),Ul.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),sr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),sr.multiply(t.parent.matrixWorld)),t.applyMatrix4(sr),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(kc),Ma.child=t,this.dispatchEvent(Ma),Ma.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let r=0,a=this.children.length;r<a;r++){let n=this.children[r].getObjectByProperty(t,i);if(n!==void 0)return n}}getObjectsByProperty(t,i,r=[]){this[t]===i&&r.push(this);let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(t,i,r);return r}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hn,t,Kg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hn,$g,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverseVisible(t)}traverseAncestors(t){let i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let i=t.x,r=t.y,a=t.z,n=this.matrix.elements;n[12]+=i-n[0]*i-n[4]*r-n[8]*a,n[13]+=r-n[1]*i-n[5]*r-n[9]*a,n[14]+=a-n[2]*i-n[6]*r-n[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateMatrixWorld(t)}updateWorldMatrix(t,i,r=!1){let a=this.parent;if(t===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||r)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,r=!0),i===!0){let n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].updateWorldMatrix(!1,!0,r)}}toJSON(t){let i=t===void 0||typeof t=="string",r={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(o=>({...o})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(t),a.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){let u=l[h];n(t.shapes,u)}else n(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(n(t.materials,this.material[l]));a.material=o}else a.material=n(t.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];a.animations.push(n(t.animations,l))}}if(i){let o=s(t.geometries),l=s(t.materials),h=s(t.textures),c=s(t.images),u=s(t.shapes),p=s(t.skeletons),d=s(t.animations),g=s(t.nodes);o.length>0&&(r.geometries=o),l.length>0&&(r.materials=l),h.length>0&&(r.textures=h),c.length>0&&(r.images=c),u.length>0&&(r.shapes=u),p.length>0&&(r.skeletons=p),d.length>0&&(r.animations=d),g.length>0&&(r.nodes=g)}return r.object=a,r;function s(o){let l=[];for(let h in o){let c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let r=0;r<t.children.length;r++){let a=t.children[r];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Et.DEFAULT_UP=new R(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $t=class extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}},e0={type:"move"},oo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,a=null,n=null,s=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){n=!0;for(let g of e.hand.values()){let y=t.getJointPose(g,i),v=this._getHandJoint(l,g);y!==null&&(v.matrix.fromArray(y.transform.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=y.radius),v.visible=y!==null}let h=l.joints["index-finger-tip"],c=l.joints["thumb-tip"],u=h.position.distanceTo(c.position),p=.02,d=.005;l.inputState.pinching&&u>p+d?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=p-d&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,o.eventsEnabled&&o.dispatchEvent({type:"gripUpdated",data:e,target:this})));s!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(s.matrix.fromArray(r.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,r.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(r.linearVelocity)):s.hasLinearVelocity=!1,r.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(r.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(e0)))}return s!==null&&(s.visible=r!==null),o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new $t;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},ap={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wr={h:0,s:0,l:0},fs={h:0,s:0,l:0};function Nl(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+(t-e)*6*i:i<1/2?t:i<2/3?e+(t-e)*6*(2/3-i):e}var ke=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,yt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=yt.workingColorSpace){return this.r=e,this.g=t,this.b=i,yt.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=yt.workingColorSpace){if(e=Zh(e,1),t=ht(t,0,1),i=ht(i,0,1),t===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+t):i+t-i*t,n=2*i-a;this.r=Nl(n,a,e+1/3),this.g=Nl(n,a,e),this.b=Nl(n,a,e-1/3)}return yt.colorSpaceToWorking(this,r),this}setStyle(e,t=Xt){function i(a){a!==void 0&&parseFloat(a)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,n=r[1],s=r[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(100,parseFloat(a[1]))/100,Math.min(100,parseFloat(a[2]))/100,Math.min(100,parseFloat(a[3]))/100,t);break;case"hsl":case"hsla":if(a=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=r[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(n===6)return this.setHex(parseInt(a,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){let i=ap[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vr(e.r),this.g=vr(e.g),this.b=vr(e.b),this}copyLinearToSRGB(e){return this.r=ja(e.r),this.g=ja(e.g),this.b=ja(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return yt.workingToColorSpace(oi.copy(this),e),Math.round(ht(oi.r*255,0,255))*65536+Math.round(ht(oi.g*255,0,255))*256+Math.round(ht(oi.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=yt.workingColorSpace){yt.workingToColorSpace(oi.copy(this),t);let i=oi.r,r=oi.g,a=oi.b,n=Math.max(i,r,a),s=Math.min(i,r,a),o,l,h=(s+n)/2;if(s===n)o=0,l=0;else{let c=n-s;switch(l=h<=.5?c/(n+s):c/(2-n-s),n){case i:o=(r-a)/c+(r<a?6:0);break;case r:o=(a-i)/c+2;break;case a:o=(i-r)/c+4;break}o/=6}return e.h=o,e.s=l,e.l=h,e}getRGB(e,t=yt.workingColorSpace){return yt.workingToColorSpace(oi.copy(this),t),e.r=oi.r,e.g=oi.g,e.b=oi.b,e}getStyle(e=Xt){yt.workingToColorSpace(oi.copy(this),e);let t=oi.r,i=oi.g,r=oi.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(wr),this.setHSL(wr.h+e,wr.s+t,wr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(wr),e.getHSL(fs);let i=Ln(wr.h,fs.h,t),r=Ln(wr.s,fs.s,t),a=Ln(wr.l,fs.l,t);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*r,this.g=a[1]*t+a[4]*i+a[7]*r,this.b=a[2]*t+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},oi=new ke;ke.NAMES=ap;var np=class sp{constructor(t,i=25e-5){this.isFogExp2=!0,this.name="",this.color=new ke(t),this.density=i}clone(){return new sp(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},op=class lp{constructor(t,i=1,r=1e3){this.isFog=!0,this.name="",this.color=new ke(t),this.near=i,this.far=r}clone(){return new lp(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ul=class extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yi,this.environmentIntensity=1,this.environmentRotation=new Yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Gi=new R,or=new R,Ol=new R,lr=new R,ba=new R,Ea=new R,Gc=new R,Fl=new R,Bl=new R,zl=new R,Hl=new Ct,kl=new Ct,Gl=new Ct,Pr=class za{constructor(t=new R,i=new R,r=new R){this.a=t,this.b=i,this.c=r}static getNormal(t,i,r,a){a.subVectors(r,i),Gi.subVectors(t,i),a.cross(Gi);let n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(t,i,r,a,n){Gi.subVectors(a,i),or.subVectors(r,i),Ol.subVectors(t,i);let s=Gi.dot(Gi),o=Gi.dot(or),l=Gi.dot(Ol),h=or.dot(or),c=or.dot(Ol),u=s*h-o*o;if(u===0)return n.set(0,0,0),null;let p=1/u,d=(h*l-o*c)*p,g=(s*c-o*l)*p;return n.set(1-d-g,g,d)}static containsPoint(t,i,r,a){return this.getBarycoord(t,i,r,a,lr)===null?!1:lr.x>=0&&lr.y>=0&&lr.x+lr.y<=1}static getInterpolation(t,i,r,a,n,s,o,l){return this.getBarycoord(t,i,r,a,lr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,lr.x),l.addScaledVector(s,lr.y),l.addScaledVector(o,lr.z),l)}static getInterpolatedAttribute(t,i,r,a,n,s){return Hl.setScalar(0),kl.setScalar(0),Gl.setScalar(0),Hl.fromBufferAttribute(t,i),kl.fromBufferAttribute(t,r),Gl.fromBufferAttribute(t,a),s.setScalar(0),s.addScaledVector(Hl,n.x),s.addScaledVector(kl,n.y),s.addScaledVector(Gl,n.z),s}static isFrontFacing(t,i,r,a){return Gi.subVectors(r,i),or.subVectors(t,i),Gi.cross(or).dot(a)<0}set(t,i,r){return this.a.copy(t),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(t,i,r,a){return this.a.copy(t[i]),this.b.copy(t[r]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,i,r,a){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,r),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gi.subVectors(this.c,this.b),or.subVectors(this.a,this.b),Gi.cross(or).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return za.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return za.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,r,a,n){return za.getInterpolation(t,this.a,this.b,this.c,i,r,a,n)}containsPoint(t){return za.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return za.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){let r=this.a,a=this.b,n=this.c,s,o;ba.subVectors(a,r),Ea.subVectors(n,r),Fl.subVectors(t,r);let l=ba.dot(Fl),h=Ea.dot(Fl);if(l<=0&&h<=0)return i.copy(r);Bl.subVectors(t,a);let c=ba.dot(Bl),u=Ea.dot(Bl);if(c>=0&&u<=c)return i.copy(a);let p=l*u-c*h;if(p<=0&&l>=0&&c<=0&&l-c>0)return s=l/(l-c),i.copy(r).addScaledVector(ba,s);zl.subVectors(t,n);let d=ba.dot(zl),g=Ea.dot(zl);if(g>=0&&d<=g)return i.copy(n);let y=d*h-l*g;if(y<=0&&h>=0&&g<=0)return o=h/(h-g),i.copy(r).addScaledVector(Ea,o);let v=c*g-d*u;if(v<=0&&u-c>=0&&d-g>=0)return Gc.subVectors(n,a),o=(u-c)/(u-c+(d-g)),i.copy(a).addScaledVector(Gc,o);let m=1/(v+y+p);return s=y*m,o=p*m,i.copy(r).addScaledVector(ba,s).addScaledVector(Ea,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ci=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Vi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Vi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Vi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let n=0,s=a.count;n<s;n++)e.isMesh===!0?e.getVertexPosition(n,Vi):Vi.fromBufferAttribute(a,n),Vi.applyMatrix4(e.matrixWorld),this.expandByPoint(Vi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ms.copy(i.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}let r=e.children;for(let a=0,n=r.length;a<n;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Vi),Vi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cn),gs.subVectors(this.max,cn),wa.subVectors(e.a,cn),Ta.subVectors(e.b,cn),Aa.subVectors(e.c,cn),Tr.subVectors(Ta,wa),Ar.subVectors(Aa,Ta),Wr.subVectors(wa,Aa);let t=[0,-Tr.z,Tr.y,0,-Ar.z,Ar.y,0,-Wr.z,Wr.y,Tr.z,0,-Tr.x,Ar.z,0,-Ar.x,Wr.z,0,-Wr.x,-Tr.y,Tr.x,0,-Ar.y,Ar.x,0,-Wr.y,Wr.x,0];return!Vl(t,wa,Ta,Aa,gs)||(t=[1,0,0,0,1,0,0,0,1],!Vl(t,wa,Ta,Aa,gs))?!1:(vs.crossVectors(Tr,Ar),t=[vs.x,vs.y,vs.z],Vl(t,wa,Ta,Aa,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Vi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Vi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},hr=[new R,new R,new R,new R,new R,new R,new R,new R],Vi=new R,ms=new ci,wa=new R,Ta=new R,Aa=new R,Tr=new R,Ar=new R,Wr=new R,cn=new R,gs=new R,vs=new R,Xr=new R;function Vl(e,t,i,r,a){for(let n=0,s=e.length-3;n<=s;n+=3){Xr.fromArray(e,n);let o=a.x*Math.abs(Xr.x)+a.y*Math.abs(Xr.y)+a.z*Math.abs(Xr.z),l=t.dot(Xr),h=i.dot(Xr),c=r.dot(Xr);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}var pr=t0();function t0(){let e=new ArrayBuffer(4),t=new Float32Array(e),i=new Uint32Array(e),r=new Uint32Array(512),a=new Uint32Array(512);for(let l=0;l<256;++l){let h=l-127;h<-27?(r[l]=0,r[l|256]=32768,a[l]=24,a[l|256]=24):h<-14?(r[l]=1024>>-h-14,r[l|256]=1024>>-h-14|32768,a[l]=-h-1,a[l|256]=-h-1):h<=15?(r[l]=h+15<<10,r[l|256]=h+15<<10|32768,a[l]=13,a[l|256]=13):h<128?(r[l]=31744,r[l|256]=64512,a[l]=24,a[l|256]=24):(r[l]=31744,r[l|256]=64512,a[l]=13,a[l|256]=13)}let n=new Uint32Array(2048),s=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let h=l<<13,c=0;for(;(h&8388608)===0;)h<<=1,c-=8388608;h&=-8388609,c+=947912704,n[l]=h|c}for(let l=1024;l<2048;++l)n[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)s[l]=l<<23;s[31]=1199570944,s[32]=2147483648;for(let l=33;l<63;++l)s[l]=2147483648+(l-32<<23);s[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:i,baseTable:r,shiftTable:a,mantissaTable:n,exponentTable:s,offsetTable:o}}function Si(e){Math.abs(e)>65504&&Le("DataUtils.toHalfFloat(): Value out of range."),e=ht(e,-65504,65504),pr.floatView[0]=e;let t=pr.uint32View[0],i=t>>23&511;return pr.baseTable[i]+((t&8388607)>>pr.shiftTable[i])}function Sn(e){let t=e>>10;return pr.uint32View[0]=pr.mantissaTable[pr.offsetTable[t]+(e&1023)]+pr.exponentTable[t],pr.floatView[0]}var i0=class{static toHalfFloat(e){return Si(e)}static fromHalfFloat(e){return Sn(e)}},Wt=new R,_s=new se,r0=0,Dt=class extends Zi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:r0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=sl,this.updateRanges=[],this.gpuType=mi,this.version=0,this._normalizationScale=e!==void 0?ol(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)_s.fromBufferAttribute(this,t),_s.applyMatrix3(e),this.setXY(t,_s.x,_s.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix3(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix4(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Wt.fromBufferAttribute(this,t),Wt.applyNormalMatrix(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Wt.fromBufferAttribute(this,t),Wt.transformDirection(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),a=this._normalize(a)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):aa(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):hi(e,this.array)}},a0=class extends Dt{constructor(e,t,i){super(new Int8Array(e),t,i)}},n0=class extends Dt{constructor(e,t,i){super(new Uint8Array(e),t,i)}},s0=class extends Dt{constructor(e,t,i){super(new Uint8ClampedArray(e),t,i)}},o0=class extends Dt{constructor(e,t,i){super(new Int16Array(e),t,i)}},Kh=class extends Dt{constructor(e,t,i){super(new Uint16Array(e),t,i)}},l0=class extends Dt{constructor(e,t,i){super(new Int32Array(e),t,i)}},$h=class extends Dt{constructor(e,t,i){super(new Uint32Array(e),t,i)}},h0=class extends Dt{constructor(e,t,i){super(new Uint16Array(e),t,i),this.isFloat16BufferAttribute=!0}getX(e){let t=Sn(this.array[e*this.itemSize]);return this.normalized&&(t=aa(t,this.array)),t}setX(e,t){return this.normalized&&(t=hi(t,this.array)),this.array[e*this.itemSize]=Si(t),this}getY(e){let t=Sn(this.array[e*this.itemSize+1]);return this.normalized&&(t=aa(t,this.array)),t}setY(e,t){return this.normalized&&(t=hi(t,this.array)),this.array[e*this.itemSize+1]=Si(t),this}getZ(e){let t=Sn(this.array[e*this.itemSize+2]);return this.normalized&&(t=aa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=hi(t,this.array)),this.array[e*this.itemSize+2]=Si(t),this}getW(e){let t=Sn(this.array[e*this.itemSize+3]);return this.normalized&&(t=aa(t,this.array)),t}setW(e,t){return this.normalized&&(t=hi(t,this.array)),this.array[e*this.itemSize+3]=Si(t),this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=hi(t,this.array),i=hi(i,this.array)),this.array[e+0]=Si(t),this.array[e+1]=Si(i),this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=hi(t,this.array),i=hi(i,this.array),r=hi(r,this.array)),this.array[e+0]=Si(t),this.array[e+1]=Si(i),this.array[e+2]=Si(r),this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=hi(t,this.array),i=hi(i,this.array),r=hi(r,this.array),a=hi(a,this.array)),this.array[e+0]=Si(t),this.array[e+1]=Si(i),this.array[e+2]=Si(r),this.array[e+3]=Si(a),this}},qe=class extends Dt{constructor(e,t,i){super(new Float32Array(e),t,i)}},c0=new ci,un=new R,Wl=new R,ti=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):c0.setFromPoints(e).getCenter(i);let r=0;for(let a=0,n=e.length;a<n;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;un.subVectors(e,this.center);let t=un.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(un,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(un.copy(e.center).add(Wl)),this.expandByPoint(un.copy(e.center).sub(Wl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},u0=0,Li=new lt,Xl=new Et,Ra=new R,Ai=new ci,dn=new ci,Zt=new R,dt=class hp extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=Oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(xg(t)?$h:Kh)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,r=0){this.groups.push({start:t,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){let i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);let r=this.attributes.normal;if(r!==void 0){let n=new ut().getNormalMatrix(t);r.applyNormalMatrix(n),r.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Li.makeRotationFromQuaternion(t),this.applyMatrix4(Li),this}rotateX(t){return Li.makeRotationX(t),this.applyMatrix4(Li),this}rotateY(t){return Li.makeRotationY(t),this.applyMatrix4(Li),this}rotateZ(t){return Li.makeRotationZ(t),this.applyMatrix4(Li),this}translate(t,i,r){return Li.makeTranslation(t,i,r),this.applyMatrix4(Li),this}scale(t,i,r){return Li.makeScale(t,i,r),this.applyMatrix4(Li),this}lookAt(t){return Xl.lookAt(t),Xl.updateMatrix(),this.applyMatrix4(Xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ra).negate(),this.translate(Ra.x,Ra.y,Ra.z),this}setFromPoints(t){let i=this.getAttribute("position");if(i===void 0){let r=[];for(let a=0,n=t.length;a<n;a++){let s=t[a];r.push(s.x,s.y,s.z||0)}this.setAttribute("position",new qe(r,3))}else{let r=Math.min(t.length,i.count);for(let a=0;a<r;a++){let n=t[a];i.setXYZ(a,n.x,n.y,n.z||0)}t.length>i.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let r=0,a=i.length;r<a;r++){let n=i[r];Ai.setFromBufferAttribute(n),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,Ai.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,Ai.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(Ai.min),this.boundingBox.expandByPoint(Ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let r=this.boundingSphere.center;if(Ai.setFromBufferAttribute(t),i)for(let n=0,s=i.length;n<s;n++){let o=i[n];dn.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(Ai.min,dn.min),Ai.expandByPoint(Zt),Zt.addVectors(Ai.max,dn.max),Ai.expandByPoint(Zt)):(Ai.expandByPoint(dn.min),Ai.expandByPoint(dn.max))}Ai.getCenter(r);let a=0;for(let n=0,s=t.count;n<s;n++)Zt.fromBufferAttribute(t,n),a=Math.max(a,r.distanceToSquared(Zt));if(i)for(let n=0,s=i.length;n<s;n++){let o=i[n],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Zt.fromBufferAttribute(o,h),l&&(Ra.fromBufferAttribute(t,h),Zt.add(Ra)),a=Math.max(a,r.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let r=i.position,a=i.normal,n=i.uv,s=this.getAttribute("tangent");(s===void 0||s.count!==r.count)&&(s=new Dt(new Float32Array(4*r.count),4),this.setAttribute("tangent",s));let o=[],l=[],h=new Uint8Array(r.count);for(let E=0;E<r.count;E++)o[E]=new R,l[E]=new R;let c=new R,u=new R,p=new R,d=new se,g=new se,y=new se,v=new R,m=new R;function f(E,P,I){h[E]=h[P]=h[I]=1,c.fromBufferAttribute(r,E),u.fromBufferAttribute(r,P),p.fromBufferAttribute(r,I),d.fromBufferAttribute(n,E),g.fromBufferAttribute(n,P),y.fromBufferAttribute(n,I),u.sub(c),p.sub(c),g.sub(d),y.sub(d);let L=1/(g.x*y.y-y.x*g.y);isFinite(L)&&(v.copy(u).multiplyScalar(y.y).addScaledVector(p,-g.y).multiplyScalar(L),m.copy(p).multiplyScalar(g.x).addScaledVector(u,-y.x).multiplyScalar(L),o[E].add(v),o[P].add(v),o[I].add(v),l[E].add(m),l[P].add(m),l[I].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let E=0,P=S.length;E<P;++E){let I=S[E],L=I.start,Y=I.count;for(let D=L,B=L+Y;D<B;D+=3)f(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let x=new R,A=new R,b=new R,_=new R;function M(E){b.fromBufferAttribute(a,E),_.copy(b);let P=o[E];x.copy(P),x.sub(b.multiplyScalar(b.dot(P))).normalize(),A.crossVectors(_,P);let I=A.dot(l[E])<0?-1:1;s.setXYZW(E,x.x,x.y,x.z,I)}for(let E=0,P=r.count;E<P;++E)h[E]&&M(E);this._transformed=!0}computeVertexNormals(){let t=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0||r.count!==i.count)r=new Dt(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let p=0,d=r.count;p<d;p++)r.setXYZ(p,0,0,0);let a=new R,n=new R,s=new R,o=new R,l=new R,h=new R,c=new R,u=new R;if(t)for(let p=0,d=t.count;p<d;p+=3){let g=t.getX(p+0),y=t.getX(p+1),v=t.getX(p+2);a.fromBufferAttribute(i,g),n.fromBufferAttribute(i,y),s.fromBufferAttribute(i,v),c.subVectors(s,n),u.subVectors(a,n),c.cross(u),o.fromBufferAttribute(r,g),l.fromBufferAttribute(r,y),h.fromBufferAttribute(r,v),o.add(c),l.add(c),h.add(c),r.setXYZ(g,o.x,o.y,o.z),r.setXYZ(y,l.x,l.y,l.z),r.setXYZ(v,h.x,h.y,h.z)}else for(let p=0,d=i.count;p<d;p+=3)a.fromBufferAttribute(i,p+0),n.fromBufferAttribute(i,p+1),s.fromBufferAttribute(i,p+2),c.subVectors(s,n),u.subVectors(a,n),c.cross(u),r.setXYZ(p+0,c.x,c.y,c.z),r.setXYZ(p+1,c.x,c.y,c.z),r.setXYZ(p+2,c.x,c.y,c.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let i=0,r=t.count;i<r;i++)Zt.fromBufferAttribute(t,i),Zt.normalize(),t.setXYZ(i,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function t(o,l){let h=o.array,c=o.itemSize,u=o.normalized,p=new h.constructor(l.length*c),d=0,g=0;for(let y=0,v=l.length;y<v;y++){o.isInterleavedBufferAttribute?d=l[y]*o.data.stride+o.offset:d=l[y]*c;for(let m=0;m<c;m++)p[g++]=h[d++]}return new Dt(p,c,u)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let i=new hp,r=this.index.array,a=this.attributes;for(let o in a){let l=a[o],h=t(l,r);i.setAttribute(o,h)}let n=this.morphAttributes;for(let o in n){let l=[],h=n[o];for(let c=0,u=h.length;c<u;c++){let p=h[c],d=t(p,r);l.push(d)}i.morphAttributes[o]=l}i.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let o=0,l=s.length;o<l;o++){let h=s[o];i.addGroup(h.start,h.count,h.materialIndex)}return i}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});let r=this.attributes;for(let l in r){let h=r[l];t.data.attributes[l]=h.toJSON(t.data)}let a={},n=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],c=[];for(let u=0,p=h.length;u<p;u++){let d=h[u];c.push(d.toJSON(t.data))}c.length>0&&(a[l]=c,n=!0)}n&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let i={};this.name=t.name;let r=t.index;r!==null&&this.setIndex(r.clone());let a=t.attributes;for(let h in a){let c=a[h];this.setAttribute(h,c.clone(i))}let n=t.morphAttributes;for(let h in n){let c=[],u=n[h];for(let p=0,d=u.length;p<d;p++)c.push(u[p].clone(i));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;let s=t.groups;for(let h=0,c=s.length;h<c;h++){let u=s[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},dl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=sl,this.updateRanges=[],this.version=0,this.uuid=Oi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,a=this.stride;r<a;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Vc(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Vc(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function Vc(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=Oi()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+":"+e.byteOffset+":"+e.byteLength}var pi=new R,Xn=class cp{constructor(t,i,r,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=i,this.offset=r,this.normalized=a,this._normalizationScale=t!==void 0?ol(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let i=0,r=this.data.count;i<r;i++)pi.fromBufferAttribute(this,i),pi.applyMatrix4(t),this.setXYZ(i,pi.x,pi.y,pi.z);return this}applyNormalMatrix(t){for(let i=0,r=this.count;i<r;i++)pi.fromBufferAttribute(this,i),pi.applyNormalMatrix(t),this.setXYZ(i,pi.x,pi.y,pi.z);return this}transformDirection(t){for(let i=0,r=this.count;i<r;i++)pi.fromBufferAttribute(this,i),pi.transformDirection(t),this.setXYZ(i,pi.x,pi.y,pi.z);return this}getComponent(t,i){let r=this.array[t*this.data.stride+this.offset+i];return this.normalized&&(r=this._denormalize(r)),r}setComponent(t,i,r){return this.normalized&&(r=this._normalize(r)),this.data.array[t*this.data.stride+this.offset+i]=r,this}setX(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset]=i,this}setY(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+1]=i,this}setZ(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+2]=i,this}setW(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+3]=i,this}getX(t){let i=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(i=this._denormalize(i)),i}getY(t){let i=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(i=this._denormalize(i)),i}getZ(t){let i=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(i=this._denormalize(i)),i}getW(t){let i=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(i=this._denormalize(i)),i}setXY(t,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r)),this.data.array[t+0]=i,this.data.array[t+1]=r,this}setXYZ(t,i,r,a){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r),a=this._normalize(a)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this}setXYZW(t,i,r,a,n){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r),a=this._normalize(a),n=this._normalize(n)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this.data.array[t+3]=n,this}clone(t){if(t===void 0){Wn("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return new Dt(new this.array.constructor(i),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new cp(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Wn("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:i,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){let i=this._normalizationScale;return i!==void 0?Math.max(t/i,-1):aa(t,this.data.array)}_normalize(t){let i=this._normalizationScale;return i!==void 0?Math.round(t*i):hi(t,this.data.array)}},jl=new R,d0=new R,p0=new ut,Ri=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=jl.subVectors(i,t).cross(d0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(jl),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let n=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(n<0||n>1)?null:t.copy(e.start).addScaledVector(r,n)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||p0.getNormalMatrix(e),r=this.coplanarPoint(jl).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},f0=0,ii=class extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:f0++}),this.uuid=Oi(),this.name="",this.type="Material",this.blending=Xa,this.side=Ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ph,this.blendDst=Ih,this.blendEquation=ta,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=qa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ao,this.stencilZFail=ao,this.stencilZPass=ao,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){let n=[];for(let s in a){let o=a[s];delete o.metadata,n.push(o)}return n}if(t){let a=r(e.textures),n=r(e.images);a.length>0&&(i.textures=a),n.length>0&&(i.images=n)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Ri().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new se().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new se().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Qh=class extends ii{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ca,pn=new R,Pa=new R,Ia=new R,La=new se,fn=new se,up=new lt,ys=new R,mn=new R,xs=new R,Wc=new se,ql=new se,Xc=new se,dp=class extends Et{constructor(e=new Qh){if(super(),this.isSprite=!0,this.type="Sprite",Ca===void 0){Ca=new dt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new dl(t,5);Ca.setIndex([0,1,2,0,2,3]),Ca.setAttribute("position",new Xn(i,3,0,!1)),Ca.setAttribute("uv",new Xn(i,2,3,!1))}this.geometry=Ca,this.material=e,this.center=new se(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Qe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Pa.setFromMatrixScale(this.matrixWorld),up.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ia.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Pa.multiplyScalar(-Ia.z);let i=this.material.rotation,r,a;i!==0&&(a=Math.cos(i),r=Math.sin(i));let n=this.center;Ss(ys.set(-.5,-.5,0),Ia,n,Pa,r,a),Ss(mn.set(.5,-.5,0),Ia,n,Pa,r,a),Ss(xs.set(.5,.5,0),Ia,n,Pa,r,a),Wc.set(0,0),ql.set(1,0),Xc.set(1,1);let s=e.ray.intersectTriangle(ys,mn,xs,!1,pn);if(s===null&&(Ss(mn.set(-.5,.5,0),Ia,n,Pa,r,a),ql.set(0,1),s=e.ray.intersectTriangle(ys,xs,mn,!1,pn),s===null))return;let o=e.ray.origin.distanceTo(pn);o<e.near||o>e.far||t.push({distance:o,point:pn.clone(),uv:Pr.getInterpolation(pn,ys,mn,xs,Wc,ql,Xc,new se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function Ss(e,t,i,r,a,n){La.subVectors(e,i).addScalar(.5).multiply(r),a!==void 0?(fn.x=n*La.x-a*La.y,fn.y=a*La.x+n*La.y):fn.copy(La),e.copy(t),e.x+=fn.x,e.y+=fn.y,e.applyMatrix4(up)}var Ms=new R,jc=new R,pp=class extends Et{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let i=0,r=t.length;i<r;i++){let a=t[i];this.addLevel(a.object.clone(),a.distance,a.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,i=0){t=Math.abs(t);let r=this.levels,a;for(a=0;a<r.length&&!(t<r[a].distance);a++);return r.splice(a,0,{distance:t,hysteresis:i,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let i=0;i<t.length;i++)if(t[i].distance===e){let r=t.splice(i,1);return this.remove(r[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let i,r;for(i=1,r=t.length;i<r;i++){let a=t[i].distance;if(t[i].object.visible&&(a-=a*t[i].hysteresis),e<a)break}return t[i-1].object}return null}raycast(e,t){if(this.levels.length>0){Ms.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(Ms);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){Ms.setFromMatrixPosition(e.matrixWorld),jc.setFromMatrixPosition(this.matrixWorld);let i=Ms.distanceTo(jc)/e.zoom;t[0].object.visible=!0;let r,a;for(r=1,a=t.length;r<a;r++){let n=t[r].distance;if(t[r].object.visible&&(n-=n*t[r].hysteresis),i>=n)t[r-1].object.visible=!1,t[r].object.visible=!0;else break}for(this._currentLevel=r-1;r<a;r++)t[r].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let i=this.levels;for(let r=0,a=i.length;r<a;r++){let n=i[r];t.object.levels.push({object:n.object.uuid,distance:n.distance,hysteresis:n.hysteresis})}return t}},cr=new R,Yl=new R,bs=new R,Es=new R,Qa=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=cr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(cr.copy(this.origin).addScaledVector(this.direction,t),cr.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Yl.copy(e).add(t).multiplyScalar(.5),bs.copy(t).sub(e).normalize(),Es.copy(this.origin).sub(Yl);let a=e.distanceTo(t)*.5,n=-this.direction.dot(bs),s=Es.dot(this.direction),o=-Es.dot(bs),l=Es.lengthSq(),h=Math.abs(1-n*n),c,u,p,d;if(h>0)if(c=n*o-s,u=n*s-o,d=a*h,c>=0)if(u>=-d)if(u<=d){let g=1/h;c*=g,u*=g,p=c*(c+n*u+2*s)+u*(n*c+u+2*o)+l}else u=a,c=Math.max(0,-(n*u+s)),p=-c*c+u*(u+2*o)+l;else u=-a,c=Math.max(0,-(n*u+s)),p=-c*c+u*(u+2*o)+l;else u<=-d?(c=Math.max(0,-(-n*a+s)),u=c>0?-a:Math.min(Math.max(-a,-o),a),p=-c*c+u*(u+2*o)+l):u<=d?(c=0,u=Math.min(Math.max(-a,-o),a),p=u*(u+2*o)+l):(c=Math.max(0,-(n*a+s)),u=c>0?a:Math.min(Math.max(-a,-o),a),p=-c*c+u*(u+2*o)+l);else u=n>0?-a:a,c=Math.max(0,-(n*u+s)),p=-c*c+u*(u+2*o)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,c),r&&r.copy(Yl).addScaledVector(bs,u),p}intersectSphere(e,t){if(e.radius<0)return null;cr.subVectors(e.center,this.origin);let i=cr.dot(this.direction),r=cr.dot(cr)-i*i,a=e.radius*e.radius;if(r>a)return null;let n=Math.sqrt(a-r),s=i-n,o=i+n;return o<0?null:s<0?this.at(o,t):this.at(s,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,a,n,s,o,l=1/this.direction.x,h=1/this.direction.y,c=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),h>=0?(a=(e.min.y-u.y)*h,n=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,n=(e.min.y-u.y)*h),i>n||a>r||((a>i||isNaN(i))&&(i=a),(n<r||isNaN(r))&&(r=n),c>=0?(s=(e.min.z-u.z)*c,o=(e.max.z-u.z)*c):(s=(e.max.z-u.z)*c,o=(e.min.z-u.z)*c),i>o||s>r)||((s>i||i!==i)&&(i=s),(o<r||r!==r)&&(r=o),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,cr)!==null}intersectTriangle(e,t,i,r,a){let n=this.origin,s=this.direction,o=s.x,l=s.y,h=s.z,c=e.x-n.x,u=e.y-n.y,p=e.z-n.z,d=t.x-n.x,g=t.y-n.y,y=t.z-n.z,v=i.x-n.x,m=i.y-n.y,f=i.z-n.z,S=Math.abs(o),x=Math.abs(l),A=Math.abs(h),b,_,M,E,P,I,L,Y,D,B,Z,V;if(S>=x&&S>=A?(M=o,I=c,D=d,V=v,o>=0?(b=l,_=h,E=u,P=p,L=g,Y=y,B=m,Z=f):(b=h,_=l,E=p,P=u,L=y,Y=g,B=f,Z=m)):x>=A?(M=l,I=u,D=g,V=m,l>=0?(b=h,_=o,E=p,P=c,L=y,Y=d,B=f,Z=v):(b=o,_=h,E=c,P=p,L=d,Y=y,B=v,Z=f)):(M=h,I=p,D=y,V=f,h>=0?(b=o,_=l,E=c,P=u,L=d,Y=g,B=v,Z=m):(b=l,_=o,E=u,P=c,L=g,Y=d,B=m,Z=v)),M===0)return null;let pe=b/M,z=_/M,W=1/M,Q=E-pe*I,ve=P-z*I,$=L-pe*D,he=Y-z*D,Pe=B-pe*V,Ye=Z-z*V,Ve=Pe*he-Ye*$,fe=Q*Ye-ve*Pe,rt=$*ve-he*Q;if(r){if(Ve<0||fe<0||rt<0)return null}else if((Ve<0||fe<0||rt<0)&&(Ve>0||fe>0||rt>0))return null;let pt=Ve+fe+rt;if(pt===0)return null;let Ue=W*(Ve*I+fe*D+rt*V);return(pt>0?Ue<0:Ue>0)?null:this.at(Ue/pt,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vi=class extends ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=$n,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},qc=new lt,jr=new Qa,ws=new ti,Yc=new R,Ts=new R,As=new R,Rs=new R,Zl=new R,Cs=new R,Zc=new R,Ps=new R,it=class extends Et{constructor(e=new dt,t=new vi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,n=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let s=this.morphTargetInfluences;if(a&&s){Cs.set(0,0,0);for(let o=0,l=a.length;o<l;o++){let h=s[o],c=a[o];h!==0&&(Zl.fromBufferAttribute(c,e),n?Cs.addScaledVector(Zl,h):Cs.addScaledVector(Zl.sub(t),h))}t.add(Cs)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ws.copy(i.boundingSphere),ws.applyMatrix4(a),jr.copy(e.ray).recast(e.near),!(ws.containsPoint(jr.origin)===!1&&(jr.intersectSphere(ws,Yc)===null||jr.origin.distanceToSquared(Yc)>(e.far-e.near)**2))&&(qc.copy(a).invert(),jr.copy(e.ray).applyMatrix4(qc),!(i.boundingBox!==null&&jr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,jr)))}_computeIntersections(e,t,i){let r,a=this.geometry,n=this.material,s=a.index,o=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,c=a.attributes.normal,u=a.groups,p=a.drawRange;if(s!==null)if(Array.isArray(n))for(let d=0,g=u.length;d<g;d++){let y=u[d],v=n[y.materialIndex],m=Math.max(y.start,p.start),f=Math.min(s.count,Math.min(y.start+y.count,p.start+p.count));for(let S=m,x=f;S<x;S+=3){let A=s.getX(S),b=s.getX(S+1),_=s.getX(S+2);r=Is(this,v,e,i,l,h,c,A,b,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=y.materialIndex,t.push(r))}}else{let d=Math.max(0,p.start),g=Math.min(s.count,p.start+p.count);for(let y=d,v=g;y<v;y+=3){let m=s.getX(y),f=s.getX(y+1),S=s.getX(y+2);r=Is(this,n,e,i,l,h,c,m,f,S),r&&(r.faceIndex=Math.floor(y/3),t.push(r))}}else if(o!==void 0)if(Array.isArray(n))for(let d=0,g=u.length;d<g;d++){let y=u[d],v=n[y.materialIndex],m=Math.max(y.start,p.start),f=Math.min(o.count,Math.min(y.start+y.count,p.start+p.count));for(let S=m,x=f;S<x;S+=3){let A=S,b=S+1,_=S+2;r=Is(this,v,e,i,l,h,c,A,b,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=y.materialIndex,t.push(r))}}else{let d=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);for(let y=d,v=g;y<v;y+=3){let m=y,f=y+1,S=y+2;r=Is(this,n,e,i,l,h,c,m,f,S),r&&(r.faceIndex=Math.floor(y/3),t.push(r))}}}};function m0(e,t,i,r,a,n,s,o){let l;if(t.side===gi?l=r.intersectTriangle(s,n,a,!0,o):l=r.intersectTriangle(a,n,s,t.side===Ir,o),l===null)return null;Ps.copy(o),Ps.applyMatrix4(e.matrixWorld);let h=i.ray.origin.distanceTo(Ps);return h<i.near||h>i.far?null:{distance:h,point:Ps.clone(),object:e}}function Is(e,t,i,r,a,n,s,o,l,h){e.getVertexPosition(o,Ts),e.getVertexPosition(l,As),e.getVertexPosition(h,Rs);let c=m0(e,t,i,r,Ts,As,Rs,Zc);if(c){let u=new R;Pr.getBarycoord(Zc,Ts,As,Rs,u),a&&(c.uv=Pr.getInterpolatedAttribute(a,o,l,h,u,new se)),n&&(c.uv1=Pr.getInterpolatedAttribute(n,o,l,h,u,new se)),s&&(c.normal=Pr.getInterpolatedAttribute(s,o,l,h,u,new R),c.normal.dot(r.direction)>0&&c.normal.multiplyScalar(-1));let p={a:o,b:l,c:h,normal:new R,materialIndex:0};Pr.getNormal(Ts,As,Rs,p.normal),c.face=p,c.barycoord=u}return c}var gn=new Ct,Jc=new Ct,Kc=new Ct,g0=new Ct,$c=new lt,Ls=new R,Jl=new ti,Qc=new lt,Kl=new Qa,fp=class extends it{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=_h,this.bindMatrix=new lt,this.bindMatrixInverse=new lt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ci),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ls),this.boundingBox.expandByPoint(Ls)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ti),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ls),this.boundingSphere.expandByPoint(Ls)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Jl.copy(this.boundingSphere),Jl.applyMatrix4(r),e.ray.intersectsSphere(Jl)!==!1&&(Qc.copy(r).invert(),Kl.copy(e.ray).applyMatrix4(Qc),!(this.boundingBox!==null&&Kl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Kl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ct,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);let a=1/e.manhattanLength();a!==1/0?e.multiplyScalar(a):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===_h?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ud?this.bindMatrixInverse.copy(this.bindMatrix).invert():Le("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,r=this.geometry;Jc.fromBufferAttribute(r.attributes.skinIndex,e),Kc.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(gn.copy(t),t.set(0,0,0,0)):(gn.set(t.x,t.y,t.z,1),t.set(0,0,0)),gn.applyMatrix4(this.bindMatrix);for(let a=0;a<4;a++){let n=Kc.getComponent(a);if(n!==0){let s=Jc.getComponent(a);$c.multiplyMatrices(i.bones[s].matrixWorld,i.boneInverses[s]),t.addScaledVector(g0.copy(gn).applyMatrix4($c),n)}}return t.isVector4&&(t.w=gn.w),t.applyMatrix4(this.bindMatrixInverse)}},ec=class extends Et{constructor(){super(),this.isBone=!0,this.type="Bone"}},Ui=class extends Yt{constructor(e=null,t=1,i=1,r,a,n,s,o,l=Ht,h=Ht,c,u){super(null,n,s,o,l,h,r,a,c,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},eu=new lt,v0=new lt,mp=class gp{constructor(t=[],i=[]){this.uuid=Oi(),this.bones=t.slice(0),this.boneInverses=i,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let t=this.bones,i=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),i.length===0)this.calculateInverses();else if(t.length!==i.length){Le("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let r=0,a=this.bones.length;r<a;r++)this.boneInverses.push(new lt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,i=this.bones.length;t<i;t++){let r=new lt;this.bones[t]&&r.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(r)}}pose(){for(let t=0,i=this.bones.length;t<i;t++){let r=this.bones[t];r&&r.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,i=this.bones.length;t<i;t++){let r=this.bones[t];r&&(r.parent&&r.parent.isBone?(r.matrix.copy(r.parent.matrixWorld).invert(),r.matrix.multiply(r.matrixWorld)):r.matrix.copy(r.matrixWorld),r.matrix.decompose(r.position,r.quaternion,r.scale))}}update(){let t=this.bones,i=this.boneInverses,r=this.boneMatrices,a=this.boneTexture;for(let n=0,s=t.length;n<s;n++){let o=t[n]?t[n].matrixWorld:v0;eu.multiplyMatrices(o,i[n]),eu.toArray(r,n*16)}a!==null&&(a.needsUpdate=!0)}clone(){return new gp(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let i=new Float32Array(t*t*4);i.set(this.boneMatrices);let r=new Ui(i,t,t,bi,mi);return r.needsUpdate=!0,this.boneMatrices=i,this.boneTexture=r,this}getBoneByName(t){for(let i=0,r=this.bones.length;i<r;i++){let a=this.bones[i];if(a.name===t)return a}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,i){this.uuid=t.uuid;for(let r=0,a=t.bones.length;r<a;r++){let n=t.bones[r],s=i[n];s===void 0&&(Le("Skeleton: No bone found with UUID:",n),s=new ec),this.bones.push(s),this.boneInverses.push(new lt().fromArray(t.boneInverses[r]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let i=this.bones,r=this.boneInverses;for(let a=0,n=i.length;a<n;a++){let s=i[a];t.bones.push(s.uuid);let o=r[a];t.boneInverses.push(o.toArray())}return t}},Ja=class extends Dt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Da=new lt,tu=new lt,Ds=[],iu=new ci,_0=new lt,vn=new it,_n=new ti,Or=class extends it{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ja(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,_0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ci),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),iu.copy(e.boundingBox).applyMatrix4(Da),this.boundingBox.union(iu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),_n.copy(e.boundingSphere).applyMatrix4(Da),this.boundingSphere.union(_n)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,a=i.length+1,n=e*a+1;for(let s=0;s<i.length;s++)i[s]=r[n+s]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(vn.geometry=this.geometry,vn.material=this.material,vn.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_n.copy(this.boundingSphere),_n.applyMatrix4(i),e.ray.intersectsSphere(_n)!==!1))for(let a=0;a<r;a++){this.getMatrixAt(a,Da),tu.multiplyMatrices(i,Da),vn.matrixWorld=tu,vn.raycast(e,Ds);for(let n=0,s=Ds.length;n<s;n++){let o=Ds[n];o.instanceId=a,o.object=this,t.push(o)}Ds.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ja(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ui(new Float32Array(r*this.count),r,this.count,il,mi));let a=this.morphTexture.source.data.data,n=0;for(let l=0;l<i.length;l++)n+=i[l];let s=this.geometry.morphTargetsRelative?1:1-n,o=r*e;return a[o]=s,a.set(i,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},qr=new ti,y0=new se(.5,.5),Us=new R,ca=class{constructor(e=new Ri,t=new Ri,i=new Ri,r=new Ri,a=new Ri,n=new Ri){this.planes=[e,t,i,r,a,n]}set(e,t,i,r,a,n){let s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(i),s[3].copy(r),s[4].copy(a),s[5].copy(n),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ci,i=!1){let r=this.planes,a=e.elements,n=a[0],s=a[1],o=a[2],l=a[3],h=a[4],c=a[5],u=a[6],p=a[7],d=a[8],g=a[9],y=a[10],v=a[11],m=a[12],f=a[13],S=a[14],x=a[15];if(r[0].setComponents(l-n,p-h,v-d,x-m).normalize(),r[1].setComponents(l+n,p+h,v+d,x+m).normalize(),r[2].setComponents(l+s,p+c,v+g,x+f).normalize(),r[3].setComponents(l-s,p-c,v-g,x-f).normalize(),i)r[4].setComponents(o,u,y,S).normalize(),r[5].setComponents(l-o,p-u,v-y,x-S).normalize();else if(r[4].setComponents(l-o,p-u,v-y,x-S).normalize(),t===Ci)r[5].setComponents(l+o,p+u,v+y,x+S).normalize();else if(t===ha)r[5].setComponents(o,u,y,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qr)}intersectsSprite(e){qr.center.set(0,0,0);let t=y0.distanceTo(e.center);return qr.radius=.7071067811865476+t,qr.applyMatrix4(e.matrixWorld),this.intersectsSphere(qr)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(Us.x=r.normal.x>0?e.max.x:e.min.x,Us.y=r.normal.y>0?e.max.y:e.min.y,Us.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Us)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ru=new lt,tc=class vp{constructor(){this.coordinateSystem=Ci,this._frustums=[],this._count=0}setFromArrayCamera(t){let i=t.cameras,r=this._frustums;for(let a=0;a<i.length;a++){let n=i[a];ru.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),r[a]===void 0&&(r[a]=new ca),r[a].setFromProjectionMatrix(ru,n.coordinateSystem,n.reversedDepth)}return this._count=i.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsObject(t))return!0;return!1}intersectsSprite(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSphere(t))return!0;return!1}intersectsBox(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsBox(t))return!0;return!1}containsPoint(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let i=this._frustums,r=t._frustums;for(let a=0;a<t._count;a++)i[a]===void 0&&(i[a]=new ca),i[a].copy(r[a]);return this._count=t._count,this}clone(){return new vp().copy(this)}};function $l(e,t){return e-t}function x0(e,t){return e.z-t.z}function S0(e,t){return t.z-e.z}var M0=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,r){let a=this.pool,n=this.list;this.index>=a.length&&a.push({start:-1,count:-1,z:-1,index:-1});let s=a[this.index];n.push(s),this.index++,s.start=e,s.count=t,s.z=i,s.index=r}reset(){this.list.length=0,this.index=0}},xi=new lt,b0=new ke(1,1,1),E0=new ca,w0=new tc,Ns=new ci,Yr=new ti,Ql=new R,au=new R,nu=new R,T0=new R,eh=new M0,li=new it,Os=[];function A0(e,t,i=0){let r=t.itemSize;if(e.isInterleavedBufferAttribute||e.array.constructor!==t.array.constructor){let a=e.count;for(let n=0;n<a;n++)for(let s=0;s<r;s++)t.setComponent(n+i,s,e.getComponent(n,s))}else t.array.set(e.array,i*r);t.needsUpdate=!0}function $i(e,t){if(e.constructor!==t.constructor){let i=Math.min(e.length,t.length);for(let r=0;r<i;r++)t[r]=e[r]}else{let i=Math.min(e.length,t.length);t.set(new e.constructor(e.buffer,0,i))}}var _p=class extends it{constructor(e,t,i=t*2,r){super(new dt,r),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=i,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._mergedDrawCounts=new Int32Array(e),this._mergedDrawStarts=new Int32Array(e),this._mergedDrawInstanceCounts=new Int32Array(e),this._mergedDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._previousMatricesTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),i=new Ui(t,e,e,bi,mi);this._matricesTexture=i}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),i=new Ui(t,e,e,es,Ni);this._indirectTexture=i}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),i=new Ui(t,e,e,bi,mi);i.colorSpace=yt.workingColorSpace,this._colorsTexture=i}_initializeGeometry(e){let t=this.geometry,i=this._maxVertexCount,r=this._maxIndexCount;if(this._geometryInitialized===!1){for(let a in e.attributes){let n=e.getAttribute(a),{array:s,itemSize:o,normalized:l}=n,h=new s.constructor(i*o),c=new Dt(h,o,l);t.setAttribute(a,c)}if(e.getIndex()!==null){let a=i>65535?new Uint32Array(r):new Uint16Array(r);t.setIndex(new Dt(a,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let i in t.attributes){if(!e.hasAttribute(i))throw new Error(`THREE.BatchedMesh: Added geometry missing "${i}". All geometries must have consistent attributes.`);let r=e.getAttribute(i),a=t.getAttribute(i);if(r.itemSize!==a.itemSize||r.normalized!==a.normalized)throw new Error(`THREE.BatchedMesh: Added geometry attribute "${i}" has an inconsistent itemSize or normalized value.`)}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let i=0,r=t.length;i<r;i++){if(t[i].active===!1)continue;let a=t[i].geometryIndex;this.getMatrixAt(i,xi),this.getBoundingBoxAt(a,Ns).applyMatrix4(xi),e.union(Ns)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let i=0,r=t.length;i<r;i++){if(t[i].active===!1)continue;let a=t[i].geometryIndex;this.getMatrixAt(i,xi),this.getBoundingSphereAt(a,Yr).applyMatrix4(xi),e.union(Yr)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let t={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort($l),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=t):(i=this._instanceInfo.length,this._instanceInfo.push(t));let r=this._matricesTexture;xi.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;let a=this._colorsTexture;return a&&(b0.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,i=-1){this._initializeGeometry(e),this._validateGeometry(e);let r={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},a=this._geometryInfo;r.vertexStart=this._nextVertexStart,r.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let n=e.getIndex();if(n!==null&&(r.indexStart=this._nextIndexStart,r.reservedIndexCount=i===-1?n.count:i),r.indexStart!==-1&&r.indexStart+r.reservedIndexCount>this._maxIndexCount||r.vertexStart+r.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let s;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort($l),s=this._availableGeometryIds.shift(),a[s]=r):(s=this._geometryCount,this._geometryCount++,a.push(r)),this.setGeometryAt(s,e),this._nextIndexStart=r.indexStart+r.reservedIndexCount,this._nextVertexStart=r.vertexStart+r.reservedVertexCount,s}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let i=this.geometry,r=i.getIndex()!==null,a=i.getIndex(),n=t.getIndex(),s=this._geometryInfo[e];if(r&&n.count>s.reservedIndexCount||t.attributes.position.count>s.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let o=s.vertexStart,l=s.reservedVertexCount;s.vertexCount=t.getAttribute("position").count;for(let h in i.attributes){let c=t.getAttribute(h),u=i.getAttribute(h);A0(c,u,o);let p=c.itemSize;for(let d=c.count,g=l;d<g;d++){let y=o+d;for(let v=0;v<p;v++)u.setComponent(y,v,0)}u.needsUpdate=!0,u.addUpdateRange(o*p,l*p)}if(r){let h=s.indexStart,c=s.reservedIndexCount;s.indexCount=t.getIndex().count;for(let u=0;u<n.count;u++)a.setX(h+u,o+n.getX(u));for(let u=n.count,p=c;u<p;u++)a.setX(h+u,o);a.needsUpdate=!0,a.addUpdateRange(h,s.reservedIndexCount)}return s.start=r?s.indexStart:s.vertexStart,s.count=r?s.indexCount:s.vertexCount,s.boundingBox=null,t.boundingBox!==null&&(s.boundingBox=t.boundingBox.clone()),s.boundingSphere=null,t.boundingSphere!==null&&(s.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let i=this._instanceInfo;for(let r=0,a=i.length;r<a;r++)i[r].active&&i[r].geometryIndex===e&&this.deleteInstance(r);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,i=this._geometryInfo,r=i.map((n,s)=>s).sort((n,s)=>i[n].vertexStart-i[s].vertexStart),a=this.geometry;for(let n=0,s=i.length;n<s;n++){let o=r[n],l=i[o];if(l.active!==!1){if(a.index!==null){if(l.indexStart!==t){let{indexStart:h,vertexStart:c,reservedIndexCount:u}=l,p=a.index,d=p.array,g=e-c;for(let y=h;y<h+u;y++)d[y]=d[y]+g;p.array.copyWithin(t,h,h+u),p.addUpdateRange(t,u),p.needsUpdate=!0,l.indexStart=t}t+=l.reservedIndexCount}if(l.vertexStart!==e){let{vertexStart:h,reservedVertexCount:c}=l,u=a.attributes;for(let p in u){let d=u[p],{array:g,itemSize:y}=d;g.copyWithin(e*y,h*y,(h+c)*y),d.addUpdateRange(e*y,c*y),d.needsUpdate=!0}l.vertexStart=e}e+=l.reservedVertexCount,l.start=a.index?l.indexStart:l.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let i=this.geometry,r=this._geometryInfo[e];if(r.boundingBox===null){let a=new ci,n=i.index,s=i.attributes.position;for(let o=r.start,l=r.start+r.count;o<l;o++){let h=o;n&&(h=n.getX(h)),a.expandByPoint(Ql.fromBufferAttribute(s,h))}r.boundingBox=a}return t.copy(r.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let i=this.geometry,r=this._geometryInfo[e];if(r.boundingSphere===null){let a=new ti;this.getBoundingBoxAt(e,Ns),Ns.getCenter(a.center);let n=i.index,s=i.attributes.position,o=0;for(let l=r.start,h=r.start+r.count;l<h;l++){let c=l;n&&(c=n.getX(c)),Ql.fromBufferAttribute(s,c),o=Math.max(o,a.center.distanceToSquared(Ql))}a.radius=Math.sqrt(o),r.boundingSphere=a}return t.copy(r.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let i=this._matricesTexture,r=this._matricesTexture.image.data;return t.toArray(r,e*16),i.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let i=this._geometryInfo[e];return t.vertexStart=i.vertexStart,t.vertexCount=i.vertexCount,t.reservedVertexCount=i.reservedVertexCount,t.indexStart=i.indexStart,t.indexCount=i.indexCount,t.reservedIndexCount=i.reservedIndexCount,t.start=i.start,t.count=i.count,t}setInstanceCount(e){let t=this._availableInstanceIds,i=this._instanceInfo;for(t.sort($l);t[t.length-1]===i.length-1;)i.pop(),t.pop();if(e<i.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let r=new Int32Array(e),a=new Int32Array(e);$i(this._multiDrawCounts,r),$i(this._multiDrawStarts,a),this._multiDrawCounts=r,this._multiDrawStarts=a;let n=new Int32Array(e),s=new Int32Array(e),o=new Int32Array(e);$i(this._mergedDrawCounts,n),$i(this._mergedDrawStarts,s),$i(this._mergedDrawInstanceCounts,o),this._mergedDrawCounts=n,this._mergedDrawStarts=s,this._mergedDrawInstanceCounts=o,this._maxInstanceCount=e;let l=this._indirectTexture,h=this._matricesTexture,c=this._colorsTexture;l.dispose(),this._initIndirectTexture(),$i(l.image.data,this._indirectTexture.image.data),h.dispose(),this._initMatricesTexture(),$i(h.image.data,this._matricesTexture.image.data),c&&(c.dispose(),this._initColorsTexture(),$i(c.image.data,this._colorsTexture.image.data)),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}setGeometrySize(e,t){let i=[...this._geometryInfo].filter(n=>n.active);if(Math.max(...i.map(n=>n.vertexStart+n.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...i.map(n=>n.indexStart+n.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new dt,this._initializeGeometry(r));let a=this.geometry;r.index&&$i(r.index.array,a.index.array);for(let n in r.attributes)$i(r.attributes[n].array,a.attributes[n].array);this._visibilityChanged=!0}raycast(e,t){let i=this._instanceInfo,r=this._geometryInfo,a=this.matrixWorld,n=this.geometry;li.material=this.material,li.geometry.index=n.index,li.geometry.attributes=n.attributes,li.geometry.boundingBox===null&&(li.geometry.boundingBox=new ci),li.geometry.boundingSphere===null&&(li.geometry.boundingSphere=new ti);for(let s=0,o=i.length;s<o;s++){if(!i[s].visible||!i[s].active)continue;let l=i[s].geometryIndex,h=r[l];li.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(s,li.matrixWorld).premultiply(a),this.getBoundingBoxAt(l,li.geometry.boundingBox),this.getBoundingSphereAt(l,li.geometry.boundingSphere),li.raycast(e,Os);for(let c=0,u=Os.length;c<u;c++){let p=Os[c];p.object=this,p.batchId=s,t.push(p)}Os.length=0}li.material=null,li.geometry.index=null,li.geometry.attributes={},li.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._mergedDrawCounts=e._mergedDrawCounts.slice(),this._mergedDrawStarts=e._mergedDrawStarts.slice(),this._mergedDrawInstanceCounts=e._mergedDrawInstanceCounts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),e._colorsTexture!==null?(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()):this._colorsTexture=null,this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}_updateDrawParameters(e,t,i,r="multiDraw"){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let a=t.getIndex(),n=a===null?1:a.array.BYTES_PER_ELEMENT,s=1;i.wireframe&&(s=2,n=t.attributes.position.count>65535?4:2);let o=this._instanceInfo,l=this._multiDrawStarts,h=this._multiDrawCounts,c=this._mergedDrawStarts,u=this._mergedDrawCounts,p=this._mergedDrawInstanceCounts,d=this._geometryInfo,g=this.perObjectFrustumCulled,y=this._indirectTexture,v=y.image.data,m=e.isArrayCamera?w0:E0;g&&(e.isArrayCamera?m.setFromArrayCamera(e):(xi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(xi,e.coordinateSystem,e.reversedDepth)));let f=0,S=0;if(this.sortObjects){xi.copy(this.matrixWorld).invert(),au.setFromMatrixPosition(e.matrixWorld).applyMatrix4(xi),nu.set(0,0,-1).transformDirection(e.matrixWorld).transformDirection(xi);for(let b=0,_=o.length;b<_;b++)if(o[b].visible&&o[b].active){let M=o[b].geometryIndex;this.getMatrixAt(b,xi),this.getBoundingSphereAt(M,Yr).applyMatrix4(xi);let E=!1;if(g&&(E=!m.intersectsSphere(Yr)),!E){let P=d[M],I=T0.subVectors(Yr.center,au).dot(nu);eh.push(P.start,P.count,I,b)}}let x=eh.list,A=this.customSort;A===null?x.sort(i.transparent?S0:x0):A.call(this,x,e);for(let b=0,_=x.length;b<_;b++){let M=x[b],E=M.start*n*s,P=M.count*s;r==="merged"?S>0&&c[S-1]===E&&u[S-1]===P?p[S-1]++:(c[S]=E,u[S]=P,p[S]=1,S++):(l[f]=E,h[f]=P),v[f]=M.index,f++}eh.reset()}else for(let x=0,A=o.length;x<A;x++)if(o[x].visible&&o[x].active){let b=o[x].geometryIndex,_=!1;if(g&&(this.getMatrixAt(x,xi),this.getBoundingSphereAt(b,Yr).applyMatrix4(xi),_=!m.intersectsSphere(Yr)),!_){let M=d[b],E=M.start*n*s,P=M.count*s;r==="merged"?S>0&&c[S-1]===E&&u[S-1]===P?p[S-1]++:(c[S]=E,u[S]=P,p[S]=1,S++):(l[f]=E,h[f]=P),v[f]=x,f++}}y.needsUpdate=!0,this._multiDrawCount=f,this._mergedDrawCount=S,this._multiDrawBytesPerElement=n,this._visibilityChanged=!1}onBeforeRender(e,t,i,r,a){e.isWebGPURenderer===!0?(this._visibilityChanged||this.perObjectFrustumCulled||this.sortObjects)&&(this._indirectTexture.needsUpdate=!0):this._updateDrawParameters(i,r,a)}onBeforeShadow(e,t,i,r,a,n){e.isWebGPURenderer!==!0&&this._updateDrawParameters(r,a,n)}},_i=class extends ii{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Yo=new R,Zo=new R,su=new lt,yn=new Qa,Fs=new ti,th=new R,ou=new R,Nr=class extends Et{constructor(e=new dt,t=new _i){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,a=t.count;r<a;r++)Yo.fromBufferAttribute(t,r-1),Zo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Yo.distanceTo(Zo);e.setAttribute("lineDistance",new qe(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,n=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fs.copy(i.boundingSphere),Fs.applyMatrix4(r),Fs.radius+=a,e.ray.intersectsSphere(Fs)===!1)return;su.copy(r).invert(),yn.copy(e.ray).applyMatrix4(su);let s=a/((this.scale.x+this.scale.y+this.scale.z)/3),o=s*s,l=this.isLineSegments?2:1,h=i.index,c=i.attributes.position;if(h!==null){let u=Math.max(0,n.start),p=Math.min(h.count,n.start+n.count);for(let d=u,g=p-1;d<g;d+=l){let y=h.getX(d),v=h.getX(d+1),m=Bs(this,e,yn,o,y,v,d);m&&t.push(m)}if(this.isLineLoop){let d=h.getX(p-1),g=h.getX(u),y=Bs(this,e,yn,o,d,g,p-1);y&&t.push(y)}}else{let u=Math.max(0,n.start),p=Math.min(c.count,n.start+n.count);for(let d=u,g=p-1;d<g;d+=l){let y=Bs(this,e,yn,o,d,d+1,d);y&&t.push(y)}if(this.isLineLoop){let d=Bs(this,e,yn,o,p-1,u,p-1);d&&t.push(d)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}};function Bs(e,t,i,r,a,n,s){let o=e.geometry.attributes.position;if(Yo.fromBufferAttribute(o,a),Zo.fromBufferAttribute(o,n),i.distanceSqToSegment(Yo,Zo,th,ou)>r)return;th.applyMatrix4(e.matrixWorld);let l=t.ray.origin.distanceTo(th);if(!(l<t.near||l>t.far))return{distance:l,point:ou.clone().applyMatrix4(e.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:e}}var lu=new R,hu=new R,ar=class extends Nr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,a=t.count;r<a;r+=2)lu.fromBufferAttribute(t,r),hu.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+lu.distanceTo(hu);e.setAttribute("lineDistance",new qe(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},yp=class extends Nr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ic=class extends ii{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},cu=new lt,Sh=new Qa,zs=new ti,Hs=new R,xp=class extends Et{constructor(e=new dt,t=new ic){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,n=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),zs.copy(i.boundingSphere),zs.applyMatrix4(r),zs.radius+=a,e.ray.intersectsSphere(zs)===!1)return;cu.copy(r).invert(),Sh.copy(e.ray).applyMatrix4(cu);let s=a/((this.scale.x+this.scale.y+this.scale.z)/3),o=s*s,l=i.index,h=i.attributes.position;if(l!==null){let c=Math.max(0,n.start),u=Math.min(l.count,n.start+n.count);for(let p=c,d=u;p<d;p++){let g=l.getX(p);Hs.fromBufferAttribute(h,g),uu(Hs,g,o,r,e,t,this)}}else{let c=Math.max(0,n.start),u=Math.min(h.count,n.start+n.count);for(let p=c,d=u;p<d;p++)Hs.fromBufferAttribute(h,p),uu(Hs,p,o,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}};function uu(e,t,i,r,a,n,s){let o=Sh.distanceSqToPoint(e);if(o<i){let l=new R;Sh.closestPointToPoint(e,l),l.applyMatrix4(r);let h=a.ray.origin.distanceTo(l);if(h<a.near||h>a.far)return;n.push({distance:h,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:s})}}var Sp=class extends Yt{constructor(e,t,i,r,a=Nt,n=Nt,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let h=this;function c(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c))}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;!("requestVideoFrameCallback"in e)&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}},R0=class extends Sp{constructor(e,t,i,r,a,n,s,o){super({},e,t,i,r,a,n,s,o),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}},C0=class extends Yt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Ht,this.minFilter=Ht,this.generateMipmaps=!1,this.needsUpdate=!0}copy(e){return super.copy(e),this.source=new tr(Object.assign({},e.image)),this}},pl=class extends Yt{constructor(e=[],t,i,r,a,n,s,o,l,h,c,u){super(null,n,s,o,l,h,r,a,c,u),this.isCompressedTexture=!0,this.image={width:t,height:i},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},P0=class extends pl{constructor(e,t,i,r,a,n){super(e,t,i,a,n),this.isCompressedArrayTexture=!0,this.image.depth=r,this.wrapR=Kt,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},I0=class extends pl{constructor(e,t,i){super(void 0,e[0].width,e[0].height,t,i,_r),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}},ts=class extends Yt{constructor(e=[],t=_r,i,r,a,n,s,o,l,h){super(e,t,i,r,a,n,s,o,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},rc=class extends Yt{constructor(e,t,i,r,a,n,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},L0=class extends Yt{constructor(e,t,i,r,a,n,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;let h=e?e.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){let e=this.image?this.image.parentNode:null;e!==null&&"onpaint"in e&&(e.onpaint=null),super.dispose()}},ua=class extends Yt{constructor(e,t,i=Ni,r,a,n,s=Ht,o=Ht,l,h=yr,c=1){if(h!==yr&&h!==fr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:c};super(u,r,a,n,s,o,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ac=class extends ua{constructor(e,t=Ni,i=_r,r,a,n=Ht,s=Ht,o,l=yr){let h={width:e,height:e,depth:1},c=[h,h,h,h,h,h];super(e,e,t,i,r,a,n,s,o,l),this.image=c,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},nc=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Qt=class Mp extends dt{constructor(t=1,i=1,r=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:r,widthSegments:a,heightSegments:n,depthSegments:s};let o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);let l=[],h=[],c=[],u=[],p=0,d=0;g("z","y","x",-1,-1,r,i,t,s,n,0),g("z","y","x",1,-1,r,i,-t,s,n,1),g("x","z","y",1,1,t,r,i,a,s,2),g("x","z","y",1,-1,t,r,-i,a,s,3),g("x","y","z",1,-1,t,i,r,a,n,4),g("x","y","z",-1,-1,t,i,-r,a,n,5),this.setIndex(l),this.setAttribute("position",new qe(h,3)),this.setAttribute("normal",new qe(c,3)),this.setAttribute("uv",new qe(u,2));function g(y,v,m,f,S,x,A,b,_,M,E){let P=x/_,I=A/M,L=x/2,Y=A/2,D=b/2,B=_+1,Z=M+1,V=0,pe=0,z=new R;for(let W=0;W<Z;W++){let Q=W*I-Y;for(let ve=0;ve<B;ve++){let $=ve*P-L;z[y]=$*f,z[v]=Q*S,z[m]=D,h.push(z.x,z.y,z.z),z[y]=0,z[v]=0,z[m]=b>0?1:-1,c.push(z.x,z.y,z.z),u.push(ve/_),u.push(1-W/M),V+=1}}for(let W=0;W<M;W++)for(let Q=0;Q<_;Q++){let ve=p+Q+B*W,$=p+Q+B*(W+1),he=p+(Q+1)+B*(W+1),Pe=p+(Q+1)+B*W;l.push(ve,$,Pe),l.push($,he,Pe),pe+=6}o.addGroup(d,pe,E),d+=pe,p+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mp(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fl=class bp extends dt{constructor(t=1,i=1,r=4,a=8,n=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:i,capSegments:r,radialSegments:a,heightSegments:n},i=Math.max(0,i),r=Math.max(1,Math.floor(r)),a=Math.max(3,Math.floor(a)),n=Math.max(1,Math.floor(n));let s=[],o=[],l=[],h=[],c=i/2,u=Math.PI/2*t,p=i,d=2*u+p,g=r*2+n,y=a+1,v=new R,m=new R;for(let f=0;f<=g;f++){let S=0,x=0,A=0,b=0;if(f<=r){let E=f/r,P=E*Math.PI/2;x=-c-t*Math.cos(P),A=t*Math.sin(P),b=-t*Math.cos(P),S=E*u}else if(f<=r+n){let E=(f-r)/n;x=-c+E*i,A=t,b=0,S=u+E*p}else{let E=(f-r-n)/r,P=E*Math.PI/2;x=c+t*Math.sin(P),A=t*Math.cos(P),b=t*Math.sin(P),S=u+p+E*u}let _=Math.max(0,Math.min(1,S/d)),M=0;f===0?M=.5/a:f===g&&(M=-.5/a);for(let E=0;E<=a;E++){let P=E/a,I=P*Math.PI*2,L=Math.sin(I),Y=Math.cos(I);m.x=-A*Y,m.y=x,m.z=A*L,o.push(m.x,m.y,m.z),v.set(-A*Y,b,A*L),v.normalize(),l.push(v.x,v.y,v.z),h.push(P+M,_)}if(f>0){let E=(f-1)*y;for(let P=0;P<a;P++){let I=E+P,L=E+P+1,Y=f*y+P,D=f*y+P+1;s.push(I,L,Y),s.push(L,D,Y)}}}this.setIndex(s),this.setAttribute("position",new qe(o,3)),this.setAttribute("normal",new qe(l,3)),this.setAttribute("uv",new qe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bp(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Ep=class wp extends dt{constructor(t=1,i=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:r,thetaLength:a},i=Math.max(3,i);let n=[],s=[],o=[],l=[],h=new R,c=new se;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,p=3;u<=i;u++,p+=3){let d=r+u/i*a;h.x=t*Math.cos(d),h.y=t*Math.sin(d),s.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(s[p]/t+1)/2,c.y=(s[p+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=i;u++)n.push(u,u+1,0);this.setIndex(n),this.setAttribute("position",new qe(s,3)),this.setAttribute("normal",new qe(o,3)),this.setAttribute("uv",new qe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wp(t.radius,t.segments,t.thetaStart,t.thetaLength)}},kt=class Tp extends dt{constructor(t=1,i=1,r=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:i,height:r,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};let h=this;a=Math.floor(a),n=Math.floor(n);let c=[],u=[],p=[],d=[],g=0,y=[],v=r/2,m=0;f(),s===!1&&(t>0&&S(!0),i>0&&S(!1)),this.setIndex(c),this.setAttribute("position",new qe(u,3)),this.setAttribute("normal",new qe(p,3)),this.setAttribute("uv",new qe(d,2));function f(){let x=new R,A=new R,b=0,_=(i-t)/r;for(let M=0;M<=n;M++){let E=[],P=M/n,I=P*(i-t)+t;for(let L=0;L<=a;L++){let Y=L/a,D=Y*l+o,B=Math.sin(D),Z=Math.cos(D);A.x=I*B,A.y=-P*r+v,A.z=I*Z,u.push(A.x,A.y,A.z),x.set(B,_,Z).normalize(),p.push(x.x,x.y,x.z),d.push(Y,1-P),E.push(g++)}y.push(E)}for(let M=0;M<a;M++)for(let E=0;E<n;E++){let P=y[E][M],I=y[E+1][M],L=y[E+1][M+1],Y=y[E][M+1];(t>0||E!==0)&&(c.push(P,I,Y),b+=3),(i>0||E!==n-1)&&(c.push(I,L,Y),b+=3)}h.addGroup(m,b,0),m+=b}function S(x){let A=g,b=new se,_=new R,M=0,E=x===!0?t:i,P=x===!0?1:-1;for(let L=1;L<=a;L++)u.push(0,v*P,0),p.push(0,P,0),d.push(.5,.5),g++;let I=g;for(let L=0;L<=a;L++){let Y=L/a*l+o,D=Math.cos(Y),B=Math.sin(Y);_.x=E*B,_.y=v*P,_.z=E*D,u.push(_.x,_.y,_.z),p.push(0,P,0),b.x=D*.5+.5,b.y=B*.5*P+.5,d.push(b.x,b.y),g++}for(let L=0;L<a;L++){let Y=A+L,D=I+L;x===!0?c.push(D,D+1,Y):c.push(D+1,D,Y),M+=3}h.addGroup(m,M,x===!0?1:2),m+=M}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tp(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},pa=class Ap extends kt{constructor(t=1,i=1,r=32,a=1,n=!1,s=0,o=Math.PI*2){super(0,t,i,r,a,n,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:i,radialSegments:r,heightSegments:a,openEnded:n,thetaStart:s,thetaLength:o}}static fromJSON(t){return new Ap(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},en=class Rp extends dt{constructor(t=[],i=[],r=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:i,radius:r,detail:a};let n=[],s=[];o(a),h(r),c(),this.setAttribute("position",new qe(n,3)),this.setAttribute("normal",new qe(n.slice(),3)),this.setAttribute("uv",new qe(s,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function o(f){let S=new R,x=new R,A=new R;for(let b=0;b<i.length;b+=3)d(i[b+0],S),d(i[b+1],x),d(i[b+2],A),l(S,x,A,f)}function l(f,S,x,A){let b=A+1,_=[];for(let M=0;M<=b;M++){_[M]=[];let E=f.clone().lerp(x,M/b),P=S.clone().lerp(x,M/b),I=b-M;for(let L=0;L<=I;L++)L===0&&M===b?_[M][L]=E:_[M][L]=E.clone().lerp(P,L/I)}for(let M=0;M<b;M++)for(let E=0;E<2*(b-M)-1;E++){let P=Math.floor(E/2);E%2===0?(p(_[M][P+1]),p(_[M+1][P]),p(_[M][P])):(p(_[M][P+1]),p(_[M+1][P+1]),p(_[M+1][P]))}}function h(f){let S=new R;for(let x=0;x<n.length;x+=3)S.x=n[x+0],S.y=n[x+1],S.z=n[x+2],S.normalize().multiplyScalar(f),n[x+0]=S.x,n[x+1]=S.y,n[x+2]=S.z}function c(){let f=new R;for(let S=0;S<n.length;S+=3){f.x=n[S+0],f.y=n[S+1],f.z=n[S+2];let x=v(f)/2/Math.PI+.5,A=m(f)/Math.PI+.5;s.push(x,1-A)}g(),u()}function u(){for(let f=0;f<s.length;f+=6){let S=s[f+0],x=s[f+2],A=s[f+4],b=Math.max(S,x,A),_=Math.min(S,x,A);b>.9&&_<.1&&(S<.2&&(s[f+0]+=1),x<.2&&(s[f+2]+=1),A<.2&&(s[f+4]+=1))}}function p(f){n.push(f.x,f.y,f.z)}function d(f,S){let x=f*3;S.x=t[x+0],S.y=t[x+1],S.z=t[x+2]}function g(){let f=new R,S=new R,x=new R,A=new R,b=new se,_=new se,M=new se;for(let E=0,P=0;E<n.length;E+=9,P+=6){f.set(n[E+0],n[E+1],n[E+2]),S.set(n[E+3],n[E+4],n[E+5]),x.set(n[E+6],n[E+7],n[E+8]),b.set(s[P+0],s[P+1]),_.set(s[P+2],s[P+3]),M.set(s[P+4],s[P+5]),A.copy(f).add(S).add(x).divideScalar(3);let I=v(A);y(b,P+0,f,I),y(_,P+2,S,I),y(M,P+4,x,I)}}function y(f,S,x,A){A<0&&f.x===1&&(s[S]=f.x-1),x.x===0&&x.z===0&&(s[S]=A/2/Math.PI+.5)}function v(f){return Math.atan2(f.z,-f.x)}function m(f){return Math.atan2(-f.y,Math.sqrt(f.x*f.x+f.z*f.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rp(t.vertices,t.indices,t.radius,t.detail)}},Cp=class Pp extends en{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=1/r,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-a,-r,0,-a,r,0,a,-r,0,a,r,-a,-r,0,-a,r,0,a,-r,0,a,r,0,-r,0,-a,r,0,-a,-r,0,a,r,0,a],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,s,t,i),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new Pp(t.radius,t.detail)}},ks=new R,Gs=new R,ih=new R,Vs=new Pr,Ip=class extends dt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),r=Math.cos(sa*t),a=e.getIndex(),n=e.getAttribute("position"),s=a?a.count:n.count,o=[0,0,0],l=["a","b","c"],h=new Array(3),c=new Map,u=[];for(let p=0;p<s;p+=3){a?(o[0]=a.getX(p),o[1]=a.getX(p+1),o[2]=a.getX(p+2)):(o[0]=p,o[1]=p+1,o[2]=p+2);let{a:d,b:g,c:y}=Vs;if(d.fromBufferAttribute(n,o[0]),g.fromBufferAttribute(n,o[1]),y.fromBufferAttribute(n,o[2]),Vs.getNormal(ih),h[0]=`${Math.round(d.x*i)},${Math.round(d.y*i)},${Math.round(d.z*i)}`,h[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,h[2]=`${Math.round(y.x*i)},${Math.round(y.y*i)},${Math.round(y.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let v=0;v<3;v++){let m=(v+1)%3,f=h[v],S=h[m],x=Vs[l[v]],A=Vs[l[m]],b=`${f}_${S}`,_=`${S}_${f}`,M=c.get(_);M?(ih.dot(M.normal)<=r&&(u.push(x.x,x.y,x.z),u.push(A.x,A.y,A.z)),c.set(_,null)):c.has(b)||c.set(b,{index0:o[v],index1:o[m],normal:ih.clone()})}}for(let p of c.values())if(p){let{index0:d,index1:g}=p;ks.fromBufferAttribute(n,d),Gs.fromBufferAttribute(n,g),u.push(ks.x,ks.y,ks.z),u.push(Gs.x,Gs.y,Gs.z)}this.setAttribute("position",new qe(u,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Ji=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Le("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),a=0;t.push(0);for(let n=1;n<=e;n++)i=this.getPoint(n/e),a+=i.distanceTo(r),t.push(a),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,a=i.length,n;t?n=t:n=e*i[a-1];let s=0,o=a-1,l;for(;s<=o;)if(r=Math.floor(s+(o-s)/2),l=i[r]-n,l<0)s=r+1;else if(l>0)o=r-1;else{o=r;break}if(r=o,i[r]===n)return r/(a-1);let h=i[r],c=i[r+1]-h,u=(n-h)/c;return(r+u)/(a-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),n=this.getPoint(r),s=t||(a.isVector2?new se:new R);return s.copy(n).sub(a).normalize(),s}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new R,r=[],a=[],n=[],s=new R,o=new lt;for(let p=0;p<=e;p++){let d=p/e;r[p]=this.getTangentAt(d,new R)}a[0]=new R,n[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(r[0].x),c=Math.abs(r[0].y),u=Math.abs(r[0].z);h<=l&&(l=h,i.set(1,0,0)),c<=l&&(l=c,i.set(0,1,0)),u<=l&&i.set(0,0,1),s.crossVectors(r[0],i).normalize(),a[0].crossVectors(r[0],s),n[0].crossVectors(r[0],a[0]);for(let p=1;p<=e;p++){if(a[p]=a[p-1].clone(),n[p]=n[p-1].clone(),s.crossVectors(r[p-1],r[p]),s.length()>Number.EPSILON){s.normalize();let d=Math.acos(ht(r[p-1].dot(r[p]),-1,1));a[p].applyMatrix4(o.makeRotationAxis(s,d))}n[p].crossVectors(r[p],a[p])}if(t===!0){let p=Math.acos(ht(a[0].dot(a[e]),-1,1));p/=e,r[0].dot(s.crossVectors(a[0],a[e]))>0&&(p=-p);for(let d=1;d<=e;d++)a[d].applyMatrix4(o.makeRotationAxis(r[d],p*d)),n[d].crossVectors(r[d],a[d])}return{tangents:r,normals:a,binormals:n}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},ml=class extends Ji{constructor(e=0,t=0,i=1,r=1,a=0,n=Math.PI*2,s=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=a,this.aEndAngle=n,this.aClockwise=s,this.aRotation=o}getPoint(e,t=new se){let i=t,r=Math.PI*2,a=this.aEndAngle-this.aStartAngle,n=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=r;for(;a>r;)a-=r;a<Number.EPSILON&&(n?a=0:a=r),this.aClockwise===!0&&!n&&(a===r?a=-r:a=a-r);let s=this.aStartAngle+e*a,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(this.aRotation!==0){let h=Math.cos(this.aRotation),c=Math.sin(this.aRotation),u=o-this.aX,p=l-this.aY;o=u*h-p*c+this.aX,l=u*c+p*h+this.aY}return i.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Lp=class extends ml{constructor(e,t,i,r,a,n){super(e,t,i,i,r,a,n),this.isArcCurve=!0,this.type="ArcCurve"}};function sc(){let e=0,t=0,i=0,r=0;function a(n,s,o,l){e=n,t=o,i=-3*n+3*s-2*o-l,r=2*n-2*s+o+l}return{initCatmullRom:function(n,s,o,l,h){a(s,o,h*(o-n),h*(l-s))},initNonuniformCatmullRom:function(n,s,o,l,h,c,u){let p=(s-n)/h-(o-n)/(h+c)+(o-s)/c,d=(o-s)/c-(l-s)/(c+u)+(l-o)/u;p*=c,d*=c,a(s,o,p,d)},calc:function(n){let s=n*n,o=s*n;return e+t*n+i*s+r*o}}}var du=new R,pu=new R,rh=new sc,ah=new sc,nh=new sc,Dp=class extends Ji{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new R){let i=t,r=this.points,a=r.length,n=(a-(this.closed?0:1))*e,s=Math.floor(n),o=n-s;this.closed?s+=s>0?0:(Math.floor(Math.abs(s)/a)+1)*a:o===0&&s===a-1&&(s=a-2,o=1);let l,h;this.closed||s>0?l=r[(s-1)%a]:(pu.subVectors(r[0],r[1]).add(r[0]),l=pu);let c=r[s%a],u=r[(s+1)%a];if(this.closed||s+2<a?h=r[(s+2)%a]:(du.subVectors(r[a-1],r[a-2]).add(r[a-1]),h=du),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,d=Math.pow(l.distanceToSquared(c),p),g=Math.pow(c.distanceToSquared(u),p),y=Math.pow(u.distanceToSquared(h),p);g<1e-4&&(g=1),d<1e-4&&(d=g),y<1e-4&&(y=g),rh.initNonuniformCatmullRom(l.x,c.x,u.x,h.x,d,g,y),ah.initNonuniformCatmullRom(l.y,c.y,u.y,h.y,d,g,y),nh.initNonuniformCatmullRom(l.z,c.z,u.z,h.z,d,g,y)}else this.curveType==="catmullrom"&&(rh.initCatmullRom(l.x,c.x,u.x,h.x,this.tension),ah.initCatmullRom(l.y,c.y,u.y,h.y,this.tension),nh.initCatmullRom(l.z,c.z,u.z,h.z,this.tension));return i.set(rh.calc(o),ah.calc(o),nh.calc(o)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function fu(e,t,i,r,a){let n=(r-t)*.5,s=(a-i)*.5,o=e*e,l=e*o;return(2*i-2*r+n+s)*l+(-3*i+3*r-2*n-s)*o+n*e+i}function D0(e,t){let i=1-e;return i*i*t}function U0(e,t){return 2*(1-e)*e*t}function N0(e,t){return e*e*t}function Dn(e,t,i,r){return D0(e,t)+U0(e,i)+N0(e,r)}function O0(e,t){let i=1-e;return i*i*i*t}function F0(e,t){let i=1-e;return 3*i*i*e*t}function B0(e,t){return 3*(1-e)*e*e*t}function z0(e,t){return e*e*e*t}function Un(e,t,i,r,a){return O0(e,t)+F0(e,i)+B0(e,r)+z0(e,a)}var oc=class extends Ji{constructor(e=new se,t=new se,i=new se,r=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new se){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(Un(e,r.x,a.x,n.x,s.x),Un(e,r.y,a.y,n.y,s.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Up=class extends Ji{constructor(e=new R,t=new R,i=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new R){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(Un(e,r.x,a.x,n.x,s.x),Un(e,r.y,a.y,n.y,s.y),Un(e,r.z,a.z,n.z,s.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},lc=class extends Ji{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Np=class extends Ji{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},hc=class extends Ji{constructor(e=new se,t=new se,i=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new se){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(Dn(e,r.x,a.x,n.x),Dn(e,r.y,a.y,n.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},cc=class extends Ji{constructor(e=new R,t=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new R){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(Dn(e,r.x,a.x,n.x),Dn(e,r.y,a.y,n.y),Dn(e,r.z,a.z,n.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},uc=class extends Ji{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let i=t,r=this.points,a=(r.length-1)*e,n=Math.floor(a),s=a-n,o=r[n===0?n:n-1],l=r[n],h=r[n>r.length-2?r.length-1:n+1],c=r[n>r.length-3?r.length-1:n+2];return i.set(fu(s,o.x,l.x,h.x,c.x),fu(s,o.y,l.y,h.y,c.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new se().fromArray(r))}return this}},Jo=Object.freeze({__proto__:null,ArcCurve:Lp,CatmullRomCurve3:Dp,CubicBezierCurve:oc,CubicBezierCurve3:Up,EllipseCurve:ml,LineCurve:lc,LineCurve3:Np,QuadraticBezierCurve:hc,QuadraticBezierCurve3:cc,SplineCurve:uc}),Op=class extends Ji{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Jo[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),r=this.getCurveLengths(),a=0;for(;a<r.length;){if(r[a]>=i){let n=r[a]-i,s=this.curves[a],o=s.getLength(),l=o===0?0:1-n/o;return s.getPointAt(l,t)}a++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let r=0,a=this.curves;r<a.length;r++){let n=a[r],s=n.isEllipseCurve?e*2:n.isLineCurve||n.isLineCurve3?1:n.isSplineCurve?e*n.points.length:e,o=n.getPoints(s);for(let l=0;l<o.length;l++){let h=o[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(new Jo[r.type]().fromJSON(r))}return this.cacheLengths=null,this}},jn=class extends Op{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new lc(this.currentPoint.clone(),new se(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){let a=new hc(this.currentPoint.clone(),new se(e,t),new se(i,r));return this.curves.push(a),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,a,n){let s=new oc(this.currentPoint.clone(),new se(e,t),new se(i,r),new se(a,n));return this.curves.push(s),this.currentPoint.set(a,n),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new uc(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,a,n){let s=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+s,t+o,i,r,a,n),this}absarc(e,t,i,r,a,n){return this.absellipse(e,t,i,i,r,a,n),this}ellipse(e,t,i,r,a,n,s,o){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,r,a,n,s,o),this}absellipse(e,t,i,r,a,n,s,o){let l=new ml(e,t,i,r,a,n,s,o);if(this.curves.length>0){let c=l.getPoint(0);c.equals(this.currentPoint)||this.lineTo(c.x,c.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},is=class extends jn{constructor(e){super(e),this.uuid=Oi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(new jn().fromJSON(r))}return this}};function H0(e,t,i=2){let r=t&&t.length,a=r?t[0]*i:e.length,n=Fp(e,0,a,i,!0),s=[];if(!n||n.next===n.prev)return s;let o,l,h;if(r&&(n=X0(e,t,n,i)),e.length>80*i){o=e[0],l=e[1];let c=o,u=l;for(let p=i;p<a;p+=i){let d=e[p],g=e[p+1];d<o&&(o=d),g<l&&(l=g),d>c&&(c=d),g>u&&(u=g)}h=Math.max(c-o,u-l),h=h!==0?32767/h:0}return qn(n,s,i,o,l,h,0),s}function Fp(e,t,i,r,a){let n;if(a===iv(e,t,i,r)>0)for(let s=t;s<i;s+=r)n=mu(s/r|0,e[s],e[s+1],n);else for(let s=i-r;s>=t;s-=r)n=mu(s/r|0,e[s],e[s+1],n);return n&&Ka(n,n.next)&&(Zn(n),n=n.next),n}function da(e,t){if(!e)return e;t||(t=e);let i=e,r;do if(r=!1,!i.steiner&&(Ka(i,i.next)||Ut(i.prev,i,i.next)===0)){if(Zn(i),i=t=i.prev,i===i.next)break;r=!0}else i=i.next;while(r||i!==t);return t}function qn(e,t,i,r,a,n,s){if(!e)return;!s&&n&&J0(e,r,a,n);let o=e;for(;e.prev!==e.next;){let l=e.prev,h=e.next;if(n?G0(e,r,a,n):k0(e)){t.push(l.i,e.i,h.i),Zn(e),e=h.next,o=h.next;continue}if(e=h,e===o){s?s===1?(e=V0(da(e),t),qn(e,t,i,r,a,n,2)):s===2&&W0(e,t,i,r,a,n):qn(da(e),t,i,r,a,n,1);break}}}function k0(e){let t=e.prev,i=e,r=e.next;if(Ut(t,i,r)>=0)return!1;let a=t.x,n=i.x,s=r.x,o=t.y,l=i.y,h=r.y,c=Math.min(a,n,s),u=Math.min(o,l,h),p=Math.max(a,n,s),d=Math.max(o,l,h),g=r.next;for(;g!==t;){if(g.x>=c&&g.x<=p&&g.y>=u&&g.y<=d&&Mn(a,o,n,l,s,h,g.x,g.y)&&Ut(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function G0(e,t,i,r){let a=e.prev,n=e,s=e.next;if(Ut(a,n,s)>=0)return!1;let o=a.x,l=n.x,h=s.x,c=a.y,u=n.y,p=s.y,d=Math.min(o,l,h),g=Math.min(c,u,p),y=Math.max(o,l,h),v=Math.max(c,u,p),m=Mh(d,g,t,i,r),f=Mh(y,v,t,i,r),S=e.prevZ,x=e.nextZ;for(;S&&S.z>=m&&x&&x.z<=f;){if(S.x>=d&&S.x<=y&&S.y>=g&&S.y<=v&&S!==a&&S!==s&&Mn(o,c,l,u,h,p,S.x,S.y)&&Ut(S.prev,S,S.next)>=0||(S=S.prevZ,x.x>=d&&x.x<=y&&x.y>=g&&x.y<=v&&x!==a&&x!==s&&Mn(o,c,l,u,h,p,x.x,x.y)&&Ut(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;S&&S.z>=m;){if(S.x>=d&&S.x<=y&&S.y>=g&&S.y<=v&&S!==a&&S!==s&&Mn(o,c,l,u,h,p,S.x,S.y)&&Ut(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;x&&x.z<=f;){if(x.x>=d&&x.x<=y&&x.y>=g&&x.y<=v&&x!==a&&x!==s&&Mn(o,c,l,u,h,p,x.x,x.y)&&Ut(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function V0(e,t){let i=e;do{let r=i.prev,a=i.next.next;!Ka(r,a)&&zp(r,i,i.next,a)&&Yn(r,a)&&Yn(a,r)&&(t.push(r.i,i.i,a.i),Zn(i),Zn(i.next),i=e=a),i=i.next}while(i!==e);return da(i)}function W0(e,t,i,r,a,n){let s=e;do{let o=s.next.next;for(;o!==s.prev;){if(s.i!==o.i&&Q0(s,o)){let l=Hp(s,o);s=da(s,s.next),l=da(l,l.next),qn(s,t,i,r,a,n,0),qn(l,t,i,r,a,n,0);return}o=o.next}s=s.next}while(s!==e)}function X0(e,t,i,r){let a=[];for(let n=0,s=t.length;n<s;n++){let o=t[n]*r,l=n<s-1?t[n+1]*r:e.length,h=Fp(e,o,l,r,!1);h===h.next&&(h.steiner=!0),a.push($0(h))}a.sort(j0);for(let n=0;n<a.length;n++)i=q0(a[n],i);return i}function j0(e,t){let i=e.x-t.x;if(i===0&&(i=e.y-t.y,i===0)){let r=(e.next.y-e.y)/(e.next.x-e.x),a=(t.next.y-t.y)/(t.next.x-t.x);i=r-a}return i}function q0(e,t){let i=Y0(e,t);if(!i)return t;let r=Hp(i,e);return da(r,r.next),da(i,i.next)}function Y0(e,t){let i=t,r=e.x,a=e.y,n=-1/0,s;if(Ka(e,i))return i;do{if(Ka(e,i.next))return i.next;if(a<=i.y&&a>=i.next.y&&i.next.y!==i.y){let u=i.x+(a-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(u<=r&&u>n&&(n=u,s=i.x<i.next.x?i:i.next,u===r))return s}i=i.next}while(i!==t);if(!s)return null;let o=s,l=s.x,h=s.y,c=1/0;i=s;do{if(r>=i.x&&i.x>=l&&r!==i.x&&Bp(a<h?r:n,a,l,h,a<h?n:r,a,i.x,i.y)){let u=Math.abs(a-i.y)/(r-i.x);Yn(i,e)&&(u<c||u===c&&(i.x>s.x||i.x===s.x&&Z0(s,i)))&&(s=i,c=u)}i=i.next}while(i!==o);return s}function Z0(e,t){return Ut(e.prev,e,t.prev)<0&&Ut(t.next,e,e.next)<0}function J0(e,t,i,r){let a=e;do a.z===0&&(a.z=Mh(a.x,a.y,t,i,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==e);a.prevZ.nextZ=null,a.prevZ=null,K0(a)}function K0(e){let t,i=1;do{let r=e,a;e=null;let n=null;for(t=0;r;){t++;let s=r,o=0;for(let h=0;h<i&&(o++,s=s.nextZ,!!s);h++);let l=i;for(;o>0||l>0&&s;)o!==0&&(l===0||!s||r.z<=s.z)?(a=r,r=r.nextZ,o--):(a=s,s=s.nextZ,l--),n?n.nextZ=a:e=a,a.prevZ=n,n=a;r=s}n.nextZ=null,i*=2}while(t>1);return e}function Mh(e,t,i,r,a){return e=(e-i)*a|0,t=(t-r)*a|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function $0(e){let t=e,i=e;do(t.x<i.x||t.x===i.x&&t.y<i.y)&&(i=t),t=t.next;while(t!==e);return i}function Bp(e,t,i,r,a,n,s,o){return(a-s)*(t-o)>=(e-s)*(n-o)&&(e-s)*(r-o)>=(i-s)*(t-o)&&(i-s)*(n-o)>=(a-s)*(r-o)}function Mn(e,t,i,r,a,n,s,o){return!(e===s&&t===o)&&Bp(e,t,i,r,a,n,s,o)}function Q0(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!ev(e,t)&&(Yn(e,t)&&Yn(t,e)&&tv(e,t)&&(Ut(e.prev,e,t.prev)||Ut(e,t.prev,t))||Ka(e,t)&&Ut(e.prev,e,e.next)>0&&Ut(t.prev,t,t.next)>0)}function Ut(e,t,i){return(t.y-e.y)*(i.x-t.x)-(t.x-e.x)*(i.y-t.y)}function Ka(e,t){return e.x===t.x&&e.y===t.y}function zp(e,t,i,r){let a=Xs(Ut(e,t,i)),n=Xs(Ut(e,t,r)),s=Xs(Ut(i,r,e)),o=Xs(Ut(i,r,t));return!!(a!==n&&s!==o||a===0&&Ws(e,i,t)||n===0&&Ws(e,r,t)||s===0&&Ws(i,e,r)||o===0&&Ws(i,t,r))}function Ws(e,t,i){return t.x<=Math.max(e.x,i.x)&&t.x>=Math.min(e.x,i.x)&&t.y<=Math.max(e.y,i.y)&&t.y>=Math.min(e.y,i.y)}function Xs(e){return e>0?1:e<0?-1:0}function ev(e,t){let i=e;do{if(i.i!==e.i&&i.next.i!==e.i&&i.i!==t.i&&i.next.i!==t.i&&zp(i,i.next,e,t))return!0;i=i.next}while(i!==e);return!1}function Yn(e,t){return Ut(e.prev,e,e.next)<0?Ut(e,t,e.next)>=0&&Ut(e,e.prev,t)>=0:Ut(e,t,e.prev)<0||Ut(e,e.next,t)<0}function tv(e,t){let i=e,r=!1,a=(e.x+t.x)/2,n=(e.y+t.y)/2;do i.y>n!=i.next.y>n&&i.next.y!==i.y&&a<(i.next.x-i.x)*(n-i.y)/(i.next.y-i.y)+i.x&&(r=!r),i=i.next;while(i!==e);return r}function Hp(e,t){let i=bh(e.i,e.x,e.y),r=bh(t.i,t.x,t.y),a=e.next,n=t.prev;return e.next=t,t.prev=e,i.next=a,a.prev=i,r.next=i,i.prev=r,n.next=r,r.prev=n,r}function mu(e,t,i,r){let a=bh(e,t,i);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function Zn(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function bh(e,t,i){return{i:e,x:t,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function iv(e,t,i,r){let a=0;for(let n=t,s=i-r;n<i;n+=r)a+=(e[s]-e[n])*(e[n+1]+e[s+1]),s=n;return a}var rv=class{static triangulate(e,t,i=2){return H0(e,t,i)}},mr=class kp{static area(t){let i=t.length,r=0;for(let a=i-1,n=0;n<i;a=n++)r+=t[a].x*t[n].y-t[n].x*t[a].y;return r*.5}static isClockWise(t){return kp.area(t)<0}static triangulateShape(t,i){let r=[],a=[],n=[];gu(t),vu(r,t);let s=t.length;i.forEach(gu);for(let l=0;l<i.length;l++)a.push(s),s+=i[l].length,vu(r,i[l]);let o=rv.triangulate(r,a);for(let l=0;l<o.length;l+=3)n.push(o.slice(l,l+3));return n}};function gu(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function vu(e,t){for(let i=0;i<t.length;i++)e.push(t[i].x),e.push(t[i].y)}var Gp=class Vp extends dt{constructor(t=new is([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),i={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:i},t=Array.isArray(t)?t:[t];let r=this,a=[],n=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];s(h)}this.setAttribute("position",new qe(a,3)),this.setAttribute("uv",new qe(n,2)),this.computeVertexNormals();function s(o){let l=[],h=i.curveSegments!==void 0?i.curveSegments:12,c=i.steps!==void 0?i.steps:1,u=i.depth!==void 0?i.depth:1,p=i.bevelEnabled!==void 0?i.bevelEnabled:!0,d=i.bevelThickness!==void 0?i.bevelThickness:.2,g=i.bevelSize!==void 0?i.bevelSize:d-.1,y=i.bevelOffset!==void 0?i.bevelOffset:0,v=i.bevelSegments!==void 0?i.bevelSegments:3,m=i.extrudePath,f=i.UVGenerator!==void 0?i.UVGenerator:av,S,x=!1,A,b,_,M;if(m){S=m.getSpacedPoints(c),x=!0,p=!1;let ue=m.isCatmullRomCurve3?m.closed:!1;A=m.computeFrenetFrames(c,ue),b=new R,_=new R,M=new R}p||(v=0,d=0,g=0,y=0);let E=o.extractPoints(h),P=E.shape,I=E.holes;if(!mr.isClockWise(P)){P=P.reverse();for(let ue=0,xe=I.length;ue<xe;ue++){let me=I[ue];mr.isClockWise(me)&&(I[ue]=me.reverse())}}function L(ue){let xe=10000000000000001e-36,me=ue[0];for(let ze=1;ze<=ue.length;ze++){let ae=ze%ue.length,te=ue[ae],oe=te.x-me.x,ie=te.y-me.y,be=oe*oe+ie*ie,We=Math.max(Math.abs(te.x),Math.abs(te.y),Math.abs(me.x),Math.abs(me.y)),U=xe*We*We;if(be<=U){ue.splice(ae,1),ze--;continue}me=te}}L(P),I.forEach(L);let Y=I.length,D=P;for(let ue=0;ue<Y;ue++){let xe=I[ue];P=P.concat(xe)}function B(ue,xe,me){return xe||Qe("ExtrudeGeometry: vec does not exist"),ue.clone().addScaledVector(xe,me)}let Z=P.length;function V(ue,xe,me){let ze,ae,te,oe=ue.x-xe.x,ie=ue.y-xe.y,be=me.x-ue.x,We=me.y-ue.y,U=oe*oe+ie*ie,Ie=oe*We-ie*be;if(Math.abs(Ie)>Number.EPSILON){let _e=Math.sqrt(U),Xe=Math.sqrt(be*be+We*We),re=xe.x-ie/_e,et=xe.y+oe/_e,we=me.x-We/Xe,je=me.y+be/Xe,He=((we-re)*We-(je-et)*be)/(oe*We-ie*be);ze=re+oe*He-ue.x,ae=et+ie*He-ue.y;let C=ze*ze+ae*ae;if(C<=2)return new se(ze,ae);te=Math.sqrt(C/2)}else{let _e=!1;oe>Number.EPSILON?be>Number.EPSILON&&(_e=!0):oe<-Number.EPSILON?be<-Number.EPSILON&&(_e=!0):Math.sign(ie)===Math.sign(We)&&(_e=!0),_e?(ze=-ie,ae=oe,te=Math.sqrt(U)):(ze=oe,ae=ie,te=Math.sqrt(U/2))}return new se(ze/te,ae/te)}let pe=[];for(let ue=0,xe=D.length,me=xe-1,ze=ue+1;ue<xe;ue++,me++,ze++)me===xe&&(me=0),ze===xe&&(ze=0),pe[ue]=V(D[ue],D[me],D[ze]);let z=[],W,Q=pe.concat();for(let ue=0,xe=Y;ue<xe;ue++){let me=I[ue];W=[];for(let ze=0,ae=me.length,te=ae-1,oe=ze+1;ze<ae;ze++,te++,oe++)te===ae&&(te=0),oe===ae&&(oe=0),W[ze]=V(me[ze],me[te],me[oe]);z.push(W),Q=Q.concat(W)}let ve;if(v===0)ve=mr.triangulateShape(D,I);else{let ue=[],xe=[];for(let me=0;me<v;me++){let ze=me/v,ae=d*Math.cos(ze*Math.PI/2),te=g*Math.sin(ze*Math.PI/2)+y;for(let oe=0,ie=D.length;oe<ie;oe++){let be=B(D[oe],pe[oe],te);fe(be.x,be.y,-ae),ze===0&&ue.push(be)}for(let oe=0,ie=Y;oe<ie;oe++){let be=I[oe];W=z[oe];let We=[];for(let U=0,Ie=be.length;U<Ie;U++){let _e=B(be[U],W[U],te);fe(_e.x,_e.y,-ae),ze===0&&We.push(_e)}ze===0&&xe.push(We)}}ve=mr.triangulateShape(ue,xe)}let $=ve.length,he=g+y;for(let ue=0;ue<Z;ue++){let xe=p?B(P[ue],Q[ue],he):P[ue];x?(_.copy(A.normals[0]).multiplyScalar(xe.x),b.copy(A.binormals[0]).multiplyScalar(xe.y),M.copy(S[0]).add(_).add(b),fe(M.x,M.y,M.z)):fe(xe.x,xe.y,0)}for(let ue=1;ue<=c;ue++)for(let xe=0;xe<Z;xe++){let me=p?B(P[xe],Q[xe],he):P[xe];x?(_.copy(A.normals[ue]).multiplyScalar(me.x),b.copy(A.binormals[ue]).multiplyScalar(me.y),M.copy(S[ue]).add(_).add(b),fe(M.x,M.y,M.z)):fe(me.x,me.y,u/c*ue)}for(let ue=v-1;ue>=0;ue--){let xe=ue/v,me=d*Math.cos(xe*Math.PI/2),ze=g*Math.sin(xe*Math.PI/2)+y;for(let ae=0,te=D.length;ae<te;ae++){let oe=B(D[ae],pe[ae],ze);fe(oe.x,oe.y,u+me)}for(let ae=0,te=I.length;ae<te;ae++){let oe=I[ae];W=z[ae];for(let ie=0,be=oe.length;ie<be;ie++){let We=B(oe[ie],W[ie],ze);x?fe(We.x,We.y+S[c-1].y,S[c-1].x+me):fe(We.x,We.y,u+me)}}}Pe(),Ye();function Pe(){let ue=a.length/3;if(p){let xe=0,me=Z*xe;for(let ze=0;ze<$;ze++){let ae=ve[ze];rt(ae[2]+me,ae[1]+me,ae[0]+me)}xe=c+v*2,me=Z*xe;for(let ze=0;ze<$;ze++){let ae=ve[ze];rt(ae[0]+me,ae[1]+me,ae[2]+me)}}else{for(let xe=0;xe<$;xe++){let me=ve[xe];rt(me[2],me[1],me[0])}for(let xe=0;xe<$;xe++){let me=ve[xe];rt(me[0]+Z*c,me[1]+Z*c,me[2]+Z*c)}}r.addGroup(ue,a.length/3-ue,0)}function Ye(){let ue=a.length/3,xe=0;Ve(D,xe),xe+=D.length;for(let me=0,ze=I.length;me<ze;me++){let ae=I[me];Ve(ae,xe),xe+=ae.length}r.addGroup(ue,a.length/3-ue,1)}function Ve(ue,xe){let me=ue.length;for(;--me>=0;){let ze=me,ae=me-1;ae<0&&(ae=ue.length-1);for(let te=0,oe=c+v*2;te<oe;te++){let ie=Z*te,be=Z*(te+1),We=xe+ze+ie,U=xe+ae+ie,Ie=xe+ae+be,_e=xe+ze+be;pt(We,U,Ie,_e)}}}function fe(ue,xe,me){l.push(ue),l.push(xe),l.push(me)}function rt(ue,xe,me){Ue(ue),Ue(xe),Ue(me);let ze=a.length/3,ae=f.generateTopUV(r,a,ze-3,ze-2,ze-1);vt(ae[0]),vt(ae[1]),vt(ae[2])}function pt(ue,xe,me,ze){Ue(ue),Ue(xe),Ue(ze),Ue(xe),Ue(me),Ue(ze);let ae=a.length/3,te=f.generateSideWallUV(r,a,ae-6,ae-3,ae-2,ae-1);vt(te[0]),vt(te[1]),vt(te[3]),vt(te[1]),vt(te[2]),vt(te[3])}function Ue(ue){a.push(l[ue*3+0]),a.push(l[ue*3+1]),a.push(l[ue*3+2])}function vt(ue){n.push(ue.x),n.push(ue.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes,r=this.parameters.options;return nv(i,r,t)}static fromJSON(t,i){let r=[];for(let n=0,s=t.shapes.length;n<s;n++){let o=i[t.shapes[n]];r.push(o)}let a=t.options.extrudePath;return a!==void 0&&(t.options.extrudePath=new Jo[a.type]().fromJSON(a)),new Vp(r,t.options)}},av={generateTopUV:function(e,t,i,r,a){let n=t[i*3],s=t[i*3+1],o=t[r*3],l=t[r*3+1],h=t[a*3],c=t[a*3+1];return[new se(n,s),new se(o,l),new se(h,c)]},generateSideWallUV:function(e,t,i,r,a,n){let s=t[i*3],o=t[i*3+1],l=t[i*3+2],h=t[r*3],c=t[r*3+1],u=t[r*3+2],p=t[a*3],d=t[a*3+1],g=t[a*3+2],y=t[n*3],v=t[n*3+1],m=t[n*3+2];return Math.abs(o-c)<Math.abs(s-h)?[new se(s,1-l),new se(h,1-u),new se(p,1-g),new se(y,1-m)]:[new se(o,1-l),new se(c,1-u),new se(d,1-g),new se(v,1-m)]}};function nv(e,t,i){if(i.shapes=[],Array.isArray(e))for(let r=0,a=e.length;r<a;r++){let n=e[r];i.shapes.push(n.uuid)}else i.shapes.push(e.uuid);return i.options=Object.assign({},t),t.extrudePath!==void 0&&(i.options.extrudePath=t.extrudePath.toJSON()),i}var Wp=class Xp extends en{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=[-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,n,t,i),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new Xp(t.radius,t.detail)}},rs=class jp extends dt{constructor(t=[new se(0,-.5),new se(.5,0),new se(0,.5)],i=12,r=0,a=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:i,phiStart:r,phiLength:a},i=Math.floor(i),a=ht(a,0,Math.PI*2);let n=[],s=[],o=[],l=[],h=[],c=1/i,u=new R,p=new se,d=new R,g=new R,y=new R,v=0,m=0;for(let f=0;f<=t.length-1;f++)switch(f){case 0:v=t[f+1].x-t[f].x,m=t[f+1].y-t[f].y,d.x=m*1,d.y=-v,d.z=m*0,y.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:y.normalize(),l.push(y.x,y.y,y.z);break;default:v=t[f+1].x-t[f].x,m=t[f+1].y-t[f].y,d.x=m*1,d.y=-v,d.z=m*0,g.copy(d),d.x+=y.x,d.y+=y.y,d.z+=y.z,d.normalize(),l.push(d.x,d.y,d.z),y.copy(g)}for(let f=0;f<=i;f++){let S=r+f*c*a,x=Math.sin(S),A=Math.cos(S);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*x,u.y=t[b].y,u.z=t[b].x*A,s.push(u.x,u.y,u.z),p.x=f/i,p.y=b/(t.length-1),o.push(p.x,p.y);let _=l[3*b+0]*x,M=l[3*b+1],E=l[3*b+0]*A;h.push(_,M,E)}}for(let f=0;f<i;f++)for(let S=0;S<t.length-1;S++){let x=S+f*t.length,A=x,b=x+t.length,_=x+t.length+1,M=x+1;n.push(A,b,M),n.push(_,M,b)}this.setIndex(n),this.setAttribute("position",new qe(s,3)),this.setAttribute("uv",new qe(o,2)),this.setAttribute("normal",new qe(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jp(t.points,t.segments,t.phiStart,t.phiLength)}},dc=class qp extends en{constructor(t=1,i=0){let r=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(r,a,t,i),this.type="OctahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new qp(t.radius,t.detail)}},Fi=class Yp extends dt{constructor(t=1,i=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:r,heightSegments:a};let n=t/2,s=i/2,o=Math.floor(r),l=Math.floor(a),h=o+1,c=l+1,u=t/o,p=i/l,d=[],g=[],y=[],v=[];for(let m=0;m<c;m++){let f=m*p-s;for(let S=0;S<h;S++){let x=S*u-n;g.push(x,-f,0),y.push(0,0,1),v.push(S/o),v.push(1-m/l)}}for(let m=0;m<l;m++)for(let f=0;f<o;f++){let S=f+h*m,x=f+h*(m+1),A=f+1+h*(m+1),b=f+1+h*m;d.push(S,x,b),d.push(x,A,b)}this.setIndex(d),this.setAttribute("position",new qe(g,3)),this.setAttribute("normal",new qe(y,3)),this.setAttribute("uv",new qe(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yp(t.width,t.height,t.widthSegments,t.heightSegments)}},Zp=class Jp extends dt{constructor(t=.5,i=1,r=32,a=1,n=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:i,thetaSegments:r,phiSegments:a,thetaStart:n,thetaLength:s},r=Math.max(3,r),a=Math.max(1,a);let o=[],l=[],h=[],c=[],u=t,p=(i-t)/a,d=new R,g=new se;for(let y=0;y<=a;y++){for(let v=0;v<=r;v++){let m=n+v/r*s;d.x=u*Math.cos(m),d.y=u*Math.sin(m),l.push(d.x,d.y,d.z),h.push(0,0,1),g.x=(d.x/i+1)/2,g.y=(d.y/i+1)/2,c.push(g.x,g.y)}u+=p}for(let y=0;y<a;y++){let v=y*(r+1);for(let m=0;m<r;m++){let f=m+v,S=f,x=f+r+1,A=f+r+2,b=f+1;o.push(S,x,b),o.push(x,A,b)}}this.setIndex(o),this.setAttribute("position",new qe(l,3)),this.setAttribute("normal",new qe(h,3)),this.setAttribute("uv",new qe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jp(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Kp=class $p extends dt{constructor(t=new is([new se(0,.5),new se(-.5,-.5),new se(.5,-.5)]),i=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:i};let r=[],a=[],n=[],s=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let c=0;c<t.length;c++)h(t[c]),this.addGroup(o,l,c),o+=l,l=0;this.setIndex(r),this.setAttribute("position",new qe(a,3)),this.setAttribute("normal",new qe(n,3)),this.setAttribute("uv",new qe(s,2));function h(c){let u=a.length/3,p=c.extractPoints(i),d=p.shape,g=p.holes;mr.isClockWise(d)===!1&&(d=d.reverse());for(let v=0,m=g.length;v<m;v++){let f=g[v];mr.isClockWise(f)===!0&&(g[v]=f.reverse())}let y=mr.triangulateShape(d,g);for(let v=0,m=g.length;v<m;v++){let f=g[v];d=d.concat(f)}for(let v=0,m=d.length;v<m;v++){let f=d[v];a.push(f.x,f.y,0),n.push(0,0,1),s.push(f.x,f.y)}for(let v=0,m=y.length;v<m;v++){let f=y[v],S=f[0]+u,x=f[1]+u,A=f[2]+u;r.push(S,x,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes;return sv(i,t)}static fromJSON(t,i){let r=[];for(let a=0,n=t.shapes.length;a<n;a++){let s=i[t.shapes[a]];r.push(s)}return new $p(r,t.curveSegments)}};function sv(e,t){if(t.shapes=[],Array.isArray(e))for(let i=0,r=e.length;i<r;i++){let a=e[i];t.shapes.push(a.uuid)}else t.shapes.push(e.uuid);return t}var yi=class Qp extends dt{constructor(t=1,i=32,r=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:i,heightSegments:r,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},i=Math.max(3,Math.floor(i)),r=Math.max(2,Math.floor(r));let l=Math.min(s+o,Math.PI),h=0,c=[],u=new R,p=new R,d=[],g=[],y=[],v=[];for(let m=0;m<=r;m++){let f=[],S=m/r,x=s+S*o,A=t*Math.cos(x),b=Math.sqrt(t*t-A*A),_=0;m===0&&s===0?_=.5/i:m===r&&l===Math.PI&&(_=-.5/i);for(let M=0;M<=i;M++){let E=M/i,P=a+E*n;u.x=-b*Math.cos(P),u.y=A,u.z=b*Math.sin(P),g.push(u.x,u.y,u.z),p.copy(u).normalize(),y.push(p.x,p.y,p.z),v.push(E+_,1-S),f.push(h++)}c.push(f)}for(let m=0;m<r;m++)for(let f=0;f<i;f++){let S=c[m][f+1],x=c[m][f],A=c[m+1][f],b=c[m+1][f+1];(m!==0||s>0)&&d.push(S,x,b),(m!==r-1||l<Math.PI)&&d.push(x,A,b)}this.setIndex(d),this.setAttribute("position",new qe(g,3)),this.setAttribute("normal",new qe(y,3)),this.setAttribute("uv",new qe(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qp(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},ef=class tf extends en{constructor(t=1,i=0){let r=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],a=[2,1,0,0,3,2,1,3,0,2,3,1];super(r,a,t,i),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new tf(t.radius,t.detail)}},Fr=class rf extends dt{constructor(t=1,i=.4,r=12,a=48,n=Math.PI*2,s=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:i,radialSegments:r,tubularSegments:a,arc:n,thetaStart:s,thetaLength:o},r=Math.floor(r),a=Math.floor(a);let l=[],h=[],c=[],u=[],p=new R,d=new R,g=new R;for(let y=0;y<=r;y++){let v=s+y/r*o;for(let m=0;m<=a;m++){let f=m/a*n;d.x=(t+i*Math.cos(v))*Math.cos(f),d.y=(t+i*Math.cos(v))*Math.sin(f),d.z=i*Math.sin(v),h.push(d.x,d.y,d.z),p.x=t*Math.cos(f),p.y=t*Math.sin(f),g.subVectors(d,p).normalize(),c.push(g.x,g.y,g.z),u.push(m/a),u.push(y/r)}}for(let y=1;y<=r;y++)for(let v=1;v<=a;v++){let m=(a+1)*y+v-1,f=(a+1)*(y-1)+v-1,S=(a+1)*(y-1)+v,x=(a+1)*y+v;l.push(m,f,x),l.push(f,S,x)}this.setIndex(l),this.setAttribute("position",new qe(h,3)),this.setAttribute("normal",new qe(c,3)),this.setAttribute("uv",new qe(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rf(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},af=class nf extends dt{constructor(t=1,i=.4,r=64,a=8,n=2,s=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:i,tubularSegments:r,radialSegments:a,p:n,q:s},r=Math.floor(r),a=Math.floor(a);let o=[],l=[],h=[],c=[],u=new R,p=new R,d=new R,g=new R,y=new R,v=new R,m=new R;for(let S=0;S<=r;++S){let x=S/r*n*Math.PI*2;f(x,n,s,t,d),f(x+.01,n,s,t,g),v.subVectors(g,d),m.addVectors(g,d),y.crossVectors(v,m),m.crossVectors(y,v),y.normalize(),m.normalize();for(let A=0;A<=a;++A){let b=A/a*Math.PI*2,_=-i*Math.cos(b),M=i*Math.sin(b);u.x=d.x+(_*m.x+M*y.x),u.y=d.y+(_*m.y+M*y.y),u.z=d.z+(_*m.z+M*y.z),l.push(u.x,u.y,u.z),p.subVectors(u,d).normalize(),h.push(p.x,p.y,p.z),c.push(S/r),c.push(A/a)}}for(let S=1;S<=r;S++)for(let x=1;x<=a;x++){let A=(a+1)*(S-1)+(x-1),b=(a+1)*S+(x-1),_=(a+1)*S+x,M=(a+1)*(S-1)+x;o.push(A,b,M),o.push(b,_,M)}this.setIndex(o),this.setAttribute("position",new qe(l,3)),this.setAttribute("normal",new qe(h,3)),this.setAttribute("uv",new qe(c,2));function f(S,x,A,b,_){let M=Math.cos(S),E=Math.sin(S),P=A/x*S,I=Math.cos(P);_.x=b*(2+I)*.5*M,_.y=b*(2+I)*E*.5,_.z=b*Math.sin(P)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nf(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},sf=class of extends dt{constructor(t=new cc(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),i=64,r=1,a=8,n=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:i,radius:r,radialSegments:a,closed:n};let s=t.computeFrenetFrames(i,n);this.tangents=s.tangents,this.normals=s.normals,this.binormals=s.binormals;let o=new R,l=new R,h=new se,c=new R,u=[],p=[],d=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new qe(u,3)),this.setAttribute("normal",new qe(p,3)),this.setAttribute("uv",new qe(d,2));function y(){for(let S=0;S<i;S++)v(S);v(n===!1?i:0),f(),m()}function v(S){c=t.getPointAt(S/i,c);let x=s.normals[S],A=s.binormals[S];for(let b=0;b<=a;b++){let _=b/a*Math.PI*2,M=Math.sin(_),E=-Math.cos(_);l.x=E*x.x+M*A.x,l.y=E*x.y+M*A.y,l.z=E*x.z+M*A.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=c.x+r*l.x,o.y=c.y+r*l.y,o.z=c.z+r*l.z,u.push(o.x,o.y,o.z)}}function m(){for(let S=1;S<=i;S++)for(let x=1;x<=a;x++){let A=(a+1)*(S-1)+(x-1),b=(a+1)*S+(x-1),_=(a+1)*S+x,M=(a+1)*(S-1)+x;g.push(A,b,M),g.push(b,_,M)}}function f(){for(let S=0;S<=i;S++)for(let x=0;x<=a;x++)h.x=S/i,h.y=x/a,d.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new of(new Jo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},lf=class extends dt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,r=new R,a=new R;if(e.index!==null){let n=e.attributes.position,s=e.index,o=e.groups;o.length===0&&(o=[{start:0,count:s.count,materialIndex:0}]);for(let l=0,h=o.length;l<h;++l){let c=o[l],u=c.start,p=c.count;for(let d=u,g=u+p;d<g;d+=3)for(let y=0;y<3;y++){let v=s.getX(d+y),m=s.getX(d+(y+1)%3);r.fromBufferAttribute(n,v),a.fromBufferAttribute(n,m),_u(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}}else{let n=e.attributes.position;for(let s=0,o=n.count/3;s<o;s++)for(let l=0;l<3;l++){let h=3*s+l,c=3*s+(l+1)%3;r.fromBufferAttribute(n,h),a.fromBufferAttribute(n,c),_u(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}this.setAttribute("position",new qe(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function _u(e,t,i){let r=`${e.x},${e.y},${e.z}-${t.x},${t.y},${t.z}`,a=`${t.x},${t.y},${t.z}-${e.x},${e.y},${e.z}`;return i.has(r)===!0||i.has(a)===!0?!1:(i.add(r),i.add(a),!0)}var yu=Object.freeze({__proto__:null,BoxGeometry:Qt,CapsuleGeometry:fl,CircleGeometry:Ep,ConeGeometry:pa,CylinderGeometry:kt,DodecahedronGeometry:Cp,EdgesGeometry:Ip,ExtrudeGeometry:Gp,IcosahedronGeometry:Wp,LatheGeometry:rs,OctahedronGeometry:dc,PlaneGeometry:Fi,PolyhedronGeometry:en,RingGeometry:Zp,ShapeGeometry:Kp,SphereGeometry:yi,TetrahedronGeometry:ef,TorusGeometry:Fr,TorusKnotGeometry:af,TubeGeometry:sf,WireframeGeometry:lf}),hf=class extends ii{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ke(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function $a(e){let t={};for(let i in e){t[i]={};for(let r in e[i]){let a=e[i][r];if(xu(a))a.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][r]=null):t[i][r]=a.clone();else if(Array.isArray(a))if(xu(a[0])){let n=[];for(let s=0,o=a.length;s<o;s++)n[s]=a[s].clone();t[i][r]=n}else t[i][r]=a.slice();else t[i][r]=a}}return t}function fi(e){let t={};for(let i=0;i<e.length;i++){let r=$a(e[i]);for(let a in r)t[a]=r[a]}return t}function xu(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ov(e){let t=[];for(let i=0;i<e.length;i++)t.push(e[i].clone());return t}function cf(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:yt.workingColorSpace}var uf={clone:$a,merge:fi},lv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Sr=class extends ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lv,this.fragmentShader=hv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$a(e.uniforms),this.uniformsGroups=ov(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new ke().setHex(r.value);break;case"v2":this.uniforms[i].value=new se().fromArray(r.value);break;case"v3":this.uniforms[i].value=new R().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Ct().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ut().fromArray(r.value);break;case"m4":this.uniforms[i].value=new lt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},pc=class extends Sr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ri=class extends ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},df=class extends ri{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return gr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){gr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},pf=class extends ii{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ke(16777215),this.specular=new ke(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=$n,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ff=class extends ii{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ke(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},mf=class extends ii{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},fa=class extends ii{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=$n,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},fc=class extends ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},mc=class extends ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},gf=class extends ii{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ke(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}},vf=class extends _i{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Wi(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function Wa(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function _f(e){function t(a,n){return e[a]-e[n]}let i=e.length,r=new Array(i);for(let a=0;a!==i;++a)r[a]=a;return r.sort(t),r}function Eh(e,t,i){let r=e.length,a=new e.constructor(r);for(let n=0,s=0;s!==r;++n){let o=i[n]*t;for(let l=0;l!==t;++l)a[s++]=e[o+l]}return a}function yf(e,t,i,r){let a=1,n=e[0];for(;n!==void 0&&n[r]===void 0;)n=e[a++];if(n===void 0)return;let s=n[r];if(s!==void 0)if(Array.isArray(s))do s=n[r],s!==void 0&&(t.push(n.time),i.push(...s)),n=e[a++];while(n!==void 0);else if(s.toArray!==void 0)do s=n[r],s!==void 0&&(t.push(n.time),s.toArray(i,i.length)),n=e[a++];while(n!==void 0);else do s=n[r],s!==void 0&&(t.push(n.time),i.push(s)),n=e[a++];while(n!==void 0)}function cv(e,t,i,r,a=30){let n=e.clone();n.name=t;let s=[];for(let l=0;l<n.tracks.length;++l){let h=n.tracks[l],c=h.getValueSize(),u=[],p=[];for(let d=0;d<h.times.length;++d){let g=h.times[d]*a;if(!(g<i||g>=r)){u.push(h.times[d]);for(let y=0;y<c;++y)p.push(h.values[d*c+y])}}u.length!==0&&(h.times=Wi(u,h.times.constructor),h.values=Wi(p,h.values.constructor),s.push(h))}n.tracks=s;let o=1/0;for(let l=0;l<n.tracks.length;++l)o>n.tracks[l].times[0]&&(o=n.tracks[l].times[0]);for(let l=0;l<n.tracks.length;++l)n.tracks[l].shift(-1*o);return n.resetDuration(),n}function uv(e,t=0,i=e,r=30){r<=0&&(r=30);let a=i.tracks.length,n=t/r;for(let s=0;s<a;++s){let o=i.tracks[s],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;let h=e.tracks.find(function(m){return m.name===o.name&&m.ValueTypeName===l});if(h===void 0)continue;let c=0,u=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(c=u/3);let p=0,d=h.getValueSize();h.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(p=d/3);let g=o.times.length-1,y;if(n<=o.times[0]){let m=c,f=u-c;y=o.values.slice(m,f)}else if(n>=o.times[g]){let m=g*u+c,f=m+u-c;y=o.values.slice(m,f)}else{let m=o.createInterpolant();m.evaluate(n),y=m.resultBuffer.slice()}l==="quaternion"&&new Bt().fromArray(y).normalize().conjugate().toArray(y);let v=h.times.length;for(let m=0;m<v;++m){let f=m*d+p;if(l==="quaternion")Bt.multiplyQuaternionsFlat(h.values,f,y,0,h.values,f);else{let S=d-p*2;for(let x=0;x<S;++x)h.values[f+x]-=y[x]}}}return e.blendMode=Xh,e}var dv=class{static convertArray(e,t){return Wi(e,t)}static isTypedArray(e){return jd(e)}static hasTangents(e){return Wa(e)}static getKeyframeOrder(e){return _f(e)}static sortedArray(e,t,i){return Eh(e,t,i)}static flattenJSON(e,t,i,r){yf(e,t,i,r)}static subclip(e,t,i,r,a=30){return cv(e,t,i,r,a)}static makeClipAdditive(e,t=0,i=e,r=30){return uv(e,t,i,r)}},tn=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],a=t[i-1];e:{t:{let n;i:{r:if(!(e<r)){for(let s=i+2;;){if(r===void 0){if(e<a)break r;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===s)break;if(a=r,r=t[++i],e<r)break t}n=t.length;break i}if(!(e>=a)){let s=t[1];e<s&&(i=2,a=s);for(let o=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===o)break;if(r=a,a=t[--i-1],e>=a)break t}n=i,i=0;break i}break e}for(;i<n;){let s=i+n>>>1;e<t[s]?n=s:i=s+1}if(r=t[i],a=t[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,r)}return this.interpolate_(i,a,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,a=e*r;for(let n=0;n!==r;++n)t[n]=i[a+n];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},xf=class extends tn{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ia,endingEnd:ia}}intervalChanged_(e,t,i){let r=this.parameterPositions,a=e-2,n=e+1,s=r[a],o=r[n];if(s===void 0)switch(this.getSettings_().endingStart){case ra:a=e,s=2*t-i;break;case Hn:a=r.length-2,s=t+r[a]-r[a+1];break;default:a=e,s=i}if(o===void 0)switch(this.getSettings_().endingEnd){case ra:n=e,o=2*i-t;break;case Hn:n=1,o=i+r[1]-r[0];break;default:n=e-1,o=t}let l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-s),this._weightNext=l/(o-i),this._offsetPrev=a*h,this._offsetNext=n*h}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this._offsetPrev,c=this._offsetNext,u=this._weightPrev,p=this._weightNext,d=(i-t)/(r-t),g=d*d,y=g*d,v=-u*y+2*u*g-u*d,m=(1+u)*y+(-1.5-2*u)*g+(-.5+u)*d+1,f=(-1-p)*y+(1.5+p)*g+.5*d,S=p*y-p*g;for(let x=0;x!==s;++x)a[x]=v*n[h+x]+m*n[l+x]+f*n[o+x]+S*n[c+x];return a}},gc=class extends tn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=(i-t)/(r-t),c=1-h;for(let u=0;u!==s;++u)a[u]=n[l+u]*c+n[o+u]*h;return a}},Sf=class extends tn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Mf=class extends tn{interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this.inTangents,c=this.outTangents;if(!h||!c){let d=(i-t)/(r-t),g=1-d;for(let y=0;y!==s;++y)a[y]=n[l+y]*g+n[o+y]*d;return a}let u=s*2,p=e-1;for(let d=0;d!==s;++d){let g=n[l+d],y=n[o+d],v=p*u+d*2,m=c[v],f=c[v+1],S=e*u+d*2,x=h[S],A=h[S+1],b=fv(i,t,m,x,r);a[d]=bf(b,g,f,A,y)}return a}};function bf(e,t,i,r,a){let n=1-e;return n*n*n*t+3*n*n*e*i+3*n*e*e*r+e*e*e*a}function pv(e,t,i,r,a){let n=1-e;return 3*n*n*(i-t)+6*n*e*(r-i)+3*e*e*(a-r)}function fv(e,t,i,r,a){let n=(e-t)/(a-t);for(let s=0;s<8;s++){let o=bf(n,t,i,r,a)-e;if(Math.abs(o)<1e-10)break;let l=pv(n,t,i,r,a);if(Math.abs(l)<1e-10)break;n=Math.max(0,Math.min(1,n-o/l))}return n}var Bi=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wi(t,this.TimeBufferType),this.values=Wi(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Wi(e.times,Array),values:Wi(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),Wa(e.settings)&&(i.settings={inTangents:Wi(e.settings.inTangents,Array),outTangents:Wi(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Sf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new gc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new xf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Mf(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case zn:t=this.InterpolantFactoryMethodDiscrete;break;case qo:t=this.InterpolantFactoryMethodLinear;break;case ro:t=this.InterpolantFactoryMethodSmooth;break;case yh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Le("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zn;case this.InterpolantFactoryMethodLinear:return qo;case this.InterpolantFactoryMethodSmooth:return ro;case this.InterpolantFactoryMethodBezier:return yh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e;Wa(this.settings)&&(Su(this.settings.inTangents,e),Su(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;Wa(this.settings)&&(Mu(this.settings.inTangents,e),Mu(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,a=0,n=r-1;for(;a!==r&&i[a]<e;)++a;for(;n!==-1&&i[n]>t;)--n;if(++n,a!==0||n!==r){a>=n&&(n=Math.max(n,1),a=n-1);let s=this.getValueSize();this.times=i.slice(a,n),this.values=this.values.slice(a*s,n*s)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Qe("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,a=i.length;a===0&&(Qe("KeyframeTrack: Track is empty.",this),e=!1);let n=null;for(let s=0;s!==a;s++){let o=i[s];if(typeof o=="number"&&isNaN(o)){Qe("KeyframeTrack: Time is not a valid number.",this,s,o),e=!1;break}if(n!==null&&n>o){Qe("KeyframeTrack: Out of order keys.",this,s,o,n),e=!1;break}n=o}if(r!==void 0&&jd(r))for(let s=0,o=r.length;s!==o;++s){let l=r[s];if(isNaN(l)){Qe("KeyframeTrack: Value is not a valid number.",this,s,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===ro,a=e.length-1,n=1;for(let s=1;s<a;++s){let o=!1,l=e[s],h=e[s+1];if(l!==h&&(s!==1||l!==e[0]))if(r)o=!0;else{let c=s*i,u=c-i,p=c+i;for(let d=0;d!==i;++d){let g=t[c+d];if(g!==t[u+d]||g!==t[p+d]){o=!0;break}}}if(o){if(s!==n){e[n]=e[s];let c=s*i,u=n*i;for(let p=0;p!==i;++p)t[u+p]=t[c+p]}++n}}if(a>0){e[n]=e[a];for(let s=a*i,o=n*i,l=0;l!==i;++l)t[o+l]=t[s+l];++n}return n!==e.length?(this.times=e.slice(0,n),this.values=t.slice(0,n*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,Wa(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Su(e,t){for(let i=0,r=e.length;i!==r;i+=2)e[i]+=t}function Mu(e,t){for(let i=0,r=e.length;i!==r;i+=2)e[i]*=t}Bi.prototype.ValueTypeName="";Bi.prototype.TimeBufferType=Float32Array;Bi.prototype.ValueBufferType=Float32Array;Bi.prototype.DefaultInterpolation=qo;var ma=class extends Bi{constructor(e,t,i){super(e,t,i)}};ma.prototype.ValueTypeName="bool";ma.prototype.ValueBufferType=Array;ma.prototype.DefaultInterpolation=zn;ma.prototype.InterpolantFactoryMethodLinear=void 0;ma.prototype.InterpolantFactoryMethodSmooth=void 0;var vc=class extends Bi{constructor(e,t,i,r){super(e,t,i,r)}};vc.prototype.ValueTypeName="color";var gl=class extends Bi{constructor(e,t,i,r){super(e,t,i,r)}};gl.prototype.ValueTypeName="number";var Ef=class extends tn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=(i-t)/(r-t),l=e*s;for(let h=l+s;l!==h;l+=4)Bt.slerpFlat(a,0,n,l-s,n,l,o);return a}},vl=class extends Bi{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new Ef(this.times,this.values,this.getValueSize(),e)}};vl.prototype.ValueTypeName="quaternion";vl.prototype.InterpolantFactoryMethodSmooth=void 0;var ga=class extends Bi{constructor(e,t,i){super(e,t,i)}};ga.prototype.ValueTypeName="string";ga.prototype.ValueBufferType=Array;ga.prototype.DefaultInterpolation=zn;ga.prototype.InterpolantFactoryMethodLinear=void 0;ga.prototype.InterpolantFactoryMethodSmooth=void 0;var _c=class extends Bi{constructor(e,t,i,r){super(e,t,i,r)}};_c.prototype.ValueTypeName="vector";var Jn=class{constructor(e="",t=-1,i=[],r=nl){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=Oi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,r=1/(e.fps||1);for(let n=0,s=i.length;n!==s;++n)t.push(gv(i[n]).scale(r));let a=new this(e.name,e.duration,t,e.blendMode);return a.uuid=e.uuid,a.userData=JSON.parse(e.userData||"{}"),a}static toJSON(e){let t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let a=0,n=i.length;a!==n;++a)t.push(Bi.toJSON(i[a]));return r}static CreateFromMorphTargetSequence(e,t,i,r){let a=t.length,n=[];for(let s=0;s<a;s++){let o=[],l=[];o.push((s+a-1)%a,s,(s+1)%a),l.push(0,1,0);let h=_f(o);o=Eh(o,1,h),l=Eh(l,1,h),!r&&o[0]===0&&(o.push(a),l.push(l[0])),n.push(new gl(".morphTargetInfluences["+t[s].name+"]",o,l).scale(1/i))}return new this(e,-1,n)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let r={},a=/^([\w-]*?)([\d]+)$/;for(let s=0,o=e.length;s<o;s++){let l=e[s],h=l.name.match(a);if(h&&h.length>1){let c=h[1],u=r[c];u||(r[c]=u=[]),u.push(l)}}let n=[];for(let s in r)n.push(this.CreateFromMorphTargetSequence(s,r[s],t,i));return n}resetDuration(){let e=this.tracks,t=0;for(let i=0,r=e.length;i!==r;++i){let a=this.tracks[i];t=Math.max(t,a.times[a.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function mv(e){switch(e.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return gl;case"vector":case"vector2":case"vector3":case"vector4":return _c;case"color":return vc;case"quaternion":return vl;case"bool":case"boolean":return ma;case"string":return ga}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+e)}function gv(e){if(e.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=mv(e.type);if(e.times===void 0){let r=[],a=[];yf(e.keys,r,a,"value"),e.times=r,e.values=a}let i;return t.parse!==void 0?i=t.parse(e):i=new t(e.name,e.times,e.values,e.interpolation),Wa(e.settings)&&(i.settings={inTangents:Wi(e.settings.inTangents,Float32Array),outTangents:Wi(e.settings.outTangents,Float32Array)}),i}var ir={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(bu(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!bu(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function bu(e){try{let t=e.slice(e.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var yc=class{constructor(e,t,i){let r=this,a=!1,n=0,s=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){s++,a===!1&&r.onStart!==void 0&&r.onStart(h,n,s),a=!0},this.itemEnd=function(h){n++,r.onProgress!==void 0&&r.onProgress(h,n,s),n===s&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),o?o(h):h},this.setURLModifier=function(h){return o=h,this},this.addHandler=function(h,c){return l.push(h,c),this},this.removeHandler=function(h){let c=l.indexOf(h);return c!==-1&&l.splice(c,2),this},this.getHandler=function(h){for(let c=0,u=l.length;c<u;c+=2){let p=l[c],d=l[c+1];if(p.global&&(p.lastIndex=0),p.test(h))return d}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wf=new yc,Ei=class{constructor(e){this.manager=e!==void 0?e:wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,a){i.load(e,r,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Ei.DEFAULT_MATERIAL_NAME="__DEFAULT";var ur={},vv=class extends Error{constructor(e,t){super(e),this.response=t}},Mr=class extends Ei{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=ir.get(`file:${e}`);if(a!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(a),this.manager.itemEnd(e)},0);return}if(ur[e]!==void 0){ur[e].push({onLoad:t,onProgress:i,onError:r});return}ur[e]=[],ur[e].push({onLoad:t,onProgress:i,onError:r});let n=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),s=this.mimeType,o=this.responseType;fetch(n).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Le("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=ur[e],c=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),p=u?parseInt(u):0,d=p!==0,g=0,y=new ReadableStream({start(v){m();function m(){c.read().then(({done:f,value:S})=>{if(f)v.close();else{g+=S.byteLength;let x=new ProgressEvent("progress",{lengthComputable:d,loaded:g,total:p});for(let A=0,b=h.length;A<b;A++){let _=h[A];_.onProgress&&_.onProgress(x)}v.enqueue(S),m()}},f=>{v.error(f)})}}});return new Response(y)}else throw new vv(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,s));case"json":return l.json();default:if(s==="")return l.text();{let h=/charset="?([^;"\s]*)"?/i.exec(s),c=h&&h[1]?h[1].toLowerCase():void 0,u=new TextDecoder(c);return l.arrayBuffer().then(p=>u.decode(p))}}}).then(l=>{ir.add(`file:${e}`,l);let h=ur[e];delete ur[e];for(let c=0,u=h.length;c<u;c++){let p=h[c];p.onLoad&&p.onLoad(l)}}).catch(l=>{let h=ur[e];if(h===void 0)throw this.manager.itemError(e),l;delete ur[e];for(let c=0,u=h.length;c<u;c++){let p=h[c];p.onError&&p.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},_v=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new Mr(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setPath(this.path),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials),n.load(e,function(s){try{t(a.parse(JSON.parse(s)))}catch(o){r?r(o):Qe(o),a.manager.itemError(e)}},i,r)}parse(e){let t=[];for(let i=0;i<e.length;i++){let r=Jn.parse(e[i]);t.push(r)}return t}},yv=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=[],s=new pl,o=new Mr(this.manager);o.setPriority(this.priority),o.setCache(this.cache),o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(a.withCredentials);let l=0;function h(c){o.load(e[c],function(u){let p=a.parse(u,!0);n[c]={width:p.width,height:p.height,format:p.format,mipmaps:p.mipmaps},l+=1,l===6&&(p.mipmapCount===1&&(s.minFilter=Nt),s.image=n,s.format=p.format,s.needsUpdate=!0,t&&t(s))},i,r)}if(Array.isArray(e))for(let c=0,u=e.length;c<u;++c)h(c);else o.load(e,function(c){let u=a.parse(c,!0);if(u.isCubemap){let p=u.mipmaps.length/u.mipmapCount;for(let d=0;d<p;d++){n[d]={mipmaps:[]};for(let g=0;g<u.mipmapCount;g++)n[d].mipmaps.push(u.mipmaps[d*u.mipmapCount+g]),n[d].format=u.format,n[d].width=u.width,n[d].height=u.height}s.image=n}else s.image.width=u.width,s.image.height=u.height,s.mipmaps=u.mipmaps;u.mipmapCount===1&&(s.minFilter=Nt),s.format=u.format,s.needsUpdate=!0,t&&t(s)},i,r);return s}},Ua=new WeakMap,Kn=class extends Ei{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,n=ir.get(`image:${e}`);if(n!==void 0){if(n.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(n),a.manager.itemEnd(e)},0);else{let c=Ua.get(n);c===void 0&&(c=[],Ua.set(n,c)),c.push({onLoad:t,onError:r})}return n}let s=Vn("img");function o(){h(),t&&t(this);let c=Ua.get(this)||[];for(let u=0;u<c.length;u++){let p=c[u];p.onLoad&&p.onLoad(this)}Ua.delete(this),a.manager.itemEnd(e)}function l(c){h(),r&&r(c),ir.remove(`image:${e}`);let u=Ua.get(this)||[];for(let p=0;p<u.length;p++){let d=u[p];d.onError&&d.onError(c)}Ua.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){s.removeEventListener("load",o,!1),s.removeEventListener("error",l,!1)}return s.addEventListener("load",o,!1),s.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(s.crossOrigin=this.crossOrigin),ir.add(`image:${e}`,s),a.manager.itemStart(e),s.fetchPriority=this.priority,s.src=e,s}},xv=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=new ts;a.colorSpace=Xt;let n=new Kn(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setCrossOrigin(this.crossOrigin),n.setPath(this.path);let s=0;function o(l){n.load(e[l],function(h){a.images[l]=h,s++,s===6&&(a.needsUpdate=!0,t&&t(a))},void 0,r)}for(let l=0;l<e.length;++l)o(l);return a}},Sv=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new Ui,s=new Mr(this.manager);return s.setPriority(this.priority),s.setCache(this.cache),s.setResponseType("arraybuffer"),s.setRequestHeader(this.requestHeader),s.setPath(this.path),s.setWithCredentials(a.withCredentials),s.load(e,function(o){let l;try{l=a.parse(o)}catch(h){r!==void 0?r(h):Qe(h);return}a._applyTexData(n,l),t&&t(n,l)},i,r),n}createDataTexture(e){let t=new Ui;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:Kt,e.wrapT=t.wrapT!==void 0?t.wrapT:Kt,e.magFilter=t.magFilter!==void 0?t.magFilter:Nt,e.minFilter=t.minFilter!==void 0?t.minFilter:Nt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=ji),t.mipmapCount===1&&(e.minFilter=Nt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},xc=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=new Yt,n=new Kn(this.manager);return n.setPriority(this.priority),n.setCache(this.cache),n.setCrossOrigin(this.crossOrigin),n.setPath(this.path),n.load(e,function(s){a.image=s,a.needsUpdate=!0,t!==void 0&&t(a)},i,r),a}},Br=class extends Et{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},_l=class extends Br{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},sh=new lt,Eu=new R,wu=new R,yl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.mapType=Mi,this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ca,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Eu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Eu),wu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,r){sh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(sh,e.coordinateSystem,e.reversedDepth);let a=this._frameExtents,n=r?r.z/a.x:1,s=r?r.w/a.y:1,o=r?r.x/a.x:0,l=r?r.y/a.y:0;e.coordinateSystem===ha||e.reversedDepth?t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,1,0,0,0,0,1):t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,.5,.5,0,0,0,1),t.multiply(sh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},js=new R,qs=new Bt,Qi=new R,xl=class extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=Ci,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(js,qs,Qi),Qi.x===1&&Qi.y===1&&Qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(js,qs,Qi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(js,qs,Qi),Qi.x===1&&Qi.y===1&&Qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(js,qs,Qi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Rr=new R,Tu=new se,Au=new se,Jt=class extends xl{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Za*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Rr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Rr.x,Rr.y).multiplyScalar(-e/Rr.z),Rr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Rr.x,Rr.y).multiplyScalar(-e/Rr.z)}getViewSize(e,t){return this.getViewBounds(e,Tu,Au),t.subVectors(Au,Tu)}setViewOffset(e,t,i,r,a,n){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(sa*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,a=-.5*r,n=this.view;if(this.view!==null&&this.view.enabled){let o=n.fullWidth,l=n.fullHeight;a+=n.offsetX*r/o,t-=n.offsetY*i/l,r*=n.width/o,i*=n.height/l}let s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Mv=class extends yl{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=Za*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||t.far;(i!==t.fov||r!==t.aspect||a!==t.far)&&(t.fov=i,t.aspect=r,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Tf=class extends Br{constructor(e,t,i=0,r=Math.PI/3,a=0,n=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.distance=i,this.angle=r,this.penumbra=a,this.decay=n,this.map=null,this.shadow=new Mv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},bv=class extends yl{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0}},Af=class extends Br{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new bv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Sl=class extends xl{constructor(e=-1,t=1,i=1,r=-1,a=.1,n=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=a,this.far=n,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,a,n){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,a=i-e,n=i+e,s=r+t,o=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,n=a+l*this.view.width,s-=h*this.view.offsetY,o=s-h*this.view.height}this.projectionMatrix.makeOrthographic(a,n,s,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ev=class extends yl{constructor(){super(new Sl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ml=class extends Br{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new Ev}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Rf=class extends Br{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}},Cf=class extends Br{constructor(e,t,i=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=i,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}},Sc=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new R)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let i=e.x,r=e.y,a=e.z,n=this.coefficients;return t.copy(n[0]).multiplyScalar(.282095),t.addScaledVector(n[1],.488603*r),t.addScaledVector(n[2],.488603*a),t.addScaledVector(n[3],.488603*i),t.addScaledVector(n[4],1.092548*(i*r)),t.addScaledVector(n[5],1.092548*(r*a)),t.addScaledVector(n[6],.315392*(3*a*a-1)),t.addScaledVector(n[7],1.092548*(i*a)),t.addScaledVector(n[8],.546274*(i*i-r*r)),t}getIrradianceAt(e,t){let i=e.x,r=e.y,a=e.z,n=this.coefficients;return t.copy(n[0]).multiplyScalar(.886227),t.addScaledVector(n[1],2*.511664*r),t.addScaledVector(n[2],2*.511664*a),t.addScaledVector(n[3],2*.511664*i),t.addScaledVector(n[4],2*.429043*i*r),t.addScaledVector(n[5],2*.429043*r*a),t.addScaledVector(n[6],.743125*a*a-.247708),t.addScaledVector(n[7],2*.429043*i*a),t.addScaledVector(n[8],.429043*(i*i-r*r)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let i=0;i<9;i++)this.coefficients[i].addScaledVector(e.coefficients[i],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let i=0;i<9;i++)this.coefficients[i].lerp(e.coefficients[i],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let i=this.coefficients;for(let r=0;r<9;r++)i[r].fromArray(e,t+r*3);return this}toArray(e=[],t=0){let i=this.coefficients;for(let r=0;r<9;r++)i[r].toArray(e,t+r*3);return e}static getBasisAt(e,t){let i=e.x,r=e.y,a=e.z;t[0]=.282095,t[1]=.488603*r,t[2]=.488603*a,t[3]=.488603*i,t[4]=1.092548*i*r,t[5]=1.092548*r*a,t[6]=.315392*(3*a*a-1),t[7]=1.092548*i*a,t[8]=.546274*(i*i-r*r)}},Pf=class extends Br{constructor(e=new Sc,t=1){super(void 0,t),this.isLightProbe=!0,this.type="LightProbe",this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}},Ru={},If=class Lf extends Ei{constructor(t){super(t),this.textures={}}load(t,i,r,a){let n=this,s=new Mr(n.manager);s.setPriority(n.priority),s.setCache(n.cache),s.setPath(n.path),s.setRequestHeader(n.requestHeader),s.setWithCredentials(n.withCredentials),s.load(t,function(o){try{i(n.parse(JSON.parse(o)))}catch(l){a?a(l):Qe(l),n.manager.itemError(t)}},r,a)}parse(t){let i=this.createMaterialFromType(t.type);return i.fromJSON(t,this.textures),i}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return Lf.createMaterialFromType(t)}static createMaterialFromType(t){let i={ShadowMaterial:hf,SpriteMaterial:Qh,RawShaderMaterial:pc,ShaderMaterial:Sr,PointsMaterial:ic,MeshPhysicalMaterial:df,MeshStandardMaterial:ri,MeshPhongMaterial:pf,MeshToonMaterial:ff,MeshNormalMaterial:mf,MeshLambertMaterial:fa,MeshDepthMaterial:fc,MeshDistanceMaterial:mc,MeshBasicMaterial:vi,MeshMatcapMaterial:gf,LineDashedMaterial:vf,LineBasicMaterial:_i,Material:ii,...Ru}[t],r;return i===void 0?(gr(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),r=new ii):r=new i,r}static registerMaterial(t,i){Ru[t]=i}},wh=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Df=class extends dt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Uf=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new Mr(a.manager);n.setPriority(a.priority),n.setCache(a.cache),n.setPath(a.path),n.setRequestHeader(a.requestHeader),n.setWithCredentials(a.withCredentials),n.load(e,function(s){try{t(a.parse(JSON.parse(s)))}catch(o){r?r(o):Qe(o),a.manager.itemError(e)}},i,r)}parse(e){let t={},i={};function r(u,p){if(t[p]!==void 0)return t[p];let d=u.interleavedBuffers[p],g=a(u,d.buffer),y=Va(d.type,g),v=new dl(y,d.stride);return v.uuid=d.uuid,d.usage!==void 0&&v.setUsage(d.usage),t[p]=v,v}function a(u,p){if(i[p]!==void 0)return i[p];let d=u.arrayBuffers[p],g=new Uint32Array(d).buffer;return i[p]=g,g}let n=e.isInstancedBufferGeometry?new Df:new dt,s=e.data.index;if(s!==void 0){let u=Va(s.type,s.array);n.setIndex(new Dt(u,1))}let o=e.data.attributes;for(let u in o){let p=o[u],d;if(p.isInterleavedBufferAttribute){let g=r(e.data,p.data);d=new Xn(g,p.itemSize,p.offset,p.normalized)}else{let g=Va(p.type,p.array),y=p.isInstancedBufferAttribute?Ja:Dt;d=new y(g,p.itemSize,p.normalized)}p.name!==void 0&&(d.name=p.name),p.usage!==void 0&&d.setUsage(p.usage),p.gpuType!==void 0&&(d.gpuType=p.gpuType),n.setAttribute(u,d)}let l=e.data.morphAttributes;if(l)for(let u in l){let p=l[u],d=[];for(let g=0,y=p.length;g<y;g++){let v=p[g],m;if(v.isInterleavedBufferAttribute){let f=r(e.data,v.data);m=new Xn(f,v.itemSize,v.offset,v.normalized)}else{let f=Va(v.type,v.array);m=new Dt(f,v.itemSize,v.normalized)}v.name!==void 0&&(m.name=v.name),v.usage!==void 0&&m.setUsage(v.usage),v.gpuType!==void 0&&(m.gpuType=v.gpuType),d.push(m)}n.morphAttributes[u]=d}e.data.morphTargetsRelative&&(n.morphTargetsRelative=!0);let h=e.data.groups||e.data.drawcalls||e.data.offsets;if(h!==void 0)for(let u=0,p=h.length;u!==p;++u){let d=h[u];n.addGroup(d.start,d.count,d.materialIndex)}let c=e.data.boundingSphere;return c!==void 0&&(n.boundingSphere=new ti().fromJSON(c)),e.name&&(n.name=e.name),e.userData&&(n.userData=e.userData),n}},oh={},wv=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=this.path===""?wh.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||n;let s=new Mr(this.manager);s.setPriority(this.priority),s.setCache(this.cache),s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(o){let l=null;try{l=JSON.parse(o)}catch(c){r!==void 0&&r(c),Qe("ObjectLoader: Can't parse "+e+".",c.message);return}let h=l.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){r!==void 0&&r(new Error("THREE.ObjectLoader: Can't load "+e)),Qe("ObjectLoader: Can't load "+e);return}a.parse(l,t)},i,r)}async loadAsync(e,t){let i=this,r=this.path===""?wh.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||r;let a=new Mr(this.manager);a.setPriority(this.priority),a.setCache(this.cache),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials);let n=await a.loadAsync(e,t),s;try{s=JSON.parse(n)}catch(l){throw new Error("THREE.ObjectLoader: Can't parse "+e+". "+l.message)}let o=s.metadata;if(o===void 0||o.type===void 0||o.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await i.parseAsync(s)}parse(e,t){let i=this.parseAnimations(e.animations),r=this.parseShapes(e.shapes),a=this.parseGeometries(e.geometries,r),n=this.parseImages(e.images,function(){t!==void 0&&t(l)}),s=this.parseTextures(e.textures,n),o=this.parseMaterials(e.materials,s),l=this.parseObject(e.object,a,o,s,i),h=this.parseSkeletons(e.skeletons,l);if(this.bindSkeletons(l,h),this.bindLightTargets(l),t!==void 0){let c=!1;for(let u in n)if(n[u].data instanceof HTMLImageElement){c=!0;break}c===!1&&t(l)}return l}async parseAsync(e){let t=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),a=await this.parseImagesAsync(e.images),n=this.parseTextures(e.textures,a),s=this.parseMaterials(e.materials,n),o=this.parseObject(e.object,r,s,n,t),l=this.parseSkeletons(e.skeletons,o);return this.bindSkeletons(o,l),this.bindLightTargets(o),o}static registerGeometry(e,t){oh[e]=t}parseShapes(e){let t={};if(e!==void 0)for(let i=0,r=e.length;i<r;i++){let a=new is().fromJSON(e[i]);t[a.uuid]=a}return t}parseSkeletons(e,t){let i={},r={};if(t.traverse(function(a){a.isBone&&(r[a.uuid]=a)}),e!==void 0)for(let a=0,n=e.length;a<n;a++){let s=new mp().fromJSON(e[a],r);i[s.uuid]=s}return i}parseGeometries(e,t){let i={};if(e!==void 0){let r=new Uf;for(let a=0,n=e.length;a<n;a++){let s,o=e[a];switch(o.type){case"BufferGeometry":case"InstancedBufferGeometry":s=r.parse(o);break;default:o.type in yu?s=yu[o.type].fromJSON(o,t):o.type in oh?s=oh[o.type].fromJSON(o,t):Le(`ObjectLoader: Unknown geometry type "${o.type}". Use .registerGeometry() before starting the deserialization process.`)}s.uuid=o.uuid,o.name!==void 0&&(s.name=o.name),o.userData!==void 0&&(s.userData=o.userData),i[o.uuid]=s}}return i}parseMaterials(e,t){let i={},r={};if(e!==void 0){let a=new If;a.setTextures(t);for(let n=0,s=e.length;n<s;n++){let o=e[n];i[o.uuid]===void 0&&(i[o.uuid]=a.parse(o)),r[o.uuid]=i[o.uuid]}}return r}parseAnimations(e){let t={};if(e!==void 0)for(let i=0;i<e.length;i++){let r=e[i],a=Jn.parse(r);t[a.uuid]=a}return t}parseImages(e,t){let i=this,r={},a;function n(o){return o=i.manager.resolveURL(o),i.manager.itemStart(o),a.load(o,function(){i.manager.itemEnd(o)},void 0,function(){i.manager.itemError(o),i.manager.itemEnd(o)})}function s(o){if(typeof o=="string"){let l=o,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(l)?l:i.resourcePath+l;return n(h)}else return o.data?{data:Va(o.type,o.data),width:o.width,height:o.height}:null}if(e!==void 0&&e.length>0){let o=new yc(t);a=new Kn(o),a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin);for(let l=0,h=e.length;l<h;l++){let c=e[l],u=c.url;if(Array.isArray(u)){let p=[];for(let d=0,g=u.length;d<g;d++){let y=u[d],v=s(y);v!==null&&(v instanceof HTMLImageElement?p.push(v):p.push(new Ui(v.data,v.width,v.height)))}r[c.uuid]=new tr(p)}else{let p=s(c.url);r[c.uuid]=new tr(p)}}}return r}async parseImagesAsync(e){let t=this,i={},r;async function a(n){if(typeof n=="string"){let s=n,o=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(s)?s:t.resourcePath+s;return await r.loadAsync(o)}else return n.data?{data:Va(n.type,n.data),width:n.width,height:n.height}:null}if(e!==void 0&&e.length>0){r=new Kn(this.manager),r.setPriority(this.priority),r.setCache(this.cache),r.setCrossOrigin(this.crossOrigin);for(let n=0,s=e.length;n<s;n++){let o=e[n],l=o.url;if(Array.isArray(l)){let h=[];for(let c=0,u=l.length;c<u;c++){let p=l[c],d=await a(p);d!==null&&(d instanceof HTMLImageElement?h.push(d):h.push(new Ui(d.data,d.width,d.height)))}i[o.uuid]=new tr(h)}else{let h=await a(o.url);i[o.uuid]=new tr(h)}}}return i}parseTextures(e,t){function i(a,n){return typeof a=="number"?a:(Le("ObjectLoader.parseTexture: Constant should be in numeric form.",a),n[a])}let r={};if(e!==void 0)for(let a=0,n=e.length;a<n;a++){let s=e[a];s.image===void 0&&Le('ObjectLoader: No "image" specified for',s.uuid),t[s.image]===void 0&&Le("ObjectLoader: Undefined image",s.image);let o=t[s.image],l=o.data,h;Array.isArray(l)?(h=new ts,l.length===6&&(h.needsUpdate=!0)):(l&&l.data?h=new Ui:h=new Yt,l&&(h.needsUpdate=!0)),h.source=o,h.uuid=s.uuid,s.name!==void 0&&(h.name=s.name),s.mapping!==void 0&&(h.mapping=i(s.mapping,Tv)),s.channel!==void 0&&(h.channel=s.channel),s.offset!==void 0&&h.offset.fromArray(s.offset),s.repeat!==void 0&&h.repeat.fromArray(s.repeat),s.center!==void 0&&h.center.fromArray(s.center),s.rotation!==void 0&&(h.rotation=s.rotation),s.wrap!==void 0&&(h.wrapS=i(s.wrap[0],Cu),h.wrapT=i(s.wrap[1],Cu)),s.format!==void 0&&(h.format=s.format),s.internalFormat!==void 0&&(h.internalFormat=s.internalFormat),s.type!==void 0&&(h.type=s.type),s.colorSpace!==void 0&&(h.colorSpace=s.colorSpace),s.minFilter!==void 0&&(h.minFilter=i(s.minFilter,Pu)),s.magFilter!==void 0&&(h.magFilter=i(s.magFilter,Pu)),s.anisotropy!==void 0&&(h.anisotropy=s.anisotropy),s.flipY!==void 0&&(h.flipY=s.flipY),s.generateMipmaps!==void 0&&(h.generateMipmaps=s.generateMipmaps),s.mipmapsAutoUpdate!==void 0&&(h.mipmapsAutoUpdate=s.mipmapsAutoUpdate),s.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=s.premultiplyAlpha),s.unpackAlignment!==void 0&&(h.unpackAlignment=s.unpackAlignment),s.compareFunction!==void 0&&(h.compareFunction=s.compareFunction),s.normalized!==void 0&&(h.normalized=s.normalized),s.userData!==void 0&&(h.userData=s.userData),r[s.uuid]=h}return r}parseObject(e,t,i,r,a){let n;function s(u){return t[u]===void 0&&Le("ObjectLoader: Undefined geometry",u),t[u]}function o(u){if(u!==void 0){if(Array.isArray(u)){let p=[];for(let d=0,g=u.length;d<g;d++){let y=u[d];i[y]===void 0&&Le("ObjectLoader: Undefined material",y),p.push(i[y])}return p}return i[u]===void 0&&Le("ObjectLoader: Undefined material",u),i[u]}}function l(u){return r[u]===void 0&&Le("ObjectLoader: Undefined texture",u),r[u]}let h,c;switch(e.type){case"Scene":n=new ul,e.background!==void 0&&(Number.isInteger(e.background)?n.background=new ke(e.background):n.background=l(e.background)),e.environment!==void 0&&(n.environment=l(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?n.fog=new op(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(n.fog=new np(e.fog.color,e.fog.density)),e.fog.name!==""&&(n.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(n.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(n.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&n.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(n.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&n.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":n=new Jt(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(n.focus=e.focus),e.zoom!==void 0&&(n.zoom=e.zoom),e.filmGauge!==void 0&&(n.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(n.filmOffset=e.filmOffset),e.view!==void 0&&(n.view=Object.assign({},e.view));break;case"OrthographicCamera":n=new Sl(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(n.zoom=e.zoom),e.view!==void 0&&(n.view=Object.assign({},e.view));break;case"AmbientLight":n=new Rf(e.color,e.intensity);break;case"DirectionalLight":n=new Ml(e.color,e.intensity),n.target=e.target||"";break;case"PointLight":n=new Af(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":n=new Cf(e.color,e.intensity,e.width,e.height);break;case"SpotLight":n=new Tf(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),n.target=e.target||"",e.map!==void 0&&(n.map=l(e.map));break;case"HemisphereLight":n=new _l(e.color,e.groundColor,e.intensity);break;case"LightProbe":let u=new Sc().fromArray(e.sh);n=new Pf(u,e.intensity);break;case"SkinnedMesh":h=s(e.geometry),c=o(e.material),n=new fp(h,c),e.bindMode!==void 0&&(n.bindMode=e.bindMode),e.bindMatrix!==void 0&&n.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(n.skeleton=e.skeleton);break;case"Mesh":h=s(e.geometry),c=o(e.material),n=new it(h,c);break;case"InstancedMesh":h=s(e.geometry),c=o(e.material);let p=e.count,d=e.instanceMatrix,g=e.instanceColor;n=new Or(h,c,p),n.instanceMatrix=new Ja(new Float32Array(d.array),16),g!==void 0&&(n.instanceColor=new Ja(new Float32Array(g.array),g.itemSize));break;case"BatchedMesh":h=s(e.geometry),c=o(e.material),n=new _p(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,c),n.geometry=h,n.perObjectFrustumCulled=e.perObjectFrustumCulled,n.sortObjects=e.sortObjects,n._drawRanges=e.drawRanges,n._reservedRanges=e.reservedRanges,n._geometryInfo=e.geometryInfo.map(y=>{let v=null,m=null;return y.boundingBox!==void 0&&(v=new ci().fromJSON(y.boundingBox)),y.boundingSphere!==void 0&&(m=new ti().fromJSON(y.boundingSphere)),{...y,boundingBox:v,boundingSphere:m}}),n._instanceInfo=e.instanceInfo,n._availableInstanceIds=e.availableInstanceIds,n._availableGeometryIds=e.availableGeometryIds,n._nextIndexStart=e.nextIndexStart,n._nextVertexStart=e.nextVertexStart,n._geometryCount=e.geometryCount,n._maxInstanceCount=e.maxInstanceCount,n._maxVertexCount=e.maxVertexCount,n._maxIndexCount=e.maxIndexCount,n._geometryInitialized=e.geometryInitialized,n._matricesTexture=l(e.matricesTexture.uuid),n._indirectTexture=l(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(n._colorsTexture=l(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(n.boundingSphere=new ti().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(n.boundingBox=new ci().fromJSON(e.boundingBox));break;case"LOD":n=new pp;break;case"Line":n=new Nr(s(e.geometry),o(e.material));break;case"LineLoop":n=new yp(s(e.geometry),o(e.material));break;case"LineSegments":n=new ar(s(e.geometry),o(e.material));break;case"PointCloud":case"Points":n=new xp(s(e.geometry),o(e.material));break;case"Sprite":n=new dp(o(e.material)),e.center!==void 0&&n.center.fromArray(e.center);break;case"Group":n=new $t;break;case"Bone":n=new ec;break;default:n=new Et}if(n.uuid=e.uuid,e.name!==void 0&&(n.name=e.name),e.pivot!==void 0&&(n.pivot=new R().fromArray(e.pivot)),e.matrix!==void 0?(n.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(n.matrixAutoUpdate=e.matrixAutoUpdate),n.matrixAutoUpdate&&(n.matrix.decompose(n.position,n.quaternion,n.scale),n.pivot!==null&&n.position.copy(n.pivot).applyMatrix4(n.matrix).sub(n.pivot))):(e.position!==void 0&&n.position.fromArray(e.position),e.rotation!==void 0&&n.rotation.fromArray(e.rotation),e.quaternion!==void 0&&n.quaternion.fromArray(e.quaternion),e.scale!==void 0&&n.scale.fromArray(e.scale)),e.up!==void 0&&n.up.fromArray(e.up),e.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),e.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=e.morphTargetInfluences.slice()),e.castShadow!==void 0&&(n.castShadow=e.castShadow),e.receiveShadow!==void 0&&(n.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(n.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(n.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(n.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(n.shadow.radius=e.shadow.radius),e.shadow.blurSamples!==void 0&&(n.shadow.blurSamples=e.shadow.blurSamples),e.shadow.focus!==void 0&&(n.shadow.focus=e.shadow.focus),e.shadow.aspect!==void 0&&(n.shadow.aspect=e.shadow.aspect),e.shadow.mapSize!==void 0&&n.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.mapType!==void 0&&(n.shadow.mapType=e.shadow.mapType),e.shadow.camera!==void 0&&(n.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(n.visible=e.visible),e.frustumCulled!==void 0&&(n.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(n.renderOrder=e.renderOrder),e.static!==void 0&&(n.static=e.static),e.userData!==void 0&&(n.userData=e.userData),e.layers!==void 0&&(n.layers.mask=e.layers),e.children!==void 0){let u=e.children;for(let p=0;p<u.length;p++)n.add(this.parseObject(u[p],t,i,r,a))}if(e.animations!==void 0){let u=e.animations;for(let p=0;p<u.length;p++){let d=u[p];n.animations.push(a[d])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(n.autoUpdate=e.autoUpdate);let u=e.levels;for(let p=0;p<u.length;p++){let d=u[p],g=n.getObjectByProperty("uuid",d.object);g!==void 0&&n.addLevel(g,d.distance,d.hysteresis)}}return n}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(i){if(i.isSkinnedMesh===!0&&i.skeleton!==void 0){let r=t[i.skeleton];r===void 0?Le("ObjectLoader: No skeleton found with UUID:",i.skeleton):i.bind(r,i.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){let i=t.target,r=e.getObjectByProperty("uuid",i);r!==void 0?t.target=r:t.target=new Et}})}},Tv={UVMapping:$o,CubeReflectionMapping:_r,CubeRefractionMapping:oa,EquirectangularReflectionMapping:wn,EquirectangularRefractionMapping:Tn},Cu={RepeatWrapping:Lr,ClampToEdgeWrapping:Kt,MirroredRepeatWrapping:On},Pu={NearestFilter:Ht,NearestMipmapNearestFilter:Bh,NearestMipmapLinearFilter:Ga,LinearFilter:Nt,LinearMipmapNearestFilter:An,LinearMipmapLinearFilter:ji},lh=new WeakMap,Av=class extends Ei{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Le("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Le("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,n=ir.get(`image-bitmap:${e}`);if(n!==void 0){if(a.manager.itemStart(e),n.then){n.then(l=>{lh.has(n)===!0?(r&&r(lh.get(n)),a.manager.itemError(e),a.manager.itemEnd(e)):(t&&t(l),a.manager.itemEnd(e))});return}setTimeout(function(){t&&t(n),a.manager.itemEnd(e)},0);return}let s={};s.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",s.headers=this.requestHeader,s.priority=this.priority,s.cache=this.cache,s.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,s).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},a.options,{colorSpaceConversion:"none"}))}).then(function(l){return ir.add(`image-bitmap:${e}`,l),t&&t(l),a.manager.itemEnd(e),l}).catch(function(l){r&&r(l),lh.set(o,l),ir.remove(`image-bitmap:${e}`),a.manager.itemError(e),a.manager.itemEnd(e)});ir.add(`image-bitmap:${e}`,o),a.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ys,Mc=class{static getContext(){return Ys===void 0&&(Ys=new(window.AudioContext||window.webkitAudioContext)),Ys}static setContext(e){Ys=e}},Rv=class extends Ei{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new Mr(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setResponseType("arraybuffer"),n.setPath(this.path),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials),n.load(e,function(o){try{let l=o.slice(0),h=Mc.getContext(),c=e+"#decode";a.manager.itemStart(c),h.decodeAudioData(l,function(u){t(u),a.manager.itemEnd(c)}).catch(function(u){s(u),a.manager.itemEnd(c)})}catch(l){s(l)}},i,r);function s(o){r?r(o):Qe(o),a.manager.itemError(e)}}},Iu=new lt,Lu=new lt,Zr=new lt,Cv=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Jt,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Jt,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){let t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,Zr.copy(e.projectionMatrix);let i=t.eyeSep/2,r=i*t.near/t.focus,a=t.near*Math.tan(sa*t.fov*.5)/t.zoom,n,s;Lu.elements[12]=-i,Iu.elements[12]=i,n=-a*t.aspect+r,s=a*t.aspect+r,Zr.elements[0]=2*t.near/(s-n),Zr.elements[8]=(s+n)/(s-n),this.cameraL.projectionMatrix.copy(Zr),n=-a*t.aspect-r,s=a*t.aspect-r,Zr.elements[0]=2*t.near/(s-n),Zr.elements[8]=(s+n)/(s-n),this.cameraR.projectionMatrix.copy(Zr)}this.cameraL.matrix.copy(e.matrixWorld).multiply(Lu),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(e.matrixWorld).multiply(Iu),this.cameraR.matrixWorldNeedsUpdate=!0}},Na=-90,Oa=1,Ko=class extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Jt(Na,Oa,e,t);r.layers=this.layers,this.add(r);let a=new Jt(Na,Oa,e,t);a.layers=this.layers,this.add(a);let n=new Jt(Na,Oa,e,t);n.layers=this.layers,this.add(n);let s=new Jt(Na,Oa,e,t);s.layers=this.layers,this.add(s);let o=new Jt(Na,Oa,e,t);o.layers=this.layers,this.add(o);let l=new Jt(Na,Oa,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,a,n,s,o]=t;for(let l of t)this.remove(l);if(e===Ci)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),n.up.set(0,0,1),n.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===ha)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),n.up.set(0,0,-1),n.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,n,s,o,l,h]=this.children,c=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),d=e.xr.enabled;e.xr.enabled=!1;let g=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let y=!1;e.isWebGLRenderer===!0?y=e.state.buffers.depth.getReversed():y=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,n),e.setRenderTarget(i,2,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,3,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,4,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=g,e.setRenderTarget(i,5,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(c,u,p),e.xr.enabled=d,i.texture.needsPMREMUpdate=!0}},Nf=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Of=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Pv.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Pv(){this._document.hidden===!1&&this.reset()}var Jr=new R,hh=new Bt,Iv=new R,Kr=new R,$r=new R,Lv=class extends Et{constructor(){super(),this.type="AudioListener",this.context=Mc.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new Of}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e),this._timer.update();let t=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(Jr,hh,Iv),Kr.set(0,0,-1).applyQuaternion(hh),$r.set(0,1,0).applyQuaternion(hh),t.positionX){let i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(Jr.x,i),t.positionY.linearRampToValueAtTime(Jr.y,i),t.positionZ.linearRampToValueAtTime(Jr.z,i),t.forwardX.linearRampToValueAtTime(Kr.x,i),t.forwardY.linearRampToValueAtTime(Kr.y,i),t.forwardZ.linearRampToValueAtTime(Kr.z,i),t.upX.linearRampToValueAtTime($r.x,i),t.upY.linearRampToValueAtTime($r.y,i),t.upZ.linearRampToValueAtTime($r.z,i)}else t.setPosition(Jr.x,Jr.y,Jr.z),t.setOrientation(Kr.x,Kr.y,Kr.z,$r.x,$r.y,$r.z)}},Ff=class extends Et{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){Le("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){Le("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){Le("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){Le("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){Le("Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(Le("Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){Le("Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(Le("Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}},Qr=new R,Du=new Bt,Dv=new R,ea=new R,Uv=class extends Ff{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,i){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=i,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(Qr,Du,Dv),ea.set(0,0,1).applyQuaternion(Du);let t=this.panner;if(t.positionX){let i=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(Qr.x,i),t.positionY.linearRampToValueAtTime(Qr.y,i),t.positionZ.linearRampToValueAtTime(Qr.z,i),t.orientationX.linearRampToValueAtTime(ea.x,i),t.orientationY.linearRampToValueAtTime(ea.y,i),t.orientationZ.linearRampToValueAtTime(ea.z,i)}else t.setPosition(Qr.x,Qr.y,Qr.z),t.setOrientation(ea.x,ea.y,ea.z)}},Nv=class{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0,t=this.getFrequencyData();for(let i=0;i<t.length;i++)e+=t[i];return e/t.length}},Bf=class{constructor(e,t,i){this.binding=e,this.valueSize=i;let r,a,n;switch(t){case"quaternion":r=this._slerp,a=this._slerpAdditive,n=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":r=this._select,a=this._select,n=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:r=this._lerp,a=this._lerpAdditive,n=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=a,this._setIdentity=n,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let i=this.buffer,r=this.valueSize,a=e*r+r,n=this.cumulativeWeight;if(n===0){for(let s=0;s!==r;++s)i[a+s]=i[s];n=t}else{n+=t;let s=t/n;this._mixBufferRegion(i,a,0,s,r)}this.cumulativeWeight=n}accumulateAdditive(e){let t=this.buffer,i=this.valueSize,r=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,r,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,i=this.buffer,r=e*t+t,a=this.cumulativeWeight,n=this.cumulativeWeightAdditive,s=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,a<1){let o=t*this._origIndex;this._mixBufferRegion(i,r,o,1-a,t)}n>0&&this._mixBufferRegionAdditive(i,r,this._addIndex*t,1,t);for(let o=t,l=t+t;o!==l;++o)if(i[o]!==i[o+t]){s.setValue(i,r);break}}saveOriginalState(){let e=this.binding,t=this.buffer,i=this.valueSize,r=i*this._origIndex;e.getValue(t,r);for(let a=i,n=r;a!==n;++a)t[a]=t[r+a%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,r,a){if(r>=.5)for(let n=0;n!==a;++n)e[t+n]=e[i+n]}_slerp(e,t,i,r){Bt.slerpFlat(e,t,e,t,e,i,r)}_slerpAdditive(e,t,i,r,a){let n=this._workIndex*a;Bt.multiplyQuaternionsFlat(e,n,e,t,e,i),Bt.slerpFlat(e,t,e,t,e,n,r)}_lerp(e,t,i,r,a){let n=1-r;for(let s=0;s!==a;++s){let o=t+s;e[o]=e[o]*n+e[i+s]*r}}_lerpAdditive(e,t,i,r,a){for(let n=0;n!==a;++n){let s=t+n;e[s]=e[s]+e[i+n]*r}}},bc="\\[\\]\\.:\\/",Ov=new RegExp("["+bc+"]","g"),Ec="[^"+bc+"]",Fv="[^"+bc.replace("\\.","")+"]",Bv=/((?:WC+[\/:])*)/.source.replace("WC",Ec),zv=/(WCOD+)?/.source.replace("WCOD",Fv),Hv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ec),kv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ec),Gv=new RegExp("^"+Bv+zv+Hv+kv+"$"),Vv=["material","materials","bones","map"],Wv=class{constructor(e,t,i){let r=i||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,a=i.length;r!==a;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Rt=class Ha{constructor(t,i,r){this.path=i,this.parsedPath=r||Ha.parseTrackName(i),this.node=Ha.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,i,r){return t&&t.isAnimationObjectGroup?new Ha.Composite(t,i,r):new Ha(t,i,r)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Ov,"")}static parseTrackName(t){let i=Gv.exec(t);if(i===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let r={nodeName:i[2],objectName:i[3],objectIndex:i[4],propertyName:i[5],propertyIndex:i[6]},a=r.nodeName&&r.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=r.nodeName.substring(a+1);Vv.indexOf(n)!==-1&&(r.nodeName=r.nodeName.substring(0,a),r.objectName=n)}if(r.propertyName===null||r.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return r}static findNode(t,i){if(i===void 0||i===""||i==="."||i===-1||i===t.name||i===t.uuid)return t;if(t.skeleton){let r=t.skeleton.getBoneByName(i);if(r!==void 0)return r}if(t.children){let r=function(n){for(let s=0;s<n.length;s++){let o=n[s];if(o.name===i||o.uuid===i)return o;let l=r(o.children);if(l)return l}return null},a=r(t.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,i){t[i]=this.targetObject[this.propertyName]}_getValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)t[i++]=r[a]}_getValue_arrayElement(t,i){t[i]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,i){this.resolvedProperty.toArray(t,i)}_setValue_direct(t,i){this.targetObject[this.propertyName]=t[i]}_setValue_direct_setNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++]}_setValue_array_setNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,i){this.resolvedProperty[this.propertyIndex]=t[i]}_setValue_arrayElement_setNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,i){this.resolvedProperty.fromArray(t,i)}_setValue_fromArray_setNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,i){this.bind(),this.getValue(t,i)}_setValue_unbound(t,i){this.bind(),this.setValue(t,i)}bind(){let t=this.node,i=this.parsedPath,r=i.objectName,a=i.propertyName,n=i.propertyIndex;if(t||(t=Ha.findNode(this.rootNode,i.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(r){let h=i.objectIndex;switch(r){case"materials":if(!t.material){Qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Qe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Qe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===h){h=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Qe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[r]===void 0){Qe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[r]}if(h!==void 0){if(t[h]===void 0){Qe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let s=t[a];if(s===void 0){let h=i.nodeName;Qe("PropertyBinding: Trying to update property for track: "+h+"."+a+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!t.geometry){Qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=n}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=Wv;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Xv=class{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Oi(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let e={};this._indicesByUUID=e;for(let i=0,r=arguments.length;i!==r;++i)e[arguments[i].uuid]=i;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){let e=this._objects,t=this._indicesByUUID,i=this._paths,r=this._parsedPaths,a=this._bindings,n=a.length,s,o=e.length,l=this.nCachedObjects_;for(let h=0,c=arguments.length;h!==c;++h){let u=arguments[h],p=u.uuid,d=t[p];if(d===void 0){d=o++,t[p]=d,e.push(u);for(let g=0,y=n;g!==y;++g)a[g].push(new Rt(u,i[g],r[g]))}else if(d<l){s=e[d];let g=--l,y=e[g];t[y.uuid]=d,e[d]=y,t[p]=g,e[g]=u;for(let v=0,m=n;v!==m;++v){let f=a[v],S=f[g],x=f[d];f[d]=S,x===void 0&&(x=new Rt(u,i[v],r[v])),f[g]=x}}else e[d]!==s&&Qe("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=l}remove(){let e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length,a=this.nCachedObjects_;for(let n=0,s=arguments.length;n!==s;++n){let o=arguments[n],l=o.uuid,h=t[l];if(h!==void 0&&h>=a){let c=a++,u=e[c];t[u.uuid]=h,e[h]=u,t[l]=c,e[c]=o;for(let p=0,d=r;p!==d;++p){let g=i[p],y=g[c],v=g[h];g[h]=y,g[c]=v}}}this.nCachedObjects_=a}uncache(){let e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length,a=this.nCachedObjects_,n=e.length;for(let s=0,o=arguments.length;s!==o;++s){let l=arguments[s],h=l.uuid,c=t[h];if(c!==void 0)if(delete t[h],c<a){let u=--a,p=e[u],d=--n,g=e[d];c!==u&&(t[p.uuid]=c),e[c]=p,u!==d&&(t[g.uuid]=u),e[u]=g,e.pop();for(let y=0,v=r;y!==v;++y){let m=i[y],f=m[u],S=m[d];m[c]=f,m[u]=S,m.pop()}}else{let u=--n,p=e[u];c!==u&&(t[p.uuid]=c),e[c]=p,e.pop();for(let d=0,g=r;d!==g;++d){let y=i[d];y[c]=y[u],y.pop()}}}this.nCachedObjects_=a}subscribe_(e,t){let i=this._bindingsIndicesByPath,r=i[e],a=this._bindings;if(r!==void 0)return a[r];let n=this._paths,s=this._parsedPaths,o=this._objects,l=o.length,h=this.nCachedObjects_,c=new Array(l);r=a.length,i[e]=r,n.push(e),s.push(t),a.push(c);for(let u=h,p=o.length;u!==p;++u){let d=o[u];c[u]=new Rt(d,e,t)}return c}unsubscribe_(e){let t=this._bindingsIndicesByPath,i=t[e];if(i!==void 0){let r=this._paths,a=this._parsedPaths,n=this._bindings,s=n.length-1,o=n[s],l=r[s];t[l]=i,n[i]=o,n.pop(),a[i]=a[s],a.pop(),r[i]=r[s],r.pop()}}},zf=class{constructor(e,t,i=null,r=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=r;let a=t.tracks,n=a.length,s=new Array(n),o={endingStart:ia,endingEnd:ia};for(let l=0;l!==n;++l){let h=a[l].createInterpolant(null);s[l]=h,h.settings=o}this._interpolantSettings=o,this._interpolants=s,this._propertyBindings=new Array(n),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Od,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){let r=this._clip.duration,a=e._clip.duration,n=a/r,s=r/a;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,n,t),this.warp(s,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){let r=this._mixer,a=r.time,n=this.timeScale,s=this._timeScaleInterpolant;s===null&&(s=r._lendControlInterpolant(),this._timeScaleInterpolant=s);let o=s.parameterPositions,l=s.sampleValues;return o[0]=a,o[1]=a+i,l[0]=e/n,l[1]=t/n,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,r){if(!this.enabled){this._updateWeight(e);return}let a=this._startTime;if(a!==null){let o=(e-a)*i;o<0||i===0?t=0:(this._startTime=null,t=i*o)}t*=this._updateTimeScale(e);let n=this._updateTime(t),s=this._updateWeight(e);if(s>0){let o=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Xh:for(let h=0,c=o.length;h!==c;++h)o[h].evaluate(n),l[h].accumulateAdditive(s);break;case nl:default:for(let h=0,c=o.length;h!==c;++h)o[h].evaluate(n),l[h].accumulate(r,s)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let i=this._weightInterpolant;if(i!==null){let r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let i=this._timeScaleInterpolant;if(i!==null){let r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,i=this.loop,r=this.time+e,a=this._loopCount,n=i===Fd;if(e===0)return a===-1?r:n&&(a&1)===1?t-r:r;if(i===Nd){a===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(r>=t)r=t;else if(r<0)r=0;else{this.time=r;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(a===-1&&(e>=0?(a=0,this._setEndings(!0,this.repetitions===0,n)):this._setEndings(this.repetitions===0,!0,n)),r>=t||r<0){let s=Math.floor(r/t);r-=t*s,a+=Math.abs(s);let o=this.repetitions-a;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=e>0?t:0,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let l=e<0;this._setEndings(l,!l,n)}else this._setEndings(!1,!1,n);this._loopCount=a,this.time=r,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:s})}}else this._loopCount=a,this.time=r;if(n&&(a&1)===1)return t-r}return r}_setEndings(e,t,i){let r=this._interpolantSettings;i?(r.endingStart=ra,r.endingEnd=ra):(e?r.endingStart=this.zeroSlopeAtStart?ra:ia:r.endingStart=Hn,t?r.endingEnd=this.zeroSlopeAtEnd?ra:ia:r.endingEnd=Hn)}_scheduleFading(e,t,i){let r=this._mixer,a=r.time,n=this._weightInterpolant;n===null&&(n=r._lendControlInterpolant(),this._weightInterpolant=n);let s=n.parameterPositions,o=n.sampleValues;return s[0]=a,o[0]=t,s[1]=a+e,o[1]=i,this}},jv=new Float32Array(1),qv=class extends Zi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let i=e._localRoot||this._root,r=e._clip.tracks,a=r.length,n=e._propertyBindings,s=e._interpolants,o=i.uuid,l=this._bindingsByRootAndName,h=l[o];h===void 0&&(h={},l[o]=h);for(let c=0;c!==a;++c){let u=r[c],p=u.name,d=h[p];if(d!==void 0)++d.referenceCount,n[c]=d;else{if(d=n[c],d!==void 0){d._cacheIndex===null&&(++d.referenceCount,this._addInactiveBinding(d,o,p));continue}let g=t&&t._propertyBindings[c].binding.parsedPath;d=new Bf(Rt.create(i,p,g),u.ValueTypeName,u.getValueSize()),++d.referenceCount,this._addInactiveBinding(d,o,p),n[c]=d}s[c].resultBuffer=d.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let i=(e._localRoot||this._root).uuid,r=e._clip.uuid,a=this._actionsByClip[r];this._bindAction(e,a&&a.knownActions[0]),this._addInactiveAction(e,r,i)}let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.useCount++===0&&(this._lendBinding(a),a.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];--a.useCount===0&&(a.restoreOriginalState(),this._takeBackBinding(a))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){let r=this._actions,a=this._actionsByClip,n=a[t];if(n===void 0)n={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,a[t]=n;else{let s=n.knownActions;e._byClipCacheIndex=s.length,s.push(e)}e._cacheIndex=r.length,r.push(e),n.actionByRoot[i]=e}_removeInactiveAction(e){let t=this._actions,i=t[t.length-1],r=e._cacheIndex;i._cacheIndex=r,t[r]=i,t.pop(),e._cacheIndex=null;let a=e._clip.uuid,n=this._actionsByClip,s=n[a],o=s.knownActions,l=o[o.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,o[h]=l,o.pop(),e._byClipCacheIndex=null;let c=s.actionByRoot,u=(e._localRoot||this._root).uuid;delete c[u],o.length===0&&delete n[a],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];--a.referenceCount===0&&this._removeInactiveBinding(a)}}_lendAction(e){let t=this._actions,i=e._cacheIndex,r=this._nActiveActions++,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_takeBackAction(e){let t=this._actions,i=e._cacheIndex,r=--this._nActiveActions,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_addInactiveBinding(e,t,i){let r=this._bindingsByRootAndName,a=this._bindings,n=r[t];n===void 0&&(n={},r[t]=n),n[i]=e,e._cacheIndex=a.length,a.push(e)}_removeInactiveBinding(e){let t=this._bindings,i=e.binding,r=i.rootNode.uuid,a=i.path,n=this._bindingsByRootAndName,s=n[r],o=t[t.length-1],l=e._cacheIndex;o._cacheIndex=l,t[l]=o,t.pop(),delete s[a],Object.keys(s).length===0&&delete n[r]}_lendBinding(e){let t=this._bindings,i=e._cacheIndex,r=this._nActiveBindings++,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_takeBackBinding(e){let t=this._bindings,i=e._cacheIndex,r=--this._nActiveBindings,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,i=e[t];return i===void 0&&(i=new gc(new Float32Array(2),new Float32Array(2),1,jv),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){let t=this._controlInterpolants,i=e.__cacheIndex,r=--this._nActiveControlInterpolants,a=t[r];e.__cacheIndex=r,t[r]=e,a.__cacheIndex=i,t[i]=a}clipAction(e,t,i){let r=t||this._root,a=r.uuid,n=typeof e=="string"?Jn.findByName(r,e):e,s=n!==null?n.uuid:e,o=this._actionsByClip[s],l=null;if(i===void 0&&(n!==null?i=n.blendMode:i=nl),o!==void 0){let c=o.actionByRoot[a];if(c!==void 0&&c.blendMode===i)return c;l=o.knownActions[0],n===null&&(n=l._clip)}if(n===null)return null;let h=new zf(this,n,t,i);return this._bindAction(h,l),this._addInactiveAction(h,s,a),h}existingAction(e,t){let i=t||this._root,r=i.uuid,a=typeof e=="string"?Jn.findByName(i,e):e,n=a?a.uuid:e,s=this._actionsByClip[n];return s!==void 0&&s.actionByRoot[r]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;let t=this._actions,i=this._nActiveActions,r=this.time+=e,a=Math.sign(e),n=this._accuIndex^=1;for(let l=0;l!==i;++l)t[l]._update(r,e,a,n);let s=this._bindings,o=this._nActiveBindings;for(let l=0;l!==o;++l)s[l].apply(n);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,i=e.uuid,r=this._actionsByClip,a=r[i];if(a!==void 0){let n=a.knownActions;for(let s=0,o=n.length;s!==o;++s){let l=n[s];this._deactivateAction(l);let h=l._cacheIndex,c=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,c._cacheIndex=h,t[h]=c,t.pop(),this._removeInactiveBindingsForAction(l)}delete r[i]}}uncacheRoot(e){let t=e.uuid,i=this._actionsByClip;for(let n in i){let s=i[n].actionByRoot,o=s[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let r=this._bindingsByRootAndName,a=r[t];if(a!==void 0)for(let n in a){let s=a[n];s.restoreOriginalState(),this._removeInactiveBinding(s)}}uncacheAction(e,t){let i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}},Yv=class extends Jh{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isRenderTarget3D=!0,this.depth=i;for(let a=0;a<this.textures.length;a++){let n=new hl(null,e,t,i);n.isRenderTargetTexture=!0,n.renderTarget=this,this.textures[a]=n}this._setTextureOptions(r)}},Zv=class Hf{constructor(t){this.value=t}clone(){return new Hf(this.value.clone===void 0?this.value:this.value.clone())}},Jv=0,Kv=class extends Zi{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:Jv++}),this.name="",this.usage=sl,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){let t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;let t=e.uniforms;this.uniforms.length=0;for(let i=0,r=t.length;i<r;i++){let a=t[i];Array.isArray(a)?this.uniforms.push(a.map(n=>n.clone())):this.uniforms.push(a.clone())}return this}clone(){return new this.constructor().copy(this)}},$v=class extends dl{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}},Qv=class{constructor(e,t,i,r,a,n=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=i,this.elementSize=r,this.count=a,this.normalized=n,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}},Uu=new lt,as=class{constructor(e,t,i=0,r=1/0){this.ray=new Qa(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new cl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Qe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Uu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uu),this}intersectObject(e,t=!0,i=[]){return Th(e,this,i,t),i.sort(Nu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,a=e.length;r<a;r++)Th(e[r],this,i,t);return i.sort(Nu),i}};function Nu(e,t){return e.distance-t.distance}function Th(e,t,i,r){let a=!0;if(e.layers.test(t.layers)&&e.raycast(t,i)===!1&&(a=!1),a===!0&&r===!0){let n=e.children;for(let s=0,o=n.length;s<o;s++)Th(n[s],t,i,!0)}}var e_=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Le("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},t_=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ht(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ht(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},i_=class{constructor(e=1,t=0,i=0){this.radius=e,this.theta=t,this.y=i}set(e,t,i){return this.radius=e,this.theta=t,this.y=i,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+i*i),this.theta=Math.atan2(e,i),this.y=t,this}clone(){return new this.constructor().copy(this)}},kf=class{constructor(t,i,r,a){this.elements=[1,0,0,1],t!==void 0&&this.set(t,i,r,a)}identity(){return this.set(1,0,0,1),this}fromArray(t,i=0){for(let r=0;r<4;r++)this.elements[r]=t[r+i];return this}set(t,i,r,a){let n=this.elements;return n[0]=t,n[2]=i,n[1]=r,n[3]=a,this}};kf.prototype.isMatrix2=!0;var r_=kf,Ou=new se,Gf=class{constructor(e=new se(1/0,1/0),t=new se(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ou.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ou).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Fu=new R,Zs=new R,Fa=new R,Ba=new R,ch=new R,a_=new R,n_=new R,s_=class{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Fu.subVectors(e,this.start),Zs.subVectors(this.end,this.start);let i=Zs.dot(Zs);if(i===0)return 0;let r=Zs.dot(Fu)/i;return t&&(r=ht(r,0,1)),r}closestPointToPoint(e,t,i){let r=this.closestPointToPointParameter(e,t);return this.delta(i).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=a_,i=n_){let r=10000000000000001e-32,a,n,s=this.start,o=e.start,l=this.end,h=e.end;Fa.subVectors(l,s),Ba.subVectors(h,o),ch.subVectors(s,o);let c=Fa.dot(Fa),u=Ba.dot(Ba),p=Ba.dot(ch);if(c<=r&&u<=r)return t.copy(s),i.copy(o),t.distanceToSquared(i);if(c<=r)a=0,n=p/u,n=ht(n,0,1);else{let d=Fa.dot(ch);if(u<=r)n=0,a=ht(-d/c,0,1);else{let g=Fa.dot(Ba),y=c*u-g*g;y!==0?a=ht((g*p-d*u)/y,0,1):a=0,n=(g*a+p)/u,n<0?(n=0,a=ht(-d/c,0,1)):n>1&&(n=1,a=ht((g-d)/c,0,1))}}return t.copy(s).addScaledVector(Fa,a),i.copy(o).addScaledVector(Ba,n),t.distanceToSquared(i)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},Bu=new R,o_=class extends Et{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";let i=new dt,r=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let n=0,s=1,o=32;n<o;n++,s++){let l=n/o*Math.PI*2,h=s/o*Math.PI*2;r.push(Math.cos(l),Math.sin(l),1,Math.cos(h),Math.sin(h),1)}i.setAttribute("position",new qe(r,3));let a=new _i({fog:!1,toneMapped:!1});this.cone=new ar(i,a),this.add(this.cone),this.update()}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;let e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Bu.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Bu),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},Cr=new R,Js=new lt,uh=new lt,l_=class extends ar{constructor(e){let t=Vf(e),i=new dt,r=[],a=[];for(let l=0;l<t.length;l++){let h=t[l];h.parent&&h.parent.isBone&&(r.push(0,0,0),r.push(0,0,0),a.push(0,0,0),a.push(0,0,0))}i.setAttribute("position",new qe(r,3)),i.setAttribute("color",new qe(a,3));let n=new _i({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,n),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;let s=new ke(255),o=new ke(65280);this.setColors(s,o)}updateMatrixWorld(e){let t=this.bones,i=this.geometry,r=i.getAttribute("position");uh.copy(this.root.matrixWorld).invert();for(let a=0,n=0;a<t.length;a++){let s=t[a];s.parent&&s.parent.isBone&&(Js.multiplyMatrices(uh,s.matrixWorld),Cr.setFromMatrixPosition(Js),r.setXYZ(n,Cr.x,Cr.y,Cr.z),Js.multiplyMatrices(uh,s.parent.matrixWorld),Cr.setFromMatrixPosition(Js),r.setXYZ(n+1,Cr.x,Cr.y,Cr.z),n+=2)}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){let i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function Vf(e){let t=[];e.isBone===!0&&t.push(e);for(let i=0;i<e.children.length;i++)t.push(...Vf(e.children[i]));return t}var h_=class extends it{constructor(e,t,i){let r=new yi(t,4,2),a=new vi({wireframe:!0,fog:!1,toneMapped:!1});super(r,a),this.light=e,this.color=i,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},c_=new R,zu=new ke,Hu=new ke,u_=class extends Et{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="HemisphereLightHelper";let r=new dc(t);r.rotateY(Math.PI*.5),this.material=new vi({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let a=r.getAttribute("position"),n=new Float32Array(a.count*3);r.setAttribute("color",new Dt(n,3)),this.add(new it(r,this.material)),this.update()}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let t=e.geometry.getAttribute("color");zu.copy(this.light.color),Hu.copy(this.light.groundColor);for(let i=0,r=t.count;i<r;i++){let a=i<r/2?zu:Hu;t.setXYZ(i,a.r,a.g,a.b)}t.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),e.lookAt(c_.setFromMatrixPosition(this.light.matrixWorld).negate())}},d_=class extends ar{constructor(e=10,t=10,i=4473924,r=8947848){i=new ke(i),r=new ke(r);let a=t/2,n=e/t,s=e/2,o=[],l=[];for(let u=0,p=0,d=-s;u<=t;u++,d+=n){o.push(-s,0,d,s,0,d),o.push(d,0,-s,d,0,s);let g=u===a?i:r;g.toArray(l,p),p+=3,g.toArray(l,p),p+=3,g.toArray(l,p),p+=3,g.toArray(l,p),p+=3}let h=new dt;h.setAttribute("position",new qe(o,3)),h.setAttribute("color",new qe(l,3));let c=new _i({vertexColors:!0,toneMapped:!1});super(h,c),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},p_=class extends ar{constructor(e=10,t=16,i=8,r=64,a=4473924,n=8947848){a=new ke(a),n=new ke(n);let s=[],o=[];if(t>1)for(let c=0;c<t;c++){let u=c/t*(Math.PI*2),p=Math.sin(u)*e,d=Math.cos(u)*e;s.push(0,0,0),s.push(p,0,d);let g=c&1?a:n;o.push(g.r,g.g,g.b),o.push(g.r,g.g,g.b)}for(let c=0;c<i;c++){let u=c&1?a:n,p=e-e/i*c;for(let d=0;d<r;d++){let g=d/r*(Math.PI*2),y=Math.sin(g)*p,v=Math.cos(g)*p;s.push(y,0,v),o.push(u.r,u.g,u.b),g=(d+1)/r*(Math.PI*2),y=Math.sin(g)*p,v=Math.cos(g)*p,s.push(y,0,v),o.push(u.r,u.g,u.b)}}let l=new dt;l.setAttribute("position",new qe(s,3)),l.setAttribute("color",new qe(o,3));let h=new _i({vertexColors:!0,toneMapped:!1});super(l,h),this.type="PolarGridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},ku=new R,Ks=new R,Gu=new R,f_=class extends Et{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="DirectionalLightHelper",t===void 0&&(t=1);let r=new dt;r.setAttribute("position",new qe([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));let a=new _i({fog:!1,toneMapped:!1});this.lightPlane=new Nr(r,a),this.add(this.lightPlane),r=new dt,r.setAttribute("position",new qe([0,0,0,0,0,1],3)),this.targetLine=new Nr(r,a),this.add(this.targetLine),this.update()}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),ku.setFromMatrixPosition(this.light.matrixWorld),Ks.setFromMatrixPosition(this.light.target.matrixWorld),Gu.subVectors(Ks,ku),this.lightPlane.lookAt(Ks),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Ks),this.targetLine.scale.z=Gu.length()}},$s=new R,Ft=new xl,m_=class extends ar{constructor(e){let t=new dt,i=new _i({color:16777215,vertexColors:!0,toneMapped:!1}),r=[],a=[],n={};s("n1","n2"),s("n2","n4"),s("n4","n3"),s("n3","n1"),s("f1","f2"),s("f2","f4"),s("f4","f3"),s("f3","f1"),s("n1","f1"),s("n2","f2"),s("n3","f3"),s("n4","f4"),s("p","n1"),s("p","n2"),s("p","n3"),s("p","n4"),s("u1","u2"),s("u2","u3"),s("u3","u1"),s("c","t"),s("p","c"),s("cn1","cn2"),s("cn3","cn4"),s("cf1","cf2"),s("cf3","cf4");function s(d,g){o(d),o(g)}function o(d){r.push(0,0,0),a.push(0,0,0),n[d]===void 0&&(n[d]=[]),n[d].push(r.length/3-1)}t.setAttribute("position",new qe(r,3)),t.setAttribute("color",new qe(a,3)),super(t,i),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=n,this.update();let l=new ke(16755200),h=new ke(16711680),c=new ke(43775),u=new ke(16777215),p=new ke(3355443);this.setColors(l,h,c,u,p)}setColors(e,t,i,r,a){let n=this.geometry.getAttribute("color");return n.setXYZ(0,e.r,e.g,e.b),n.setXYZ(1,e.r,e.g,e.b),n.setXYZ(2,e.r,e.g,e.b),n.setXYZ(3,e.r,e.g,e.b),n.setXYZ(4,e.r,e.g,e.b),n.setXYZ(5,e.r,e.g,e.b),n.setXYZ(6,e.r,e.g,e.b),n.setXYZ(7,e.r,e.g,e.b),n.setXYZ(8,e.r,e.g,e.b),n.setXYZ(9,e.r,e.g,e.b),n.setXYZ(10,e.r,e.g,e.b),n.setXYZ(11,e.r,e.g,e.b),n.setXYZ(12,e.r,e.g,e.b),n.setXYZ(13,e.r,e.g,e.b),n.setXYZ(14,e.r,e.g,e.b),n.setXYZ(15,e.r,e.g,e.b),n.setXYZ(16,e.r,e.g,e.b),n.setXYZ(17,e.r,e.g,e.b),n.setXYZ(18,e.r,e.g,e.b),n.setXYZ(19,e.r,e.g,e.b),n.setXYZ(20,e.r,e.g,e.b),n.setXYZ(21,e.r,e.g,e.b),n.setXYZ(22,e.r,e.g,e.b),n.setXYZ(23,e.r,e.g,e.b),n.setXYZ(24,t.r,t.g,t.b),n.setXYZ(25,t.r,t.g,t.b),n.setXYZ(26,t.r,t.g,t.b),n.setXYZ(27,t.r,t.g,t.b),n.setXYZ(28,t.r,t.g,t.b),n.setXYZ(29,t.r,t.g,t.b),n.setXYZ(30,t.r,t.g,t.b),n.setXYZ(31,t.r,t.g,t.b),n.setXYZ(32,i.r,i.g,i.b),n.setXYZ(33,i.r,i.g,i.b),n.setXYZ(34,i.r,i.g,i.b),n.setXYZ(35,i.r,i.g,i.b),n.setXYZ(36,i.r,i.g,i.b),n.setXYZ(37,i.r,i.g,i.b),n.setXYZ(38,r.r,r.g,r.b),n.setXYZ(39,r.r,r.g,r.b),n.setXYZ(40,a.r,a.g,a.b),n.setXYZ(41,a.r,a.g,a.b),n.setXYZ(42,a.r,a.g,a.b),n.setXYZ(43,a.r,a.g,a.b),n.setXYZ(44,a.r,a.g,a.b),n.setXYZ(45,a.r,a.g,a.b),n.setXYZ(46,a.r,a.g,a.b),n.setXYZ(47,a.r,a.g,a.b),n.setXYZ(48,a.r,a.g,a.b),n.setXYZ(49,a.r,a.g,a.b),n.needsUpdate=!0,this}update(){let e=this.geometry,t=this.pointMap,i=1,r=1,a,n;if(Ft.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)a=1,n=0;else if(this.camera.coordinateSystem===Ci)a=-1,n=1;else if(this.camera.coordinateSystem===ha)a=0,n=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);zt("c",t,e,Ft,0,0,a),zt("t",t,e,Ft,0,0,n),zt("n1",t,e,Ft,-i,-r,a),zt("n2",t,e,Ft,i,-r,a),zt("n3",t,e,Ft,-i,r,a),zt("n4",t,e,Ft,i,r,a),zt("f1",t,e,Ft,-i,-r,n),zt("f2",t,e,Ft,i,-r,n),zt("f3",t,e,Ft,-i,r,n),zt("f4",t,e,Ft,i,r,n),zt("u1",t,e,Ft,i*.7,r*1.1,a),zt("u2",t,e,Ft,-i*.7,r*1.1,a),zt("u3",t,e,Ft,0,r*2,a),zt("cf1",t,e,Ft,-i,0,n),zt("cf2",t,e,Ft,i,0,n),zt("cf3",t,e,Ft,0,-r,n),zt("cf4",t,e,Ft,0,r,n),zt("cn1",t,e,Ft,-i,0,a),zt("cn2",t,e,Ft,i,0,a),zt("cn3",t,e,Ft,0,-r,a),zt("cn4",t,e,Ft,0,r,a),e.getAttribute("position").needsUpdate=!0}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function zt(e,t,i,r,a,n,s){$s.set(a,n,s).unproject(r);let o=t[e];if(o!==void 0){let l=i.getAttribute("position");for(let h=0,c=o.length;h<c;h++)l.setXYZ(o[h],$s.x,$s.y,$s.z)}}var Qs=new ci,g_=class extends ar{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=new Float32Array(24),a=new dt;a.setIndex(new Dt(i,1)),a.setAttribute("position",new Dt(r,3)),super(a,new _i({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Qs.setFromObject(this.object),Qs.isEmpty())return;let e=Qs.min,t=Qs.max,i=this.geometry.attributes.position,r=i.array;r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=e.x,r[4]=t.y,r[5]=t.z,r[6]=e.x,r[7]=e.y,r[8]=t.z,r[9]=t.x,r[10]=e.y,r[11]=t.z,r[12]=t.x,r[13]=t.y,r[14]=e.z,r[15]=e.x,r[16]=t.y,r[17]=e.z,r[18]=e.x,r[19]=e.y,r[20]=e.z,r[21]=t.x,r[22]=e.y,r[23]=e.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},v_=class extends ar{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],a=new dt;a.setIndex(new Dt(i,1)),a.setAttribute("position",new qe(r,3)),super(a,new _i({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},__=class extends Nr{constructor(e,t=1,i=16776960){let r=i,a=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],n=new dt;n.setAttribute("position",new qe(a,3)),n.computeBoundingSphere(),super(n,new _i({color:r,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;let s=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],o=new dt;o.setAttribute("position",new qe(s,3)),o.computeBoundingSphere(),this.add(new it(o,new vi({color:r,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}},Vu=new R,eo,dh,y_=class extends Et{constructor(e=new R(0,0,1),t=new R(0,0,0),i=1,r=16776960,a=i*.2,n=a*.2){super(),this.type="ArrowHelper",eo===void 0&&(eo=new dt,eo.setAttribute("position",new qe([0,0,0,0,1,0],3)),dh=new pa(.5,1,5,1),dh.translate(0,-.5,0)),this.position.copy(t),this.line=new Nr(eo,new _i({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new it(dh,new vi({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(i,a,n)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Vu.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Vu,t)}}setLength(e,t=e*.2,i=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(i,t,i),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},x_=class extends ar{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new dt;r.setAttribute("position",new qe(t,3)),r.setAttribute("color",new qe(i,3));let a=new _i({vertexColors:!0,toneMapped:!1});super(r,a),this.type="AxesHelper"}setColors(e,t,i){let r=new ke,a=this.geometry.attributes.color.array;return r.set(e),r.toArray(a,0),r.toArray(a,3),r.set(t),r.toArray(a,6),r.toArray(a,9),r.set(i),r.toArray(a,12),r.toArray(a,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},S_=class{constructor(){this.type="ShapePath",this.color=new ke,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new jn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,i,r){return this.currentPath.quadraticCurveTo(e,t,i,r),this}bezierCurveTo(e,t,i,r,a,n){return this.currentPath.bezierCurveTo(e,t,i,r,a,n),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(o,l){let h=!1,c=l.length;for(let u=0,p=c-1;u<c;p=u++){let d=l[u],g=l[p];d.y>o.y!=g.y>o.y&&o.x<(g.x-d.x)*(o.y-d.y)/(g.y-d.y)+d.x&&(h=!h)}return h}function t(o,l){let h=l.getCenter(new se);if(e(h,o))return h;let c=h.y,u=[],p=o.length;for(let d=0;d<p;d++){let g=o[d],y=o[(d+1)%p];if(g.y>c!=y.y>c){let v=g.x+(c-g.y)*(y.x-g.x)/(y.y-g.y);u.push(v)}}return u.length>1&&(u.sort((d,g)=>d-g),h.x=(u[0]+u[1])/2),h}let i=this.userData.style&&this.userData.style.fillRule||"nonzero";i!=="nonzero"&&i!=="evenodd"&&(Le('Fill-rule "'+i+'" is not supported, falling back to "nonzero".'),i="nonzero");let r=i==="nonzero"?(o=>o!==0):(o=>(o&1)!==0),a=[];for(let o of this.subPaths){let l=o.getPoints();if(l.length<3)continue;let h=mr.area(l);if(h===0)continue;let c=new Gf;for(let u=0;u<l.length;u++)c.expandByPoint(l[u]);a.push({subPath:o,points:l,boundingBox:c,interiorPoint:t(l,c),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}a.sort((o,l)=>l.absArea-o.absArea);for(let o=0;o<a.length;o++){let l=a[o],h=0;for(let c=o-1;c>=0;c--){let u=a[c];if(u.boundingBox.containsBox(l.boundingBox)&&e(l.interiorPoint,u.points)){l.container=u.exclude?u.container:u,h=u.winding,l.winding+=h;break}}r(l.winding)===r(h)&&(l.exclude=!0)}for(let o of a)o.exclude||(o.role=o.container===null||o.container.role==="hole"?"outer":"hole");let n=[],s=new Map;for(let o of a){if(o.exclude||o.role!=="outer")continue;let l=new is;l.curves=o.subPath.curves,n.push(l),s.set(o,l)}for(let o of a){if(o.exclude||o.role!=="hole")continue;let l=s.get(o.container);if(!l)continue;let h=new jn;h.curves=o.subPath.curves,l.holes.push(h)}return n}},M_=class extends Zi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function b_(e,t){let i=e.image&&e.image.width?e.image.width/e.image.height:1;return i>t?(e.repeat.x=1,e.repeat.y=i/t,e.offset.x=0,e.offset.y=(1-e.repeat.y)/2):(e.repeat.x=t/i,e.repeat.y=1,e.offset.x=(1-e.repeat.x)/2,e.offset.y=0),e}function E_(e,t){let i=e.image&&e.image.width?e.image.width/e.image.height:1;return i>t?(e.repeat.x=t/i,e.repeat.y=1,e.offset.x=(1-e.repeat.x)/2,e.offset.y=0):(e.repeat.x=1,e.repeat.y=i/t,e.offset.x=0,e.offset.y=(1-e.repeat.y)/2),e}function w_(e){return e.repeat.x=1,e.repeat.y=1,e.offset.x=0,e.offset.y=0,e}function Ah(e,t,i,r){let a=T_(r);switch(i){case Vh:return e*t;case il:return e*t/a.components*a.byteLength;case es:return e*t/a.components*a.byteLength;case Dr:return e*t*2/a.components*a.byteLength;case rl:return e*t*2/a.components*a.byteLength;case Wh:return e*t*3/a.components*a.byteLength;case bi:return e*t*4/a.components*a.byteLength;case al:return e*t*4/a.components*a.byteLength;case Rn:case Cn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Pn:case In:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case _o:case xo:return Math.max(e,16)*Math.max(t,8)/4;case vo:case yo:return Math.max(e,8)*Math.max(t,8)/2;case So:case Mo:case Eo:case wo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case bo:case Fn:case To:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ao:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ro:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Co:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Po:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Io:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Lo:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Do:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Uo:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case No:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Oo:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Fo:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Bo:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case zo:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ho:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case ko:case Go:case Vo:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Wo:case Xo:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Bn:case jo:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function T_(e){switch(e){case Mi:case zh:return{byteLength:1,components:1};case Ya:case Hh:case qi:return{byteLength:2,components:1};case el:case tl:return{byteLength:2,components:4};case Ni:case Qo:case mi:return{byteLength:4,components:1};case kh:case Gh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}var A_=class{static contain(e,t){return b_(e,t)}static cover(e,t){return E_(e,t)}static fill(e){return w_(e)}static getByteLength(e,t,i,r){return Ah(e,t,i,r)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Wf(){let e=null,t=!1,i=null,r=null;function a(n,s){r=e.requestAnimationFrame(a),i(n,s)}return{start:function(){t!==!0&&i!==null&&e!==null&&(r=e.requestAnimationFrame(a),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(n){i=n},setContext:function(n){e=n}}}function R_(e){let t=new WeakMap;function i(o,l){let h=o.array,c=o.usage,u=h.byteLength,p=e.createBuffer();e.bindBuffer(l,p),e.bufferData(l,h,c),o.onUploadCallback();let d;if(h instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)d=e.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(h instanceof Int16Array)d=e.SHORT;else if(h instanceof Uint32Array)d=e.UNSIGNED_INT;else if(h instanceof Int32Array)d=e.INT;else if(h instanceof Int8Array)d=e.BYTE;else if(h instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:d,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function r(o,l,h){let c=l.array,u=l.updateRanges;if(e.bindBuffer(h,o),u.length===0)e.bufferSubData(h,0,c);else{u.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<u.length;d++){let g=u[p],y=u[d];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++p,u[p]=y)}u.length=p+1;for(let d=0,g=u.length;d<g;d++){let y=u[d];e.bufferSubData(h,y.start*c.BYTES_PER_ELEMENT,c,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=t.get(o);if(h===void 0)t.set(o,i(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,o,l),h.version=o.version}}return{get:a,remove:n,update:s}}var C_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,P_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,I_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,L_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,U_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,N_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,O_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,B_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,z_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,H_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,k_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,G_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,V_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,W_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,X_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,j_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,q_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Y_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Z_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,J_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,K_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,$_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Q_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,ey=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ty=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,iy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ry=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ay="gl_FragColor = linearToOutputTexel( gl_FragColor );",ny=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,sy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,oy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,ly=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,hy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,uy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,py=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,my=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,gy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_y=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,xy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Sy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,My=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,by=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ey=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ty=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ay=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ry=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Cy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Py=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Iy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ly=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Uy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ny=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Oy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,By=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ky=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gy=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Xy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,qy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Yy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Ky=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$y=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ex=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ix=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ax=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ox=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ux=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,dx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,px=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,fx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,gx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,bx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ax=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Rx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Px=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ix=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ux=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Nx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ox=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Bx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Zx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$x=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Qx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,s1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ft={alphahash_fragment:C_,alphahash_pars_fragment:P_,alphamap_fragment:I_,alphamap_pars_fragment:L_,alphatest_fragment:D_,alphatest_pars_fragment:U_,aomap_fragment:N_,aomap_pars_fragment:O_,batching_pars_vertex:F_,batching_vertex:B_,begin_vertex:z_,beginnormal_vertex:H_,bsdfs:k_,iridescence_fragment:G_,bumpmap_pars_fragment:V_,clipping_planes_fragment:W_,clipping_planes_pars_fragment:X_,clipping_planes_pars_vertex:j_,clipping_planes_vertex:q_,color_fragment:Y_,color_pars_fragment:Z_,color_pars_vertex:J_,color_vertex:K_,common:$_,defaultnormal_vertex:Q_,displacementmap_pars_vertex:ey,displacementmap_vertex:ty,emissivemap_fragment:iy,emissivemap_pars_fragment:ry,colorspace_fragment:ay,colorspace_pars_fragment:ny,envmap_fragment:sy,envmap_common_pars_fragment:oy,envmap_pars_fragment:ly,envmap_pars_vertex:hy,envmap_physical_pars_fragment:xy,envmap_vertex:cy,fog_vertex:uy,fog_pars_vertex:dy,fog_fragment:py,fog_pars_fragment:fy,gradientmap_pars_fragment:my,lightmap_pars_fragment:gy,lights_lambert_fragment:vy,lights_lambert_pars_fragment:_y,lights_pars_begin:yy,lights_toon_fragment:Sy,lights_toon_pars_fragment:My,lights_phong_fragment:by,lights_phong_pars_fragment:Ey,lights_physical_fragment:wy,lights_physical_pars_fragment:Ty,lights_fragment_begin:Ay,lights_fragment_maps:Ry,lights_fragment_end:Cy,lightprobes_pars_fragment:Py,logdepthbuf_fragment:Iy,logdepthbuf_pars_fragment:Ly,logdepthbuf_pars_vertex:Dy,logdepthbuf_vertex:Uy,map_fragment:Ny,map_pars_fragment:Oy,map_particle_fragment:Fy,map_particle_pars_fragment:By,metalnessmap_fragment:zy,metalnessmap_pars_fragment:Hy,morphinstance_vertex:ky,morphcolor_vertex:Gy,morphnormal_vertex:Vy,morphtarget_pars_vertex:Wy,morphtarget_vertex:Xy,normal_fragment_begin:jy,normal_fragment_maps:qy,normal_pars_fragment:Yy,normal_pars_vertex:Zy,normal_vertex:Jy,normalmap_pars_fragment:Ky,clearcoat_normal_fragment_begin:$y,clearcoat_normal_fragment_maps:Qy,clearcoat_pars_fragment:ex,iridescence_pars_fragment:tx,opaque_fragment:ix,packing:rx,premultiplied_alpha_fragment:ax,project_vertex:nx,dithering_fragment:sx,dithering_pars_fragment:ox,roughnessmap_fragment:lx,roughnessmap_pars_fragment:hx,shadowmap_pars_fragment:cx,shadowmap_pars_vertex:ux,shadowmap_vertex:dx,shadowmask_pars_fragment:px,skinbase_vertex:fx,skinning_pars_vertex:mx,skinning_vertex:gx,skinnormal_vertex:vx,specularmap_fragment:_x,specularmap_pars_fragment:yx,tonemapping_fragment:xx,tonemapping_pars_fragment:Sx,transmission_fragment:Mx,transmission_pars_fragment:bx,uv_pars_fragment:Ex,uv_pars_vertex:wx,uv_vertex:Tx,worldpos_vertex:Ax,background_vert:Rx,background_frag:Cx,backgroundCube_vert:Px,backgroundCube_frag:Ix,cube_vert:Lx,cube_frag:Dx,depth_vert:Ux,depth_frag:Nx,distance_vert:Ox,distance_frag:Fx,equirect_vert:Bx,equirect_frag:zx,linedashed_vert:Hx,linedashed_frag:kx,meshbasic_vert:Gx,meshbasic_frag:Vx,meshlambert_vert:Wx,meshlambert_frag:Xx,meshmatcap_vert:jx,meshmatcap_frag:qx,meshnormal_vert:Yx,meshnormal_frag:Zx,meshphong_vert:Jx,meshphong_frag:Kx,meshphysical_vert:$x,meshphysical_frag:Qx,meshtoon_vert:e1,meshtoon_frag:t1,points_vert:i1,points_frag:r1,shadow_vert:a1,shadow_frag:n1,sprite_vert:s1,sprite_frag:o1},Be={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ut}},envmap:{envMap:{value:null},envMapRotation:{value:new ut},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ut},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0},uvTransform:{value:new ut}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}}},Xi={basic:{uniforms:fi([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.fog]),vertexShader:ft.meshbasic_vert,fragmentShader:ft.meshbasic_frag},lambert:{uniforms:fi([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,Be.lights,{emissive:{value:new ke(0)},envMapIntensity:{value:1}}]),vertexShader:ft.meshlambert_vert,fragmentShader:ft.meshlambert_frag},phong:{uniforms:fi([Be.common,Be.specularmap,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,Be.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ft.meshphong_vert,fragmentShader:ft.meshphong_frag},standard:{uniforms:fi([Be.common,Be.envmap,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.roughnessmap,Be.metalnessmap,Be.fog,Be.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ft.meshphysical_vert,fragmentShader:ft.meshphysical_frag},toon:{uniforms:fi([Be.common,Be.aomap,Be.lightmap,Be.emissivemap,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.gradientmap,Be.fog,Be.lights,{emissive:{value:new ke(0)}}]),vertexShader:ft.meshtoon_vert,fragmentShader:ft.meshtoon_frag},matcap:{uniforms:fi([Be.common,Be.bumpmap,Be.normalmap,Be.displacementmap,Be.fog,{matcap:{value:null}}]),vertexShader:ft.meshmatcap_vert,fragmentShader:ft.meshmatcap_frag},points:{uniforms:fi([Be.points,Be.fog]),vertexShader:ft.points_vert,fragmentShader:ft.points_frag},dashed:{uniforms:fi([Be.common,Be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ft.linedashed_vert,fragmentShader:ft.linedashed_frag},depth:{uniforms:fi([Be.common,Be.displacementmap]),vertexShader:ft.depth_vert,fragmentShader:ft.depth_frag},normal:{uniforms:fi([Be.common,Be.bumpmap,Be.normalmap,Be.displacementmap,{opacity:{value:1}}]),vertexShader:ft.meshnormal_vert,fragmentShader:ft.meshnormal_frag},sprite:{uniforms:fi([Be.sprite,Be.fog]),vertexShader:ft.sprite_vert,fragmentShader:ft.sprite_frag},background:{uniforms:{uvTransform:{value:new ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ft.background_vert,fragmentShader:ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ut}},vertexShader:ft.backgroundCube_vert,fragmentShader:ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ft.cube_vert,fragmentShader:ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ft.equirect_vert,fragmentShader:ft.equirect_frag},distance:{uniforms:fi([Be.common,Be.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ft.distance_vert,fragmentShader:ft.distance_frag},shadow:{uniforms:fi([Be.lights,Be.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:ft.shadow_vert,fragmentShader:ft.shadow_frag}};Xi.physical={uniforms:fi([Xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ut},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ut},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ut},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ut},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ut},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ut},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ut},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ut}}]),vertexShader:ft.meshphysical_vert,fragmentShader:ft.meshphysical_frag};var to={r:0,b:0,g:0},l1=new lt,Xf=new ut;Xf.set(-1,0,0,0,1,0,0,0,1);function h1(e,t,i,r,a,n){let s=new ke(0),o=a===!0?0:1,l,h,c=null,u=0,p=null;function d(f){let S=f.isScene===!0?f.background:null;if(S&&S.isTexture){let x=f.backgroundBlurriness>0;S=t.get(S,x)}return S}function g(f){let S=!1,x=d(f);x===null?v(s,o):x&&x.isColor&&(v(x,1),S=!0);let A=e.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,n):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,n),(e.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function y(f,S){let x=d(S);x&&x.isCubeTexture?(h===void 0&&(h=new it(new Qt(1,1,1),new Sr({name:"BackgroundCubeMaterial",uniforms:$a(Xi.backgroundCube.uniforms),vertexShader:Xi.backgroundCube.vertexShader,fragmentShader:Xi.backgroundCube.fragmentShader,side:gi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,b,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(l1.makeRotationFromEuler(S.backgroundRotation)).transpose(),x.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(Xf),h.material.toneMapped=yt.getTransfer(x.colorSpace)!==bt,(c!==x||u!==x.version||p!==e.toneMapping)&&(h.material.needsUpdate=!0,c=x,u=x.version,p=e.toneMapping),h.layers.enableAll(),f.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new it(new Fi(2,2),new Sr({name:"BackgroundMaterial",uniforms:$a(Xi.background.uniforms),vertexShader:Xi.background.vertexShader,fragmentShader:Xi.background.fragmentShader,side:Ir,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=yt.getTransfer(x.colorSpace)!==bt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(c!==x||u!==x.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,c=x,u=x.version,p=e.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}function v(f,S){f.getRGB(to,cf(e)),i.buffers.color.setClear(to.r,to.g,to.b,S,n)}function m(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(f,S=1){s.set(f),o=S,v(s,o)},getClearAlpha:function(){return o},setClearAlpha:function(f){o=f,v(s,o)},render:g,addToRenderList:y,dispose:m}}function c1(e,t){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},a=p(null),n=a,s=!1;function o(I,L,Y,D,B){let Z=!1,V=u(I,D,Y,L);n!==V&&(n=V,h(n.object)),Z=d(I,D,Y,B),Z&&g(I,D,Y,B),B!==null&&t.update(B,e.ELEMENT_ARRAY_BUFFER),(Z||s)&&(s=!1,x(I,L,Y,D),B!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return e.createVertexArray()}function h(I){return e.bindVertexArray(I)}function c(I){return e.deleteVertexArray(I)}function u(I,L,Y,D){let B=D.wireframe===!0,Z=r[L.id];Z===void 0&&(Z={},r[L.id]=Z);let V=I.isInstancedMesh===!0?I.id:0,pe=Z[V];pe===void 0&&(pe={},Z[V]=pe);let z=pe[Y.id];z===void 0&&(z={},pe[Y.id]=z);let W=z[B];return W===void 0&&(W=p(l()),z[B]=W),W}function p(I){let L=[],Y=[],D=[];for(let B=0;B<i;B++)L[B]=0,Y[B]=0,D[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:Y,attributeDivisors:D,object:I,attributes:{},index:null}}function d(I,L,Y,D){let B=n.attributes,Z=L.attributes,V=0,pe=Y.getAttributes();for(let z in pe)if(pe[z].location>=0){let W=B[z],Q=Z[z];if(Q===void 0&&(z==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),z==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor)),W===void 0||W.attribute!==Q||Q&&W.data!==Q.data)return!0;V++}return n.attributesNum!==V||n.index!==D}function g(I,L,Y,D){let B={},Z=L.attributes,V=0,pe=Y.getAttributes();for(let z in pe)if(pe[z].location>=0){let W=Z[z];W===void 0&&(z==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),z==="instanceColor"&&I.instanceColor&&(W=I.instanceColor));let Q={};Q.attribute=W,W&&W.data&&(Q.data=W.data),B[z]=Q,V++}n.attributes=B,n.attributesNum=V,n.index=D}function y(){let I=n.newAttributes;for(let L=0,Y=I.length;L<Y;L++)I[L]=0}function v(I){m(I,0)}function m(I,L){let Y=n.newAttributes,D=n.enabledAttributes,B=n.attributeDivisors;Y[I]=1,D[I]===0&&(e.enableVertexAttribArray(I),D[I]=1),B[I]!==L&&(e.vertexAttribDivisor(I,L),B[I]=L)}function f(){let I=n.newAttributes,L=n.enabledAttributes;for(let Y=0,D=L.length;Y<D;Y++)L[Y]!==I[Y]&&(e.disableVertexAttribArray(Y),L[Y]=0)}function S(I,L,Y,D,B,Z,V){V===!0?e.vertexAttribIPointer(I,L,Y,B,Z):e.vertexAttribPointer(I,L,Y,D,B,Z)}function x(I,L,Y,D){y();let B=D.attributes,Z=Y.getAttributes(),V=L.defaultAttributeValues;for(let pe in Z){let z=Z[pe];if(z.location>=0){let W=B[pe];if(W===void 0&&(pe==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),pe==="instanceColor"&&I.instanceColor&&(W=I.instanceColor)),W!==void 0){let Q=W.normalized,ve=W.itemSize,$=t.get(W);if($===void 0)continue;let he=$.buffer,Pe=$.type,Ye=$.bytesPerElement,Ve=Pe===e.INT||Pe===e.UNSIGNED_INT||W.gpuType===Qo;if(W.isInterleavedBufferAttribute){let fe=W.data,rt=fe.isInterleavedBuffer===!0?fe.stride:fe.itemSize,pt=W.offset;if(fe.isInstancedInterleavedBuffer||fe.isInstancedBufferAttribute){for(let Ue=0;Ue<z.locationSize;Ue++)m(z.location+Ue,fe.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ue=0;Ue<z.locationSize;Ue++)v(z.location+Ue);e.bindBuffer(e.ARRAY_BUFFER,he);for(let Ue=0;Ue<z.locationSize;Ue++)S(z.location+Ue,ve/z.locationSize,Pe,Q,rt*Ye,(pt+ve/z.locationSize*Ue)*Ye,Ve)}else{if(W.isInstancedBufferAttribute){for(let fe=0;fe<z.locationSize;fe++)m(z.location+fe,W.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let fe=0;fe<z.locationSize;fe++)v(z.location+fe);e.bindBuffer(e.ARRAY_BUFFER,he);for(let fe=0;fe<z.locationSize;fe++)S(z.location+fe,ve/z.locationSize,Pe,Q,ve*Ye,ve/z.locationSize*fe*Ye,Ve)}}else if(V!==void 0){let Q=V[pe];if(Q!==void 0)switch(Q.length){case 2:e.vertexAttrib2fv(z.location,Q);break;case 3:e.vertexAttrib3fv(z.location,Q);break;case 4:e.vertexAttrib4fv(z.location,Q);break;default:e.vertexAttrib1fv(z.location,Q)}}}}f()}function A(){E();for(let I in r){let L=r[I];for(let Y in L){let D=L[Y];for(let B in D){let Z=D[B];for(let V in Z)c(Z[V].object),delete Z[V];delete D[B]}}delete r[I]}}function b(I){if(r[I.id]===void 0)return;let L=r[I.id];for(let Y in L){let D=L[Y];for(let B in D){let Z=D[B];for(let V in Z)c(Z[V].object),delete Z[V];delete D[B]}}delete r[I.id]}function _(I){for(let L in r){let Y=r[L];for(let D in Y){let B=Y[D];if(B[I.id]===void 0)continue;let Z=B[I.id];for(let V in Z)c(Z[V].object),delete Z[V];delete B[I.id]}}}function M(I){for(let L in r){let Y=r[L],D=I.isInstancedMesh===!0?I.id:0,B=Y[D];if(B!==void 0){for(let Z in B){let V=B[Z];for(let pe in V)c(V[pe].object),delete V[pe];delete B[Z]}delete Y[D],Object.keys(Y).length===0&&delete r[L]}}}function E(){P(),s=!0,n!==a&&(n=a,h(n.object))}function P(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfObject:M,releaseStatesOfProgram:_,initAttributes:y,enableAttribute:v,disableUnusedAttributes:f}}function u1(e,t,i){let r;function a(l){r=l}function n(l,h){e.drawArrays(r,l,h),i.update(h,r,1)}function s(l,h,c){c!==0&&(e.drawArraysInstanced(r,l,h,c),i.update(h,r,c))}function o(l,h,c){if(c===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,l,0,h,0,c);let u=0;for(let p=0;p<c;p++)u+=h[p];i.update(u,r,1)}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o}function d1(e,t,i,r){let a;function n(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){let _=t.get("EXT_texture_filter_anisotropic");a=e.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(_){return!(_!==bi&&r.convert(_)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){let M=_===qi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==Mi&&_!==mi&&!M&&r.convert(_)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=i.precision!==void 0?i.precision:"highp",c=l(h);c!==h&&(Le("WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);let u=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.logarithmicDepthBuffer===!0&&u===!1;i.reversedDepthBuffer===!0&&u===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),i.logarithmicDepthBuffer===!0&&u===!0&&Le("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=e.getParameter(e.MAX_TEXTURE_SIZE),v=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),m=e.getParameter(e.MAX_VERTEX_ATTRIBS),f=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),S=e.getParameter(e.MAX_VARYING_VECTORS),x=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),A=e.getParameter(e.MAX_SAMPLES),b=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:p,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:v,maxAttributes:m,maxVertexUniforms:f,maxVaryings:S,maxFragmentUniforms:x,maxSamples:A,samples:b}}function p1(e){let t=this,i=null,r=0,a=!1,n=!1,s=new Ri,o=new ut,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){let d=u.length!==0||p||r!==0||a;return a=p,r=u.length,d},this.beginShadows=function(){n=!0,c(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(u,p){i=c(u,p,0)},this.setState=function(u,p,d){let g=u.clippingPlanes,y=u.clipIntersection,v=u.clipShadows,m=e.get(u);if(!a||g===null||g.length===0||n&&!v)n?c(null):h();else{let f=n?0:r,S=f*4,x=m.clippingState||null;l.value=x,x=c(g,p,S,d);for(let A=0;A!==S;++A)x[A]=i[A];m.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=f}};function h(){l.value!==i&&(l.value=i,l.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function c(u,p,d,g){let y=u!==null?u.length:0,v=null;if(y!==0){if(v=l.value,g!==!0||v===null){let m=d+y*4,f=p.matrixWorldInverse;o.getNormalMatrix(f),(v===null||v.length<m)&&(v=new Float32Array(m));for(let S=0,x=d;S!==y;++S,x+=4)s.copy(u[S]).applyMatrix4(f,o),s.normal.toArray(v,x),v[x+3]=s.constant}l.value=v,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,v}}var bl=class extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new ts(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Qt(5,5,5),a=new Sr({name:"CubemapFromEquirect",uniforms:$a(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:gi,blending:na});a.uniforms.tEquirect.value=t;let n=new it(r,a),s=t.minFilter;return t.minFilter===ji&&(t.minFilter=Nt),new Ko(1,10,this).update(e,n),t.minFilter=s,n.geometry.dispose(),n.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let a=e.getRenderTarget();for(let n=0;n<6;n++)e.setRenderTarget(this,n),e.clear(t,i,r);e.setRenderTarget(a)}},Wu=256,f1=3,m1=20,jf=256,qf=16,g1=3,v1=new R,_1=new ke,Rh=class Yf{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ko(1,10,null),this._boxMesh=new it(new Qt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,i=0,r=.1,a=100,n={}){let{size:s=256,position:o=v1}=n,l=this._renderer;this._setSize(s);let h=this._allocateTarget(),c=this._getSourceTarget(!0);i>0&&(c.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,p=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,y=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,y===null&&(t.background=l.getClearColor(_1));let v=new Ko(r,a,c);return v.position.copy(o),v.update(l,t),l.autoClear=u,l.autoClearColor=p,l.autoClearDepth=d,l.autoClearStencil=g,t.background=y,i>0&&(c.texture.mipmapsAutoUpdate=!0,this._blur(h,i)),this._applyPMREM(h),h}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ju(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,i){return i>0?1-Math.sqrt(1-t/i):0}_setSize(t){this._cubeSize=Math.max(Wu,Zd(t))}_fromTexture(t,i){t.mapping===_r||t.mapping===oa?this._setSize(t.image.length===0?Wu:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let r=i||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(r),r}_allocateTarget(){let t=this._cubeSize,i=Xu(t,!1,!1),r=Math.log2(t)-f1;for(let a=0;a<=r;a++)i.texture.mipmaps.push({width:t>>a,height:t>>a});return i.texture.name="PMREM",i.texture.isPMREMTexture=!0,i}_getSourceTarget(t=!1){let i=this._cubeSize,r=this._sourceTarget;return(r===null||r.width!==i||t&&r.depthBuffer===!1)&&(r!==null&&r.dispose(),this._sourceTarget=Xu(i,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,i,r){let a=this._boxMesh,n=this._cubeCamera;a.material=r,n.renderTarget=t,n.activeMipmapLevel=i;let s=t.width>>i;t.viewport.set(0,0,s,s),n.update(this._renderer,a),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let i;t.mapping===_r||t.mapping===oa?(this._cubemapMaterial===null&&(this._cubemapMaterial=qu()),i=this._cubemapMaterial,i.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ju()),i=this._equirectMaterial),i.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,i)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=y1(),this._integrationMaterial=x1());let i=this._cubeSize,r=t.texture.mipmaps.length-1,a=this._ggxMaterial.uniforms;a.envMap.value=this._sourceTarget.texture;let n=this._integrationMaterial.uniforms;n.envMap.value=this._sourceTarget.texture,n.sourceLod.value=Math.log2(i/qf);for(let s=0;s<=r;s++){let o=Yf.lodToRoughness(s,r);if(s>r-g1)n.roughness.value=o,this._renderCube(t,s,this._integrationMaterial);else{let l=o>0?Math.log2(i)+.5*Math.log2(6/(jf*Math.pow(o,4)))+.5:0;a.roughness.value=o,a.lodBias.value=l,this._renderCube(t,s,this._ggxMaterial)}}}_blur(t,i){this._blurMaterial===null&&(this._blurMaterial=S1());let r=this._blurMaterial,a=r.uniforms,n=this._sourceTarget;a.sigma.value=Math.min(i,Math.PI)/Math.SQRT2,a.envMap.value=n.texture,this._renderCube(t,0,r),a.envMap.value=t.texture,this._renderCube(n,0,r)}};function Xu(e,t,i){return new bl(e,{minFilter:ji,generateMipmaps:t,type:qi,colorSpace:kn,depthBuffer:i})}function ns(e,t,i){return new Sr({name:e,uniforms:t,vertexShader:ft.cube_vert,fragmentShader:i,side:gi,blending:na,depthTest:!1,depthWrite:!1})}function y1(){return ns("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${jf}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function x1(){return ns("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:qf}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function S1(){return ns("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${m1}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ju(){return ns("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function qu(){return ns("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function M1(e){let t=new WeakMap,i=new WeakMap,r=null;function a(p,d=!1){return p==null?null:d?s(p):n(p)}function n(p){if(p&&p.isTexture){let d=p.mapping;if(d===wn||d===Tn)if(t.has(p)){let g=t.get(p).texture;return o(g,p.mapping)}else{let g=p.image;if(g&&g.height>0){let y=new bl(g.height);return y.fromEquirectangularTexture(e,p),t.set(p,y),p.addEventListener("dispose",h),o(y.texture,p.mapping)}else return null}}return p}function s(p){if(p&&p.isTexture&&p.isPMREMTexture!==!0){let d=p.mapping,g=d===wn||d===Tn,y=d===_r||d===oa;if(g||y){let v=i.get(p),m=v!==void 0?v.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==m)return r===null&&(r=new Rh(e)),v=g?r.fromEquirectangular(p,v):r.fromCubemap(p,v),v.texture.pmremVersion=p.pmremVersion,i.set(p,v),v.texture;if(v!==void 0)return v.texture;{let f=p.image;return g&&f&&f.height>0||y&&f&&l(f)?(r===null&&(r=new Rh(e)),v=g?r.fromEquirectangular(p):r.fromCubemap(p),v.texture.pmremVersion=p.pmremVersion,i.set(p,v),p.addEventListener("dispose",c),v.texture):null}}}return p}function o(p,d){return d===wn?p.mapping=_r:d===Tn&&(p.mapping=oa),p}function l(p){let d=0,g=6;for(let y=0;y<g;y++)p[y]!==void 0&&d++;return d===g}function h(p){let d=p.target;d.removeEventListener("dispose",h);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function c(p){let d=p.target;d.removeEventListener("dispose",c);let g=i.get(d);g!==void 0&&(i.delete(d),g.dispose())}function u(){t=new WeakMap,i=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:a,dispose:u}}function b1(e){let t={};function i(r){if(t[r]!==void 0)return t[r];let a=e.getExtension(r);return t[r]=a,a}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){let a=i(r);return a===null&&gr("WebGLRenderer: "+r+" extension not supported."),a}}}function E1(e,t,i,r){let a={},n=new WeakMap,s=new FinalizationRegistry(g=>delete a[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(let v in g.attributes)t.remove(g.attributes[v]);g.removeEventListener("dispose",o),delete a[g.id],s.unregister(g);let y=n.get(g);y&&(t.remove(y),n.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,i.memory.geometries--}function h(g,y){return a[y.id]!==void 0||(y.addEventListener("dispose",o),a[y.id]=new WeakRef(y),s.register(y,y.id,y),i.memory.geometries++),y}function c(g){let y=g.attributes;for(let v in y)t.update(y[v],e.ARRAY_BUFFER)}function u(g){let y=g.index,v=g.attributes.position,m=0;if(v===void 0)return;let f=y!==null?y.array.length:v.array.length/3-1,S=v.count>=65535?$h:Kh,x=new S(Math.ceil(f/3)*6,1),A=x.array;if(y!==null){let _=y.array;m=y.version;for(let M=0,E=0;M<f;M+=3){let P=_[M+0],I=_[M+1],L=_[M+2];A[E++]=P,A[E++]=I,A[E++]=I,A[E++]=L,A[E++]=L,A[E++]=P}}else{m=v.version;for(let _=0,M=0;_<f;_+=3){let E=_+0,P=_+1,I=_+2;A[M++]=E,A[M++]=P,A[M++]=P,A[M++]=I,A[M++]=I,A[M++]=E}}x.version=m;let b=n.get(g);b&&t.remove(b),n.set(g,x)}function p(g){let y=n.get(g);if(y){let v=g.index;v!==null&&y.version<v.version&&u(g)}else u(g);return n.get(g)}function d(){for(let g in a){let y=a[g].deref();y!==void 0&&l(y)}}return{get:h,update:c,getWireframeAttribute:p,dispose:d}}function w1(e,t,i){let r;function a(u){r=u}let n,s;function o(u){n=u.type,s=u.bytesPerElement}function l(u,p){e.drawElements(r,p,n,u*s),i.update(p,r,1)}function h(u,p,d){d!==0&&(e.drawElementsInstanced(r,p,n,u*s,d),i.update(p,r,d))}function c(u,p,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,p,0,n,u,0,d);let g=0;for(let y=0;y<d;y++)g+=p[y];i.update(g,r,1)}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c}function T1(e){let t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(n,s,o){switch(i.calls++,s){case e.TRIANGLES:i.triangles+=o*(n/3);break;case e.LINES:i.lines+=o*(n/2);break;case e.LINE_STRIP:i.lines+=o*(n-1);break;case e.LINE_LOOP:i.lines+=o*n;break;case e.POINTS:i.points+=o*n;break;default:Qe("WebGLInfo: Unknown draw mode:",s);break}}function a(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:a,update:r}}function A1(e,t,i){let r=new WeakMap,a=new Ct;function n(s,o,l){let h=s.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=c!==void 0?c.length:0,p=r.get(o);if(p===void 0||p.count!==u){let d=function(){M.dispose(),r.delete(o),o.removeEventListener("dispose",d)};p!==void 0&&p.texture.dispose();let g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],x=0;g===!0&&(x=1),y===!0&&(x=2),v===!0&&(x=3);let A=o.attributes.position.count*x,b=1;A>t.maxTextureSize&&(b=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);let _=new Float32Array(A*b*4*u),M=new ll(_,A,b,u);M.type=mi,M.needsUpdate=!0;let E=x*4;for(let P=0;P<u;P++){let I=m[P],L=f[P],Y=S[P],D=A*b*4*P;for(let B=0;B<I.count;B++){let Z=B*E;g===!0&&(a.fromBufferAttribute(I,B),_[D+Z+0]=a.x,_[D+Z+1]=a.y,_[D+Z+2]=a.z,_[D+Z+3]=0),y===!0&&(a.fromBufferAttribute(L,B),_[D+Z+4]=a.x,_[D+Z+5]=a.y,_[D+Z+6]=a.z,_[D+Z+7]=0),v===!0&&(a.fromBufferAttribute(Y,B),_[D+Z+8]=a.x,_[D+Z+9]=a.y,_[D+Z+10]=a.z,_[D+Z+11]=Y.itemSize===4?a.w:1)}}p={count:u,texture:M,size:new se(A,b)},r.set(o,p),o.addEventListener("dispose",d)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",s.morphTexture,i);else{let d=0;for(let y=0;y<h.length;y++)d+=h[y];let g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",g),l.getUniforms().setValue(e,"morphTargetInfluences",h)}l.getUniforms().setValue(e,"morphTargetsTexture",p.texture,i),l.getUniforms().setValue(e,"morphTargetsTextureSize",p.size)}return{update:n}}function R1(e,t,i,r,a){let n=new WeakMap;function s(h){let c=a.render.frame,u=h.geometry,p=t.get(h,u);if(n.get(p)!==c&&(t.update(p),n.set(p,c)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),n.get(h)!==c&&(i.update(h.instanceMatrix,e.ARRAY_BUFFER),h.instanceColor!==null&&i.update(h.instanceColor,e.ARRAY_BUFFER),n.set(h,c))),h.isSkinnedMesh){let d=h.skeleton;n.get(d)!==c&&(d.update(),n.set(d,c))}return p}function o(){n=new WeakMap}function l(h){let c=h.target;c.removeEventListener("dispose",l),r.releaseStatesOfObject(c),i.remove(c.instanceMatrix),c.instanceColor!==null&&i.remove(c.instanceColor)}return{update:s,dispose:o}}var C1={[Lh]:"LINEAR_TONE_MAPPING",[Dh]:"REINHARD_TONE_MAPPING",[Uh]:"CINEON_TONE_MAPPING",[Nh]:"ACES_FILMIC_TONE_MAPPING",[Fh]:"AGX_TONE_MAPPING",[Qn]:"NEUTRAL_TONE_MAPPING",[Oh]:"CUSTOM_TONE_MAPPING"};function P1(e,t,i,r,a,n){let s=new Pi(t,i,{type:e,depthBuffer:a,stencilBuffer:n,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,h=null,c=new dt;c.setAttribute("position",new qe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new qe([0,2,0,0,2,0],2));let u=new pc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new it(c,u),d=new Sl(-1,1,1,-1,0,1),g=null,y=null,v=!1,m,f=null,S=[],x=!1;this.setSize=function(A,b){s.setSize(A,b),o!==null&&o.setSize(A,b),l!==null&&l.setSize(A,b);for(let _=0;_<S.length;_++){let M=S[_];M.setSize&&M.setSize(A,b)}},this.setEffects=function(A){S=A,x=S.length>0&&S[0].isRenderPass===!0;let b=s.width,_=s.height;S.length>0&&o===null&&(o=new Pi(b,_,{type:qi,depthBuffer:!1,stencilBuffer:!1}),l=new Pi(b,_,{type:qi,depthBuffer:!1,stencilBuffer:!1}));let M=a===!0&&S.some(E=>E.needsDepthTexture===!0);M!==(s.depthTexture!==null)&&(M===!0&&h===null&&(h=new ua(b,_),n===!0&&(h.format=fr,h.type=la)),s.dispose(),s.depthTexture=M?h:null,s.resolveDepthBuffer=M,s.storeMultisampledDepthBuffer=M);for(let E=0;E<S.length;E++){let P=S[E];P.setSize&&P.setSize(b,_),M&&P.needsDepthTexture===!0&&P.setDepthTexture&&P.setDepthTexture(h)}},this.begin=function(A,b){if(v||A.toneMapping===rr&&S.length===0)return!1;if(f=b,b!==null){let _=b.width,M=b.height;(s.width!==_||s.height!==M)&&this.setSize(_,M)}return x===!1&&A.setRenderTarget(s),m=A.toneMapping,A.toneMapping=rr,!0},this.hasRenderPass=function(){return x},this.end=function(A,b){A.toneMapping=m,v=!0;let _=s,M=o;for(let E=0;E<S.length;E++){let P=S[E];P.enabled!==!1&&(P.render(A,M,_,b),P.needsSwap!==!1&&(_=M,M=M===o?l:o))}if(g!==A.outputColorSpace||y!==A.toneMapping){g=A.outputColorSpace,y=A.toneMapping,u.defines={},yt.getTransfer(g)===bt&&(u.defines.SRGB_TRANSFER="");let E=C1[y];E&&(u.defines[E]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,A.setRenderTarget(f),A.render(p,d),f=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){s.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Zf=new Yt,Jf=new ua(1,1),Kf=new ac(1),$f=new ll,Qf=new hl,em=new ts,Yu=[],Zu=[],Ju=new Float32Array(16),Ku=new Float32Array(9),$u=new Float32Array(4);function rn(e,t,i){let r=e[0];if(r<=0||r>0)return e;let a=t*i,n=Yu[a];if(n===void 0&&(n=new Float32Array(a),Yu[a]=n),t!==0){r.toArray(n,0);for(let s=1,o=0;s!==t;++s)o+=i,e[s].toArray(n,o)}return n}function jt(e,t){if(e.length!==t.length)return!1;for(let i=0,r=e.length;i<r;i++)if(e[i]!==t[i])return!1;return!0}function qt(e,t){for(let i=0,r=t.length;i<r;i++)e[i]=t[i]}function El(e,t){let i=Zu[t];i===void 0&&(i=new Int32Array(t),Zu[t]=i);for(let r=0;r!==t;++r)i[r]=e.allocateTextureUnit();return i}function I1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1f(this.addr,t),i[0]=t)}function L1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(jt(i,t))return;e.uniform2fv(this.addr,t),qt(i,t)}}function D1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(jt(i,t))return;e.uniform3fv(this.addr,t),qt(i,t)}}function U1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(jt(i,t))return;e.uniform4fv(this.addr,t),qt(i,t)}}function N1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(jt(i,t))return;e.uniformMatrix2fv(this.addr,!1,t),qt(i,t)}else{if(jt(i,r))return;$u.set(r),e.uniformMatrix2fv(this.addr,!1,$u),qt(i,r)}}function O1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(jt(i,t))return;e.uniformMatrix3fv(this.addr,!1,t),qt(i,t)}else{if(jt(i,r))return;Ku.set(r),e.uniformMatrix3fv(this.addr,!1,Ku),qt(i,r)}}function F1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(jt(i,t))return;e.uniformMatrix4fv(this.addr,!1,t),qt(i,t)}else{if(jt(i,r))return;Ju.set(r),e.uniformMatrix4fv(this.addr,!1,Ju),qt(i,r)}}function B1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1i(this.addr,t),i[0]=t)}function z1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(jt(i,t))return;e.uniform2iv(this.addr,t),qt(i,t)}}function H1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(jt(i,t))return;e.uniform3iv(this.addr,t),qt(i,t)}}function k1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(jt(i,t))return;e.uniform4iv(this.addr,t),qt(i,t)}}function G1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1ui(this.addr,t),i[0]=t)}function V1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(jt(i,t))return;e.uniform2uiv(this.addr,t),qt(i,t)}}function W1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(jt(i,t))return;e.uniform3uiv(this.addr,t),qt(i,t)}}function X1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(jt(i,t))return;e.uniform4uiv(this.addr,t),qt(i,t)}}function wl(e){return e.version===0&&(e.compareFunction=Yh,e.needsUpdate=!0),e}function j1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a);let n;this.type===e.SAMPLER_2D_SHADOW?n=wl(Jf):n=Zf,i.setTexture2D(t||n,a)}function q1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture3D(t||Qf,a)}function Y1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a);let n;this.type===e.SAMPLER_CUBE_SHADOW?n=wl(Kf):n=em,i.setTextureCube(t||n,a)}function Z1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture2DArray(t||$f,a)}function J1(e){switch(e){case 5126:return I1;case 35664:return L1;case 35665:return D1;case 35666:return U1;case 35674:return N1;case 35675:return O1;case 35676:return F1;case 5124:case 35670:return B1;case 35667:case 35671:return z1;case 35668:case 35672:return H1;case 35669:case 35673:return k1;case 5125:return G1;case 36294:return V1;case 36295:return W1;case 36296:return X1;case 35678:case 36198:case 36298:case 36306:case 35682:return j1;case 35679:case 36299:case 36307:return q1;case 35680:case 36300:case 36308:case 36293:return Y1;case 36289:case 36303:case 36311:case 36292:return Z1}}function K1(e,t){e.uniform1fv(this.addr,t)}function $1(e,t){let i=rn(t,this.size,2);e.uniform2fv(this.addr,i)}function Q1(e,t){let i=rn(t,this.size,3);e.uniform3fv(this.addr,i)}function eS(e,t){let i=rn(t,this.size,4);e.uniform4fv(this.addr,i)}function tS(e,t){let i=rn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,i)}function iS(e,t){let i=rn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,i)}function rS(e,t){let i=rn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,i)}function aS(e,t){e.uniform1iv(this.addr,t)}function nS(e,t){e.uniform2iv(this.addr,t)}function sS(e,t){e.uniform3iv(this.addr,t)}function oS(e,t){e.uniform4iv(this.addr,t)}function lS(e,t){e.uniform1uiv(this.addr,t)}function hS(e,t){e.uniform2uiv(this.addr,t)}function cS(e,t){e.uniform3uiv(this.addr,t)}function uS(e,t){e.uniform4uiv(this.addr,t)}function dS(e,t,i){let r=this.cache,a=t.length,n=El(i,a);jt(r,n)||(e.uniform1iv(this.addr,n),qt(r,n));let s;this.type===e.SAMPLER_2D_SHADOW?s=wl(Jf):s=Zf;for(let o=0;o!==a;++o)i.setTexture2D(t[o]||s,n[o])}function pS(e,t,i){let r=this.cache,a=t.length,n=El(i,a);jt(r,n)||(e.uniform1iv(this.addr,n),qt(r,n));for(let s=0;s!==a;++s)i.setTexture3D(t[s]||Qf,n[s])}function fS(e,t,i){let r=this.cache,a=t.length,n=El(i,a);jt(r,n)||(e.uniform1iv(this.addr,n),qt(r,n));let s;this.type===e.SAMPLER_CUBE_SHADOW?s=wl(Kf):s=em;for(let o=0;o!==a;++o)i.setTextureCube(t[o]||s,n[o])}function mS(e,t,i){let r=this.cache,a=t.length,n=El(i,a);jt(r,n)||(e.uniform1iv(this.addr,n),qt(r,n));for(let s=0;s!==a;++s)i.setTexture2DArray(t[s]||$f,n[s])}function gS(e){switch(e){case 5126:return K1;case 35664:return $1;case 35665:return Q1;case 35666:return eS;case 35674:return tS;case 35675:return iS;case 35676:return rS;case 5124:case 35670:return aS;case 35667:case 35671:return nS;case 35668:case 35672:return sS;case 35669:case 35673:return oS;case 5125:return lS;case 36294:return hS;case 36295:return cS;case 36296:return uS;case 35678:case 36198:case 36298:case 36306:case 35682:return dS;case 35679:case 36299:case 36307:return pS;case 35680:case 36300:case 36308:case 36293:return fS;case 36289:case 36303:case 36311:case 36292:return mS}}var vS=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=J1(t.type)}},_S=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=gS(t.type)}},yS=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let a=0,n=r.length;a!==n;++a){let s=r[a];s.setValue(e,t[s.id],i)}}},ph=/(\w+)(\])?(\[|\.)?/g;function Qu(e,t){e.seq.push(t),e.map[t.id]=t}function xS(e,t,i){let r=e.name,a=r.length;for(ph.lastIndex=0;;){let n=ph.exec(r),s=ph.lastIndex,o=n[1],l=n[2]==="]",h=n[3];if(l&&(o=o|0),h===void 0||h==="["&&s+2===a){Qu(i,h===void 0?new vS(o,e,t):new _S(o,e,t));break}else{let c=i.map[o];c===void 0&&(c=new yS(o),Qu(i,c)),i=c}}}var lo=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n),o=e.getUniformLocation(t,s.name);xS(s,o,this)}let r=[],a=[];for(let n of this.seq)n.type===e.SAMPLER_2D_SHADOW||n.type===e.SAMPLER_CUBE_SHADOW||n.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(n):a.push(n);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){let a=this.map[t];a!==void 0&&a.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,n=t.length;a!==n;++a){let s=t[a],o=i[s.id];o.needsUpdate!==!1&&s.setValue(e,o.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,a=e.length;r!==a;++r){let n=e[r];n.id in t&&i.push(n)}return i}};function ed(e,t,i){let r=e.createShader(t);return e.shaderSource(r,i),e.compileShader(r),r}var SS=37297,MS=0;function bS(e,t){let i=e.split(`
`),r=[],a=Math.max(t-6,0),n=Math.min(t+6,i.length);for(let s=a;s<n;s++){let o=s+1;r.push(`${o===t?">":" "} ${o}: ${i[s]}`)}return r.join(`
`)}var td=new ut;function ES(e){yt._getMatrix(td,yt.workingColorSpace,e);let t=`mat3( ${td.elements.map(i=>i.toFixed(4))} )`;switch(yt.getTransfer(e)){case Gn:return[t,"LinearTransferOETF"];case bt:return[t,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function id(e,t,i){let r=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(r&&a==="")return"";let n=/ERROR: 0:(\d+)/.exec(a);if(n){let s=parseInt(n[1]);return i.toUpperCase()+`

`+a+`

`+bS(e.getShaderSource(t),s)}else return a}function wS(e,t){let i=ES(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${i[1]}( vec4( ${i[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var TS={[Lh]:"Linear",[Dh]:"Reinhard",[Uh]:"Cineon",[Nh]:"ACESFilmic",[Fh]:"AgX",[Qn]:"Neutral",[Oh]:"Custom"};function AS(e,t){let i=TS[t];return i===void 0?(Le("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}var io=new R;function RS(){yt.getLuminanceCoefficients(io);let e=io.x.toFixed(4),t=io.y.toFixed(4),i=io.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function CS(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bn).join(`
`)}function PS(e){let t=[];for(let i in e){let r=e[i];r!==!1&&t.push("#define "+i+" "+r)}return t.join(`
`)}function IS(e,t){let i={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){let n=e.getActiveAttrib(t,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),i[s]={type:n.type,location:e.getAttribLocation(t,s),locationSize:o}}return i}function bn(e){return e!==""}function rd(e,t){let i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function ad(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var LS=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ch(e){return e.replace(LS,DS)}function DS(e,t){let i=ft[t];if(i===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Ch(i)}var US=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nd(e){return e.replace(US,NS)}function NS(e,t,i,r){let a="";for(let n=parseInt(t);n<parseInt(i);n++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function sd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var OS={[En]:"SHADOWMAP_TYPE_PCF",[ka]:"SHADOWMAP_TYPE_VSM"};function FS(e){return OS[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var BS={[oa]:"ENVMAP_MODE_REFRACTION"};function zS(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":BS[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var HS={[$n]:"ENVMAP_BLENDING_MULTIPLY",[Ld]:"ENVMAP_BLENDING_MIX",[Dd]:"ENVMAP_BLENDING_ADD"};function kS(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":HS[e.combine]||"ENVMAP_BLENDING_NONE"}function GS(e,t,i,r){let a=e.getContext(),n=i.defines,s=i.vertexShader,o=i.fragmentShader,l=FS(i),h=i.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",c=zS(i),u=kS(i),p=CS(i),d=PS(n),g=a.createProgram(),y,v,m=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,d].filter(bn).join(`
`),y.length>0&&(y+=`
`),v=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,d].filter(bn).join(`
`),v.length>0&&(v+=`
`)):(y=[sd(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,d,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+c:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+i.diffuseRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bn).join(`
`),v=[sd(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,d,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+h:"",i.envMap?"#define "+c:"",i.envMap?"#define "+u:"",i.envMapPMREM?"#define ENVMAP_MAX_LOD "+i.envMapMaxLod+".0":"",i.envMapPMREM?"#define ENVMAP_SIZE "+i.envMapSize+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",i.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.retroreflection?"#define USE_RETROREFLECTION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==rr?"#define TONE_MAPPING":"",i.toneMapping!==rr?ft.tonemapping_pars_fragment:"",i.toneMapping!==rr?AS("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ft.colorspace_pars_fragment,wS("linearToOutputTexel",i.outputColorSpace),RS(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(bn).join(`
`)),s=Ch(s),s=rd(s,i),s=ad(s,i),o=Ch(o),o=rd(o,i),o=ad(o,i),s=nd(s),o=nd(o),i.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,y=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,v=["#define varying in",i.glslVersion===xh?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===xh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let f=m+y+s,S=m+v+o,x=ed(a,a.VERTEX_SHADER,f),A=ed(a,a.FRAGMENT_SHADER,S);a.attachShader(g,x),a.attachShader(g,A),i.index0AttributeName!==void 0?a.bindAttribLocation(g,0,i.index0AttributeName):i.hasPositionAttribute===!0&&a.bindAttribLocation(g,0,"position"),a.linkProgram(g);function b(P){if(e.debug.checkShaderErrors){let I=a.getProgramInfoLog(g)||"",L=a.getShaderInfoLog(x)||"",Y=a.getShaderInfoLog(A)||"",D=I.trim(),B=L.trim(),Z=Y.trim(),V=!0,pe=!0;if(a.getProgramParameter(g,a.LINK_STATUS)===!1)if(V=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,g,x,A);else{let z=id(a,x,"vertex"),W=id(a,A,"fragment");Qe("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(g,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+D+`
`+z+`
`+W)}else D!==""?Le("WebGLProgram: Program Info Log:",D):(B===""||Z==="")&&(pe=!1);pe&&(P.diagnostics={runnable:V,programLog:D,vertexShader:{log:B,prefix:y},fragmentShader:{log:Z,prefix:v}})}a.deleteShader(x),a.deleteShader(A),_=new lo(a,g),M=IS(a,g)}let _;this.getUniforms=function(){return _===void 0&&b(this),_};let M;this.getAttributes=function(){return M===void 0&&b(this),M};let E=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=a.getProgramParameter(g,SS)),E},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(g),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=MS++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=x,this.fragmentShader=A,this}var VS=0,WS=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new XS(e),t.set(e,i)),i}},XS=class{constructor(e){this.id=VS++,this.code=e,this.usedTimes=0}};function jS(e){return e===Dr||e===Fn||e===Bn}function qS(e,t,i,r,a,n){let s=new cl,o=new WS,l=new Set,h=[],c=new Map,u=r.logarithmicDepthBuffer,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,M,E,P,I,L){let Y=P.fog,D=I.geometry,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,Z=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,V=t.get(_.envMap||B,Z),pe=p[_.type],z=r.precision;_.precision!==null&&(z=r.getMaxPrecision(_.precision),z!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",z,"instead."));let W=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,Q=W!==void 0?W.length:0,ve=0;D.morphAttributes.position!==void 0&&(ve=1),D.morphAttributes.normal!==void 0&&(ve=2),D.morphAttributes.color!==void 0&&(ve=3);let $,he,Pe,Ye;if(pe){let Oe=Xi[pe];$=Oe.vertexShader,he=Oe.fragmentShader}else{$=_.vertexShader,he=_.fragmentShader;let Oe=o.getVertexShaderStage(_),Tt=o.getFragmentShaderStage(_);o.update(_,Oe,Tt),Pe=Oe.id,Ye=Tt.id}let Ve=e.getRenderTarget(),fe=e.state.buffers.depth.getReversed(),rt=I.isInstancedMesh===!0,pt=I.isBatchedMesh===!0,Ue=!!_.map,vt=!!_.matcap,ue=!!V,xe=ue&&V.isPMREMTexture===!0,me=!!_.aoMap,ze=!!_.lightMap,ae=!!_.bumpMap&&_.wireframe===!1,te=!!_.normalMap,oe=!!_.displacementMap,ie=!!_.emissiveMap,be=!!_.metalnessMap,We=!!_.roughnessMap,U=_.anisotropy>0,Ie=_.clearcoat>0,_e=_.diffuseRoughness>0,Xe=_.dispersion>0,re=_.retroreflectivity>0,et=_.iridescence>0,we=_.sheen>0,je=_.transmission>0,He=U&&!!_.anisotropyMap,C=Ie&&!!_.clearcoatMap,w=Ie&&!!_.clearcoatNormalMap,X=Ie&&!!_.clearcoatRoughnessMap,ce=_e&&!!_.diffuseRoughnessMap,ee=et&&!!_.iridescenceMap,Re=et&&!!_.iridescenceThicknessMap,Ae=we&&!!_.sheenColorMap,H=we&&!!_.sheenRoughnessMap,ne=!!_.specularMap,Ne=!!_.specularColorMap,O=!!_.specularIntensityMap,K=je&&!!_.transmissionMap,de=je&&!!_.thicknessMap,Se=!!_.gradientMap,Te=!!_.alphaMap,Ce=_.alphaTest>0,$e=!!_.alphaHash,ge=!!_.extensions,ct=rr;_.toneMapped&&(Ve===null||Ve.isXRRenderTarget===!0)&&(ct=e.toneMapping);let st=xe?V.isCompressedCubeTexture?V.image[0].mipmaps:V.mipmaps:null,_t={shaderID:pe,shaderType:_.type,shaderName:_.name,vertexShader:$,fragmentShader:he,defines:_.defines,customVertexShaderID:Pe,customFragmentShaderID:Ye,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:z,batching:pt,batchingColor:pt&&I._colorsTexture!==null,instancing:rt,instancingColor:rt&&I.instanceColor!==null,instancingMorph:rt&&I.morphTexture!==null,outputColorSpace:Ve===null?e.outputColorSpace:Ve.isXRRenderTarget===!0?Ve.texture.colorSpace:yt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ue,matcap:vt,envMap:ue,envMapMode:ue&&V.mapping,envMapPMREM:xe,envMapMaxLod:xe?st.length-1:null,envMapSize:xe?st[0].width:null,aoMap:me,lightMap:ze,bumpMap:ae,normalMap:te,displacementMap:oe,emissiveMap:ie,normalMapObjectSpace:te&&_.normalMapType===zd,normalMapTangentSpace:te&&_.normalMapType===xr,packedNormalMap:te&&_.normalMapType===xr&&jS(_.normalMap.format),metalnessMap:be,roughnessMap:We,anisotropy:U,anisotropyMap:He,clearcoat:Ie,clearcoatMap:C,clearcoatNormalMap:w,clearcoatRoughnessMap:X,diffuseRoughness:_e,diffuseRoughnessMap:ce,dispersion:Xe,retroreflection:re,iridescence:et,iridescenceMap:ee,iridescenceThicknessMap:Re,sheen:we,sheenColorMap:Ae,sheenRoughnessMap:H,specularMap:ne,specularColorMap:Ne,specularIntensityMap:O,transmission:je,transmissionMap:K,thicknessMap:de,gradientMap:Se,opaque:_.transparent===!1&&_.blending===Xa&&_.alphaToCoverage===!1,alphaMap:Te,alphaTest:Ce,alphaHash:$e,combine:_.combine,mapUv:Ue&&d(_.map.channel),aoMapUv:me&&d(_.aoMap.channel),lightMapUv:ze&&d(_.lightMap.channel),bumpMapUv:ae&&d(_.bumpMap.channel),normalMapUv:te&&d(_.normalMap.channel),displacementMapUv:oe&&d(_.displacementMap.channel),emissiveMapUv:ie&&d(_.emissiveMap.channel),metalnessMapUv:be&&d(_.metalnessMap.channel),roughnessMapUv:We&&d(_.roughnessMap.channel),anisotropyMapUv:He&&d(_.anisotropyMap.channel),clearcoatMapUv:C&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:w&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:X&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ce&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:H&&d(_.sheenRoughnessMap.channel),specularMapUv:ne&&d(_.specularMap.channel),specularColorMapUv:Ne&&d(_.specularColorMap.channel),specularIntensityMapUv:O&&d(_.specularIntensityMap.channel),transmissionMapUv:K&&d(_.transmissionMap.channel),thicknessMapUv:de&&d(_.thicknessMap.channel),alphaMapUv:Te&&d(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(te||U),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(Ue||Te),fog:!!Y,useFog:_.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&te===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:fe,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ve,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:L.filter(Oe=>Oe.texture!==null).length,numClippingPlanes:n.numPlanes,numClipIntersection:n.numIntersection,dithering:_.dithering,shadowMapEnabled:e.shadowMap.enabled&&E.length>0,shadowMapType:e.shadowMap.type,toneMapping:ct,decodeVideoTexture:Ue&&_.map.isVideoTexture===!0&&yt.getTransfer(_.map.colorSpace)===bt,decodeVideoTextureEmissive:ie&&_.emissiveMap.isVideoTexture===!0&&yt.getTransfer(_.emissiveMap.colorSpace)===bt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Di,flipSided:_.side===gi,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ge&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&_.extensions.multiDraw===!0||pt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return _t.vertexUv1s=l.has(1),_t.vertexUv2s=l.has(2),_t.vertexUv3s=l.has(3),l.clear(),_t}function y(_){let M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(let E in _.defines)M.push(E),M.push(_.defines[E]);return _.isRawShaderMaterial===!1&&(v(M,_),m(M,_),M.push(e.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function v(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapPMREM),_.push(M.envMapMaxLod),_.push(M.envMapSize),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.diffuseRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.numSunLights),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numSunLightShadows),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.numLightProbeGrids),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function m(_,M){s.disableAll(),M.instancing&&s.enable(0),M.instancingColor&&s.enable(1),M.instancingMorph&&s.enable(2),M.matcap&&s.enable(3),M.envMap&&s.enable(4),M.normalMapObjectSpace&&s.enable(5),M.normalMapTangentSpace&&s.enable(6),M.clearcoat&&s.enable(7),M.iridescence&&s.enable(8),M.alphaTest&&s.enable(9),M.vertexColors&&s.enable(10),M.vertexAlphas&&s.enable(11),M.vertexUv1s&&s.enable(12),M.vertexUv2s&&s.enable(13),M.vertexUv3s&&s.enable(14),M.vertexTangents&&s.enable(15),M.anisotropy&&s.enable(16),M.alphaHash&&s.enable(17),M.batching&&s.enable(18),M.dispersion&&s.enable(19),M.retroreflection&&s.enable(24),M.diffuseRoughness&&s.enable(25),M.batchingColor&&s.enable(20),M.gradientMap&&s.enable(21),M.packedNormalMap&&s.enable(22),M.vertexNormals&&s.enable(23),_.push(s.mask),s.disableAll(),M.fog&&s.enable(0),M.useFog&&s.enable(1),M.flatShading&&s.enable(2),M.logarithmicDepthBuffer&&s.enable(3),M.reversedDepthBuffer&&s.enable(4),M.skinning&&s.enable(5),M.morphTargets&&s.enable(6),M.morphNormals&&s.enable(7),M.morphColors&&s.enable(8),M.premultipliedAlpha&&s.enable(9),M.shadowMapEnabled&&s.enable(10),M.doubleSided&&s.enable(11),M.flipSided&&s.enable(12),M.useDepthPacking&&s.enable(13),M.dithering&&s.enable(14),M.transmission&&s.enable(15),M.sheen&&s.enable(16),M.opaque&&s.enable(17),M.pointsUvs&&s.enable(18),M.decodeVideoTexture&&s.enable(19),M.decodeVideoTextureEmissive&&s.enable(20),M.alphaToCoverage&&s.enable(21),M.numLightProbeGrids>0&&s.enable(22),M.hasPositionAttribute&&s.enable(23),_.push(s.mask)}function f(_){let M=p[_.type],E;if(M){let P=Xi[M];E=uf.clone(P.uniforms)}else E=_.uniforms;return E}function S(_,M){let E=c.get(M);return E!==void 0?++E.usedTimes:(E=new GS(e,M,_,a),h.push(E),c.set(M,E)),E}function x(_){if(--_.usedTimes===0){let M=h.indexOf(_);h[M]=h[h.length-1],h.pop(),c.delete(_.cacheKey),_.destroy()}}function A(_){o.remove(_)}function b(){o.dispose()}return{getParameters:g,getProgramCacheKey:y,getUniforms:f,acquireProgram:S,releaseProgram:x,releaseShaderCache:A,programs:h,dispose:b}}function YS(){let e=new WeakMap;function t(s){return e.has(s)}function i(s){let o=e.get(s);return o===void 0&&(o={},e.set(s,o)),o}function r(s){e.delete(s)}function a(s,o,l){e.get(s)[o]=l}function n(){e=new WeakMap}return{has:t,get:i,remove:r,update:a,dispose:n}}function ZS(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function od(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function ld(){let e=[],t=0,i=[],r=[],a=[];function n(){t=0,i.length=0,r.length=0,a.length=0}function s(p){let d=0;return p.isInstancedMesh&&(d+=2),p.isSkinnedMesh&&(d+=1),d}function o(p,d,g,y,v,m){let f=e[t];return f===void 0?(f={id:p.id,object:p,geometry:d,material:g,materialVariant:s(p),groupOrder:y,renderOrder:p.renderOrder,z:v,group:m},e[t]=f):(f.id=p.id,f.object=p,f.geometry=d,f.material=g,f.materialVariant=s(p),f.groupOrder=y,f.renderOrder=p.renderOrder,f.z=v,f.group=m),t++,f}function l(p,d,g,y,v,m,f){f.reversedDepth===!0&&(v=-v);let S=o(p,d,g,y,v,m);g.transmission>0?r.push(S):g.transparent===!0?a.push(S):i.push(S)}function h(p,d,g,y,v,m){let f=o(p,d,g,y,v,m);g.transmission>0?r.unshift(f):g.transparent===!0?a.unshift(f):i.unshift(f)}function c(p,d){i.length>1&&i.sort(p||ZS),r.length>1&&r.sort(d||od),a.length>1&&a.sort(d||od)}function u(){for(let p=t,d=e.length;p<d;p++){let g=e[p];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:i,transmissive:r,transparent:a,init:n,push:l,unshift:h,finish:u,sort:c}}function JS(){let e=new WeakMap;function t(r,a){let n=e.get(r),s;return n===void 0?(s=new ld,e.set(r,[s])):a>=n.length?(s=new ld,n.push(s)):s=n[a],s}function i(){e=new WeakMap}return{get:t,dispose:i}}function KS(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={direction:new R,color:new ke};break;case"SpotLight":i={position:new R,direction:new R,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new R,color:new ke,distance:0,decay:0};break;case"HemisphereLight":i={direction:new R,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":i={color:new ke,position:new R,halfWidth:new R,halfHeight:new R};break}return e[t.id]=i,i}}}function $S(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=i,i}}}var QS=0;function eM(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function tM(e){let t=new KS,i=$S(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new R);let a=new R,n=new lt,s=new lt;function o(h){let c=0,u=0,p=0;for(let L=0;L<9;L++)r.probe[L].set(0,0,0);let d=0,g=0,y=0,v=0,m=0,f=0,S=0,x=0,A=0,b=0,_=0,M=0,E=0,P=0;h.sort(eM);for(let L=0,Y=h.length;L<Y;L++){let D=h[L],B=D.color,Z=D.intensity,V=D.distance,pe=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Dr?pe=D.shadow.map.texture:pe=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)c+=B.r*Z,u+=B.g*Z,p+=B.b*Z;else if(D.isLightProbe){for(let z=0;z<9;z++)r.probe[z].addScaledVector(D.sh.coefficients[z],Z);P++}else if(D.isSunLight){let z=t.get(D);if(z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let W=D.shadow,Q=i.get(D);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),r.sunShadow[g]=Q,r.sunShadowMap[g]=pe;let ve=W.getViewportCount();for(let $=0;$<ve;$++)r.sunShadowMatrix[y+$]=W.getMatrix($),r.sunShadowCascade[y+$]=W._cascadeData[$];y+=ve,g++}r.sun[d]=z,d++}else if(D.isDirectionalLight){let z=t.get(D);if(z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let W=D.shadow,Q=i.get(D);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,r.directionalShadow[v]=Q,r.directionalShadowMap[v]=pe,r.directionalShadowMatrix[v]=D.shadow.matrix,A++}r.directional[v]=z,v++}else if(D.isSpotLight){let z=t.get(D);z.position.setFromMatrixPosition(D.matrixWorld),z.color.copy(B).multiplyScalar(Z),z.distance=V,z.coneCos=Math.cos(D.angle),z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),z.decay=D.decay,r.spot[f]=z;let W=D.shadow;if(D.map&&(r.spotLightMap[M]=D.map,M++,W.updateMatrices(D),D.castShadow&&E++),r.spotLightMatrix[f]=W.matrix,D.castShadow){let Q=i.get(D);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,r.spotShadow[f]=Q,r.spotShadowMap[f]=pe,_++}f++}else if(D.isRectAreaLight){let z=t.get(D);z.color.copy(B).multiplyScalar(Z),z.halfWidth.set(D.width*.5,0,0),z.halfHeight.set(0,D.height*.5,0),r.rectArea[S]=z,S++}else if(D.isPointLight){let z=t.get(D);if(z.color.copy(D.color).multiplyScalar(D.intensity),z.distance=D.distance,z.decay=D.decay,D.castShadow){let W=D.shadow,Q=i.get(D);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,Q.shadowCameraNear=W.camera.near,Q.shadowCameraFar=W.camera.far,r.pointShadow[m]=Q,r.pointShadowMap[m]=pe,r.pointShadowMatrix[m]=D.shadow.matrix,b++}r.point[m]=z,m++}else if(D.isHemisphereLight){let z=t.get(D);z.skyColor.copy(D.color).multiplyScalar(Z),z.groundColor.copy(D.groundColor).multiplyScalar(Z),r.hemi[x]=z,x++}}S>0&&(e.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Be.LTC_FLOAT_1,r.rectAreaLTC2=Be.LTC_FLOAT_2):(r.rectAreaLTC1=Be.LTC_HALF_1,r.rectAreaLTC2=Be.LTC_HALF_2)),r.ambient[0]=c,r.ambient[1]=u,r.ambient[2]=p;let I=r.hash;(I.sunLength!==d||I.directionalLength!==v||I.pointLength!==m||I.spotLength!==f||I.rectAreaLength!==S||I.hemiLength!==x||I.numSunShadows!==g||I.numDirectionalShadows!==A||I.numPointShadows!==b||I.numSpotShadows!==_||I.numSpotMaps!==M||I.numLightProbes!==P)&&(r.sun.length=d,r.directional.length=v,r.spot.length=f,r.rectArea.length=S,r.point.length=m,r.hemi.length=x,r.sunShadow.length=g,r.sunShadowMap.length=g,r.sunShadowMatrix.length=y,r.sunShadowCascade.length=y,r.directionalShadow.length=A,r.directionalShadowMap.length=A,r.directionalShadowMatrix.length=A,r.pointShadow.length=b,r.pointShadowMap.length=b,r.pointShadowMatrix.length=b,r.spotShadow.length=_,r.spotShadowMap.length=_,r.spotLightMatrix.length=_+M-E,r.spotLightMap.length=M,r.numSpotLightShadowsWithMaps=E,r.numLightProbes=P,I.sunLength=d,I.directionalLength=v,I.pointLength=m,I.spotLength=f,I.rectAreaLength=S,I.hemiLength=x,I.numSunShadows=g,I.numDirectionalShadows=A,I.numPointShadows=b,I.numSpotShadows=_,I.numSpotMaps=M,I.numLightProbes=P,r.version=QS++)}function l(h,c){let u=0,p=0,d=0,g=0,y=0,v=0,m=c.matrixWorldInverse;for(let f=0,S=h.length;f<S;f++){let x=h[f];if(x.isSunLight){let A=r.sun[u];A.direction.setFromMatrixPosition(x.matrixWorld),A.direction.transformDirection(m),u++}else if(x.isDirectionalLight){let A=r.directional[p];A.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(m),p++}else if(x.isSpotLight){let A=r.spot[g];A.position.setFromMatrixPosition(x.matrixWorld),A.position.applyMatrix4(m),A.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(m),g++}else if(x.isRectAreaLight){let A=r.rectArea[y];A.position.setFromMatrixPosition(x.matrixWorld),A.position.applyMatrix4(m),s.identity(),n.copy(x.matrixWorld),n.premultiply(m),s.extractRotation(n),A.halfWidth.set(x.width*.5,0,0),A.halfHeight.set(0,x.height*.5,0),A.halfWidth.applyMatrix4(s),A.halfHeight.applyMatrix4(s),y++}else if(x.isPointLight){let A=r.point[d];A.position.setFromMatrixPosition(x.matrixWorld),A.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let A=r.hemi[v];A.direction.setFromMatrixPosition(x.matrixWorld),A.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:r}}function hd(e){let t=new tM(e),i=[],r=[],a=[];function n(u){c.camera=u,i.length=0,r.length=0,a.length=0}function s(u){u.isLightProbeGrid?a.push(u):i.push(u)}function o(u){r.push(u)}function l(){t.setup(i),a.sort((u,p)=>u.priority-p.priority||u.id-p.id)}function h(u){t.setupView(i,u)}let c={lightsArray:i,shadowsArray:r,lightProbeGridArray:a,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:n,state:c,setupLights:l,setupLightsView:h,pushLight:s,pushShadow:o}}function iM(e){let t=new WeakMap;function i(a,n=0){let s=t.get(a),o;return s===void 0?(o=new hd(e),t.set(a,[o])):n>=s.length?(o=new hd(e),s.push(o)):o=s[n],o}function r(){t=new WeakMap}return{get:i,dispose:r}}var rM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,aM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,nM=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],sM=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],cd=new lt,xn=new R,fh=new R;function oM(e,t,i){let r=new ca,a=new se,n=new se,s=new Ct,o=new fc,l=new mc,h={},c=i.maxTextureSize,u={[Ir]:gi,[gi]:Ir,[Di]:Di},p=new Sr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:rM,fragmentShader:aM}),d=p.clone();d.defines.HORIZONTAL_PASS=1;let g=new dt;g.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new it(g,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=En;let m=this.type;this.render=function(b,_,M){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||b.length===0)return;this.type===pd&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=En);let E=e.getRenderTarget(),P=e.getActiveCubeFace(),I=e.getActiveMipmapLevel(),L=e.state;L.setBlending(na),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let Y=m!==this.type;Y&&_.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(B=>B.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,B=b.length;D<B;D++){let Z=b[D],V=Z.shadow;if(V===void 0){Le("WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;a.copy(V.mapSize);let pe=V.getFrameExtents();a.multiply(pe),n.copy(V.mapSize),(a.x>c||a.y>c)&&(a.x>c&&(n.x=Math.floor(c/pe.x),a.x=n.x*pe.x,V.mapSize.x=n.x),a.y>c&&(n.y=Math.floor(c/pe.y),a.y=n.y*pe.y,V.mapSize.y=n.y));let z=e.state.buffers.depth.getReversed();if(V.camera._reversedDepth=z,V.map===null||Y===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===ka){if(Z.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Pi(a.x,a.y,{format:Dr,type:qi,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),V.map.texture.name=Z.name+".shadowMap",V.map.depthTexture=new ua(a.x,a.y,mi),V.map.depthTexture.name=Z.name+".shadowMapDepth",V.map.depthTexture.format=yr,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht}else Z.isPointLight?(V.map=new bl(a.x),V.map.depthTexture=new ac(a.x,Ni)):(V.map=new Pi(a.x,a.y),V.map.depthTexture=new ua(a.x,a.y,Ni)),V.map.depthTexture.name=Z.name+".shadowMap",V.map.depthTexture.format=yr,this.type===En?(V.map.depthTexture.compareFunction=z?qh:jh,V.map.depthTexture.minFilter=Nt,V.map.depthTexture.magFilter=Nt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==a.x||V.map.height!==a.y)&&V.map.setSize(a.x,a.y);let W=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();Z.isPointLight!==!0&&V.updateMatrices(Z,M);let Q=(V.camera.layers.mask&4294967294)!==0?V.camera.layers:M.layers;for(let ve=0;ve<W;ve++){let $=V.getCamera(ve);if(Z.isPointLight){let he=V.camera,Pe=V.matrix,Ye=Z.distance||he.far;Ye!==he.far&&(he.far=Ye,he.updateProjectionMatrix()),xn.setFromMatrixPosition(Z.matrixWorld),he.position.copy(xn),fh.copy(he.position),fh.add(nM[ve]),he.up.copy(sM[ve]),he.lookAt(fh),he.updateMatrixWorld(),Pe.makeTranslation(-xn.x,-xn.y,-xn.z),cd.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),V._frustum.setFromProjectionMatrix(cd,he.coordinateSystem,he.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)e.setRenderTarget(V.map,ve),e.clear();else{ve===0&&(e.setRenderTarget(V.map),e.clear());let he=V.getViewport(ve);s.set(n.x*he.x,n.y*he.y,n.x*he.z,n.y*he.w),L.viewport(s)}r=V.getFrustum(ve),x(_,M,$,Z,Q,this.type)}V.isPointLightShadow!==!0&&this.type===ka&&f(V,M),V.needsUpdate=!1}m=this.type,v.needsUpdate=!1,e.setRenderTarget(E,P,I)};function f(b,_){let M=t.update(y);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null?b.mapPass=new Pi(a.x,a.y,{format:Dr,type:qi}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),p.uniforms.shadow_pass.value=b.map.depthTexture,p.uniforms.resolution.value.set(b.map.width,b.map.height),p.uniforms.radius.value=b.radius,e.setRenderTarget(b.mapPass),e.clear(),e.renderBufferDirect(_,null,M,p,y,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,e.setRenderTarget(b.map),e.clear(),e.renderBufferDirect(_,null,M,d,y,null)}function S(b,_,M,E){let P=null,I=M.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(I!==void 0)P=I;else if(P=M.isPointLight===!0?l:o,e.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let L=P.uuid,Y=_.uuid,D=h[L];D===void 0&&(D={},h[L]=D);let B=D[Y];B===void 0&&(B=P.clone(),D[Y]=B,_.addEventListener("dispose",A)),P=B}if(P.visible=_.visible,P.wireframe=_.wireframe,E===ka?P.side=_.shadowSide!==null?_.shadowSide:_.side:P.side=_.shadowSide!==null?_.shadowSide:u[_.side],P.alphaMap=_.alphaMap,P.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,P.map=_.map,P.clipShadows=_.clipShadows,P.clippingPlanes=_.clippingPlanes,P.clipIntersection=_.clipIntersection,P.displacementMap=_.displacementMap,P.displacementScale=_.displacementScale,P.displacementBias=_.displacementBias,P.wireframeLinewidth=_.wireframeLinewidth,P.linewidth=_.linewidth,M.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let L=e.properties.get(P);L.light=M}return P}function x(b,_,M,E,P,I){if(b.visible===!1)return;if(b.layers.test(P)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===ka)&&(!b.frustumCulled||b.intersectsFrustum(r))){b.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,b.matrixWorld);let Y=t.update(b),D=b.material;if(Array.isArray(D)){let B=Y.groups;for(let Z=0,V=B.length;Z<V;Z++){let pe=B[Z],z=D[pe.materialIndex];if(z&&z.visible){let W=S(b,z,E,I);b.onBeforeShadow(e,b,_,M,Y,W,pe),e.renderBufferDirect(M,null,Y,W,b,pe),b.onAfterShadow(e,b,_,M,Y,W,pe)}}}else if(D.visible){let B=S(b,D,E,I);b.onBeforeShadow(e,b,_,M,Y,B,null),e.renderBufferDirect(M,null,Y,B,b,null),b.onAfterShadow(e,b,_,M,Y,B,null)}}let L=b.children;for(let Y=0,D=L.length;Y<D;Y++)x(L[Y],_,M,E,P,I)}function A(b){b.target.removeEventListener("dispose",A);for(let _ in h){let M=h[_],E=b.target.uuid;E in M&&(M[E].dispose(),delete M[E])}}}function lM(e,t){function i(){let O=!1,K=new Ct,de=null,Se=new Ct(0,0,0,0);return{setMask:function(Te){de!==Te&&!O&&(e.colorMask(Te,Te,Te,Te),de=Te)},setLocked:function(Te){O=Te},setClear:function(Te,Ce,$e,ge,ct){ct===!0&&(Te*=ge,Ce*=ge,$e*=ge),K.set(Te,Ce,$e,ge),Se.equals(K)===!1&&(e.clearColor(Te,Ce,$e,ge),Se.copy(K))},reset:function(){O=!1,de=null,Se.set(-1,0,0,0)}}}function r(){let O=!1,K=!1,de=null,Se=null,Te=null;return{setReversed:function(Ce){if(K!==Ce){let $e=t.get("EXT_clip_control");Ce?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT),K=Ce;let ge=Te;Te=null,this.setClear(ge)}},getReversed:function(){return K},setTest:function(Ce){Ce?fe(e.DEPTH_TEST):rt(e.DEPTH_TEST)},setMask:function(Ce){de!==Ce&&!O&&(e.depthMask(Ce),de=Ce)},setFunc:function(Ce){if(K&&(Ce=wg[Ce]),Se!==Ce){switch(Ce){case ho:e.depthFunc(e.NEVER);break;case co:e.depthFunc(e.ALWAYS);break;case uo:e.depthFunc(e.LESS);break;case qa:e.depthFunc(e.LEQUAL);break;case po:e.depthFunc(e.EQUAL);break;case fo:e.depthFunc(e.GEQUAL);break;case mo:e.depthFunc(e.GREATER);break;case go:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}Se=Ce}},setLocked:function(Ce){O=Ce},setClear:function(Ce){Te!==Ce&&(Te=Ce,K&&(Ce=1-Ce),e.clearDepth(Ce))},reset:function(){O=!1,de=null,Se=null,Te=null,K=!1}}}function a(){let O=!1,K=null,de=null,Se=null,Te=null,Ce=null,$e=null,ge=null,ct=null;return{setTest:function(st){O||(st?fe(e.STENCIL_TEST):rt(e.STENCIL_TEST))},setMask:function(st){K!==st&&!O&&(e.stencilMask(st),K=st)},setFunc:function(st,_t,Oe){(de!==st||Se!==_t||Te!==Oe)&&(e.stencilFunc(st,_t,Oe),de=st,Se=_t,Te=Oe)},setOp:function(st,_t,Oe){(Ce!==st||$e!==_t||ge!==Oe)&&(e.stencilOp(st,_t,Oe),Ce=st,$e=_t,ge=Oe)},setLocked:function(st){O=st},setClear:function(st){ct!==st&&(e.clearStencil(st),ct=st)},reset:function(){O=!1,K=null,de=null,Se=null,Te=null,Ce=null,$e=null,ge=null,ct=null}}}let n=new i,s=new r,o=new a,l={},h=new WeakMap,c={},u={},p={},d=new WeakMap,g=[],y=null,v=!1,m=null,f=null,S=null,x=null,A=null,b=null,_=null,M=new ke(0,0,0),E=0,P=!1,I=null,L=null,Y=null,D=null,B=null,Z=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,pe=0,z=e.getParameter(e.VERSION);z.indexOf("WebGL")!==-1?(pe=parseFloat(/^WebGL (\d)/.exec(z)[1]),V=pe>=1):z.indexOf("OpenGL ES")!==-1&&(pe=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),V=pe>=2);let W=null,Q={},ve=e.getParameter(e.SCISSOR_BOX),$=e.getParameter(e.VIEWPORT),he=new Ct().fromArray(ve),Pe=new Ct().fromArray($);function Ye(O,K,de,Se){let Te=new Uint8Array(4),Ce=e.createTexture();e.bindTexture(O,Ce),e.texParameteri(O,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(O,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let $e=0;$e<de;$e++)O===e.TEXTURE_3D||O===e.TEXTURE_2D_ARRAY?e.texImage3D(K,0,e.RGBA,1,1,Se,0,e.RGBA,e.UNSIGNED_BYTE,Te):e.texImage2D(K+$e,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,Te);return Ce}let Ve={};Ve[e.TEXTURE_2D]=Ye(e.TEXTURE_2D,e.TEXTURE_2D,1),Ve[e.TEXTURE_CUBE_MAP]=Ye(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ve[e.TEXTURE_2D_ARRAY]=Ye(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Ve[e.TEXTURE_3D]=Ye(e.TEXTURE_3D,e.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),fe(e.DEPTH_TEST),s.setFunc(qa),ae(!1),te(mh),fe(e.CULL_FACE),me(na);function fe(O){c[O]!==!0&&(e.enable(O),c[O]=!0)}function rt(O){c[O]!==!1&&(e.disable(O),c[O]=!1)}function pt(O,K){return p[O]!==K?(e.bindFramebuffer(O,K),p[O]=K,O===e.DRAW_FRAMEBUFFER&&(p[e.FRAMEBUFFER]=K),O===e.FRAMEBUFFER&&(p[e.DRAW_FRAMEBUFFER]=K),!0):!1}function Ue(O,K){let de=g,Se=!1;if(O){de=d.get(K),de===void 0&&(de=[],d.set(K,de));let Te=O.textures;if(de.length!==Te.length||de[0]!==e.COLOR_ATTACHMENT0){for(let Ce=0,$e=Te.length;Ce<$e;Ce++)de[Ce]=e.COLOR_ATTACHMENT0+Ce;de.length=Te.length,Se=!0}}else de[0]!==e.BACK&&(de[0]=e.BACK,Se=!0);Se&&e.drawBuffers(de)}function vt(O){return y!==O?(e.useProgram(O),y=O,!0):!1}let ue={[ta]:e.FUNC_ADD,[md]:e.FUNC_SUBTRACT,[gd]:e.FUNC_REVERSE_SUBTRACT};ue[vd]=e.MIN,ue[_d]=e.MAX;let xe={[yd]:e.ZERO,[xd]:e.ONE,[Sd]:e.SRC_COLOR,[Ph]:e.SRC_ALPHA,[Ad]:e.SRC_ALPHA_SATURATE,[wd]:e.DST_COLOR,[bd]:e.DST_ALPHA,[Md]:e.ONE_MINUS_SRC_COLOR,[Ih]:e.ONE_MINUS_SRC_ALPHA,[Td]:e.ONE_MINUS_DST_COLOR,[Ed]:e.ONE_MINUS_DST_ALPHA,[Rd]:e.CONSTANT_COLOR,[Cd]:e.ONE_MINUS_CONSTANT_COLOR,[Pd]:e.CONSTANT_ALPHA,[Id]:e.ONE_MINUS_CONSTANT_ALPHA};function me(O,K,de,Se,Te,Ce,$e,ge,ct,st){if(O===na){v===!0&&(rt(e.BLEND),v=!1);return}if(v===!1&&(fe(e.BLEND),v=!0),O!==fd){if(O!==m||st!==P){if((f!==ta||A!==ta)&&(e.blendEquation(e.FUNC_ADD),f=ta,A=ta),st)switch(O){case Xa:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Nn:e.blendFunc(e.ONE,e.ONE);break;case gh:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case vh:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Qe("WebGLState: Invalid blending: ",O);break}else switch(O){case Xa:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Nn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case gh:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vh:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",O);break}S=null,x=null,b=null,_=null,M.set(0,0,0),E=0,m=O,P=st}return}Te=Te||K,Ce=Ce||de,$e=$e||Se,(K!==f||Te!==A)&&(e.blendEquationSeparate(ue[K],ue[Te]),f=K,A=Te),(de!==S||Se!==x||Ce!==b||$e!==_)&&(e.blendFuncSeparate(xe[de],xe[Se],xe[Ce],xe[$e]),S=de,x=Se,b=Ce,_=$e),(ge.equals(M)===!1||ct!==E)&&(e.blendColor(ge.r,ge.g,ge.b,ct),M.copy(ge),E=ct),m=O,P=!1}function ze(O,K){O.side===Di?rt(e.CULL_FACE):fe(e.CULL_FACE);let de=O.side===gi;K&&(de=!de),ae(de),O.blending===Xa&&O.transparent===!1?me(na):me(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),s.setFunc(O.depthFunc),s.setTest(O.depthTest),s.setMask(O.depthWrite),n.setMask(O.colorWrite);let Se=O.stencilWrite;o.setTest(Se),Se&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ie(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?fe(e.SAMPLE_ALPHA_TO_COVERAGE):rt(e.SAMPLE_ALPHA_TO_COVERAGE)}function ae(O){I!==O&&(O?e.frontFace(e.CW):e.frontFace(e.CCW),I=O)}function te(O){O!==ud?(fe(e.CULL_FACE),O!==L&&(O===mh?e.cullFace(e.BACK):O===dd?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):rt(e.CULL_FACE),L=O}function oe(O){O!==Y&&(V&&e.lineWidth(O),Y=O)}function ie(O,K,de){O?(fe(e.POLYGON_OFFSET_FILL),(D!==K||B!==de)&&(D=K,B=de,s.getReversed()&&(K=-K,de=-de),e.polygonOffset(K,de))):rt(e.POLYGON_OFFSET_FILL)}function be(O){O?fe(e.SCISSOR_TEST):rt(e.SCISSOR_TEST)}function We(O){O===void 0&&(O=e.TEXTURE0+Z-1),W!==O&&(e.activeTexture(O),W=O)}function U(O,K,de){de===void 0&&(W===null?de=e.TEXTURE0+Z-1:de=W);let Se=Q[de];Se===void 0&&(Se={type:void 0,texture:void 0},Q[de]=Se),(Se.type!==O||Se.texture!==K)&&(W!==de&&(e.activeTexture(de),W=de),e.bindTexture(O,K||Ve[O]),Se.type=O,Se.texture=K)}function Ie(){let O=Q[W];O!==void 0&&O.type!==void 0&&(e.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function _e(){try{e.compressedTexImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function Xe(){try{e.compressedTexImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function re(){try{e.texSubImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function et(){try{e.texSubImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function we(){try{e.compressedTexSubImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function He(){try{e.texStorage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function C(){try{e.texStorage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function w(){try{e.texImage2D(...arguments)}catch(O){Qe("WebGLState:",O)}}function X(){try{e.texImage3D(...arguments)}catch(O){Qe("WebGLState:",O)}}function ce(O){return u[O]!==void 0?u[O]:e.getParameter(O)}function ee(O,K){u[O]!==K&&(e.pixelStorei(O,K),u[O]=K)}function Re(O){he.equals(O)===!1&&(e.scissor(O.x,O.y,O.z,O.w),he.copy(O))}function Ae(O){Pe.equals(O)===!1&&(e.viewport(O.x,O.y,O.z,O.w),Pe.copy(O))}function H(O,K){let de=h.get(K);de===void 0&&(de=new WeakMap,h.set(K,de));let Se=de.get(O);Se===void 0&&(Se=e.getUniformBlockIndex(K,O.name),e.uniformBlockBinding(K,Se,Se),de.set(O,Se))}function ne(O,K,de){let Se=h.get(K).get(O);l[Se]!==de&&(e.bindBufferBase(e.UNIFORM_BUFFER,Se,de),l[Se]=de)}function Ne(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),c={},u={},W=null,Q={},p={},l={},d=new WeakMap,g=[],y=null,v=!1,m=null,f=null,S=null,x=null,A=null,b=null,_=null,M=new ke(0,0,0),E=0,P=!1,I=null,L=null,Y=null,D=null,B=null,he.set(0,0,e.canvas.width,e.canvas.height),Pe.set(0,0,e.canvas.width,e.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:fe,disable:rt,bindFramebuffer:pt,drawBuffers:Ue,useProgram:vt,setBlending:me,setMaterial:ze,setFlipSided:ae,setCullFace:te,setLineWidth:oe,setPolygonOffset:ie,setScissorTest:be,activeTexture:We,bindTexture:U,unbindTexture:Ie,compressedTexImage2D:_e,compressedTexImage3D:Xe,texImage2D:w,texImage3D:X,pixelStorei:ee,getParameter:ce,updateUBOMapping:H,uniformBlockBinding:ne,texStorage2D:He,texStorage3D:C,texSubImage2D:re,texSubImage3D:et,compressedTexSubImage2D:we,compressedTexSubImage3D:je,scissor:Re,viewport:Ae,reset:Ne}}function hM(e,t,i,r,a,n,s){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new se,c=new WeakMap,u=new Set,p,d=new WeakMap,g=new Set,y=new FinalizationRegistry(C=>g.delete(C)),v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,w){return v?new OffscreenCanvas(C,w):Vn("canvas")}function f(C,w,X){let ce=1,ee=He(C);if((ee.width>X||ee.height>X)&&(ce=X/Math.max(ee.width,ee.height)),ce<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let Re=Math.floor(ce*ee.width),Ae=Math.floor(ce*ee.height);p===void 0&&(p=m(Re,Ae));let H=w?m(Re,Ae):p;return H.width=Re,H.height=Ae,H.getContext("2d").drawImage(C,0,0,Re,Ae),Le("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+Re+"x"+Ae+")."),H}else return"data"in C&&Le("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),C;return C}function S(C){return C.generateMipmaps}function x(C){e.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?e.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(C,w,X,ce,ee,Re=!1){if(C!==null){if(e[C]!==void 0)return e[C];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Ae;ce&&(Ae=t.get("EXT_texture_norm16"),Ae||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let H=w;if(w===e.RED&&(X===e.FLOAT&&(H=e.R32F),X===e.HALF_FLOAT&&(H=e.R16F),X===e.UNSIGNED_BYTE&&(H=e.R8),X===e.UNSIGNED_SHORT&&Ae&&(H=Ae.R16_EXT),X===e.SHORT&&Ae&&(H=Ae.R16_SNORM_EXT)),w===e.RED_INTEGER&&(X===e.UNSIGNED_BYTE&&(H=e.R8UI),X===e.UNSIGNED_SHORT&&(H=e.R16UI),X===e.UNSIGNED_INT&&(H=e.R32UI),X===e.BYTE&&(H=e.R8I),X===e.SHORT&&(H=e.R16I),X===e.INT&&(H=e.R32I)),w===e.RG&&(X===e.FLOAT&&(H=e.RG32F),X===e.HALF_FLOAT&&(H=e.RG16F),X===e.UNSIGNED_BYTE&&(H=e.RG8),X===e.UNSIGNED_SHORT&&Ae&&(H=Ae.RG16_EXT),X===e.SHORT&&Ae&&(H=Ae.RG16_SNORM_EXT)),w===e.RG_INTEGER&&(X===e.UNSIGNED_BYTE&&(H=e.RG8UI),X===e.UNSIGNED_SHORT&&(H=e.RG16UI),X===e.UNSIGNED_INT&&(H=e.RG32UI),X===e.BYTE&&(H=e.RG8I),X===e.SHORT&&(H=e.RG16I),X===e.INT&&(H=e.RG32I)),w===e.RGB_INTEGER&&(X===e.UNSIGNED_BYTE&&(H=e.RGB8UI),X===e.UNSIGNED_SHORT&&(H=e.RGB16UI),X===e.UNSIGNED_INT&&(H=e.RGB32UI),X===e.BYTE&&(H=e.RGB8I),X===e.SHORT&&(H=e.RGB16I),X===e.INT&&(H=e.RGB32I)),w===e.RGBA_INTEGER&&(X===e.UNSIGNED_BYTE&&(H=e.RGBA8UI),X===e.UNSIGNED_SHORT&&(H=e.RGBA16UI),X===e.UNSIGNED_INT&&(H=e.RGBA32UI),X===e.BYTE&&(H=e.RGBA8I),X===e.SHORT&&(H=e.RGBA16I),X===e.INT&&(H=e.RGBA32I)),w===e.RGB&&(X===e.UNSIGNED_SHORT&&Ae&&(H=Ae.RGB16_EXT),X===e.SHORT&&Ae&&(H=Ae.RGB16_SNORM_EXT),X===e.UNSIGNED_INT_5_9_9_9_REV&&(H=e.RGB9_E5),X===e.UNSIGNED_INT_10F_11F_11F_REV&&(H=e.R11F_G11F_B10F)),w===e.RGBA){let ne=Re?Gn:yt.getTransfer(ee);X===e.FLOAT&&(H=e.RGBA32F),X===e.HALF_FLOAT&&(H=e.RGBA16F),X===e.UNSIGNED_BYTE&&(H=ne===bt?e.SRGB8_ALPHA8:e.RGBA8),X===e.UNSIGNED_SHORT&&Ae&&(H=Ae.RGBA16_EXT),X===e.SHORT&&Ae&&(H=Ae.RGBA16_SNORM_EXT),X===e.UNSIGNED_SHORT_4_4_4_4&&(H=e.RGBA4),X===e.UNSIGNED_SHORT_5_5_5_1&&(H=e.RGB5_A1)}return(H===e.R16F||H===e.R32F||H===e.RG16F||H===e.RG32F||H===e.RGBA16F||H===e.RGBA32F)&&t.get("EXT_color_buffer_float"),H}function _(C,w){let X;return C?w===null||w===Ni||w===la?X=e.DEPTH24_STENCIL8:w===mi?X=e.DEPTH32F_STENCIL8:w===Ya&&(X=e.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ni||w===la?X=e.DEPTH_COMPONENT24:w===mi?X=e.DEPTH_COMPONENT32F:w===Ya&&(X=e.DEPTH_COMPONENT16),X}function M(C,w){return S(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ht&&C.minFilter!==Nt?Math.log2(Math.max(w.width,w.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?w.mipmaps.length:1}function E(C){let w=new WeakRef(C);r.get(C).__ref=w,g.add(w),y.register(C,w,w)}function P(C){let w=r.get(C).__ref;w!==void 0&&(g.delete(w),y.unregister(w))}function I(C){Y(C.target)}function L(C){D(C.target)}function Y(C){C.removeEventListener("dispose",I),P(C),Z(C),C.isVideoTexture&&c.delete(C),C.isHTMLTexture&&u.delete(C)}function D(C){C.removeEventListener("dispose",L),P(C),pe(C)}function B(){for(let C of g){let w=C.deref();w!==void 0&&(w.isRenderTarget===!0?D(w):Y(w))}g.clear(),u.clear()}function Z(C){let w=r.get(C);if(w.__webglInit===void 0)return;let X=C.source,ce=d.get(X);if(ce){let ee=ce[w.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&V(C),Object.keys(ce).length===0&&d.delete(X)}r.remove(C)}function V(C){let w=r.get(C);e.deleteTexture(w.__webglTexture);let X=C.source,ce=d.get(X);delete ce[w.__cacheKey],s.memory.textures--}function pe(C){let w=r.get(C);w.__depthDisposeCallback&&w.__depthDisposeCallback();let X=C.depthTexture;if(X&&X.renderTarget===C&&Y(X),C.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(w.__webglFramebuffer[ee]))for(let Re=0;Re<w.__webglFramebuffer[ee].length;Re++)e.deleteFramebuffer(w.__webglFramebuffer[ee][Re]);else e.deleteFramebuffer(w.__webglFramebuffer[ee]);w.__webglDepthbuffer&&e.deleteRenderbuffer(w.__webglDepthbuffer[ee])}else{if(Array.isArray(w.__webglFramebuffer))for(let ee=0;ee<w.__webglFramebuffer.length;ee++)e.deleteFramebuffer(w.__webglFramebuffer[ee]);else e.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&e.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&e.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ee=0;ee<w.__webglColorRenderbuffer.length;ee++)w.__webglColorRenderbuffer[ee]&&e.deleteRenderbuffer(w.__webglColorRenderbuffer[ee]);w.__webglDepthRenderbuffer&&e.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let ce=C.textures;for(let ee=0,Re=ce.length;ee<Re;ee++){let Ae=r.get(ce[ee]);Ae.__webglTexture&&(e.deleteTexture(Ae.__webglTexture),s.memory.textures--),r.remove(ce[ee])}r.remove(C)}let z=0;function W(){z=0}function Q(){return z}function ve(C){z=C}function $(){let C=z;return C>=a.maxTextures&&Le("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+a.maxTextures),z+=1,C}function he(C){let w=[];return w.push(C.wrapS),w.push(C.wrapT),w.push(C.wrapR||0),w.push(C.magFilter),w.push(C.minFilter),w.push(C.anisotropy),w.push(C.internalFormat),w.push(C.format),w.push(C.type),w.push(C.generateMipmaps),w.push(C.mipmapsAutoUpdate),w.push(C.premultiplyAlpha),w.push(C.flipY),w.push(C.unpackAlignment),w.push(C.colorSpace),w.join()}function Pe(C,w){let X=r.get(C);if(C.isVideoTexture&&we(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&X.__version!==C.version){let ce=C.image;if(ce===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{ze(X,C,w);return}}else C.isExternalTexture&&(X.__webglTexture=C.sourceTexture?C.sourceTexture:null);i.bindTexture(e.TEXTURE_2D,X.__webglTexture,e.TEXTURE0+w)}function Ye(C,w){let X=r.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){ze(X,C,w);return}else C.isExternalTexture&&(X.__webglTexture=C.sourceTexture?C.sourceTexture:null);i.bindTexture(e.TEXTURE_2D_ARRAY,X.__webglTexture,e.TEXTURE0+w)}function Ve(C,w){let X=r.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){ze(X,C,w);return}i.bindTexture(e.TEXTURE_3D,X.__webglTexture,e.TEXTURE0+w)}function fe(C,w){let X=r.get(C);if(C.version>0&&X.__version!==C.version){ae(X,C,w);return}i.bindTexture(e.TEXTURE_CUBE_MAP,X.__webglTexture,e.TEXTURE0+w)}let rt={[Lr]:e.REPEAT,[Kt]:e.CLAMP_TO_EDGE,[On]:e.MIRRORED_REPEAT},pt={[Ht]:e.NEAREST,[Bh]:e.NEAREST_MIPMAP_NEAREST,[Ga]:e.NEAREST_MIPMAP_LINEAR,[Nt]:e.LINEAR,[An]:e.LINEAR_MIPMAP_NEAREST,[ji]:e.LINEAR_MIPMAP_LINEAR},Ue={[kd]:e.NEVER,[Yh]:e.ALWAYS,[Gd]:e.LESS,[jh]:e.LEQUAL,[Vd]:e.EQUAL,[qh]:e.GEQUAL,[Wd]:e.GREATER,[Xd]:e.NOTEQUAL};function vt(C,w){if(w.type===mi&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Nt||w.magFilter===An||w.magFilter===Ga||w.magFilter===ji||w.minFilter===Nt||w.minFilter===An||w.minFilter===Ga||w.minFilter===ji)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(C,e.TEXTURE_WRAP_S,rt[w.wrapS]),e.texParameteri(C,e.TEXTURE_WRAP_T,rt[w.wrapT]),(C===e.TEXTURE_3D||C===e.TEXTURE_2D_ARRAY)&&e.texParameteri(C,e.TEXTURE_WRAP_R,rt[w.wrapR]),e.texParameteri(C,e.TEXTURE_MAG_FILTER,pt[w.magFilter]),e.texParameteri(C,e.TEXTURE_MIN_FILTER,pt[w.minFilter]),w.compareFunction&&(e.texParameteri(C,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(C,e.TEXTURE_COMPARE_FUNC,Ue[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Ht||w.minFilter!==Ga&&w.minFilter!==ji||w.type===mi&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||r.get(w).__currentAnisotropy){let X=t.get("EXT_texture_filter_anisotropic");e.texParameterf(C,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,a.getMaxAnisotropy())),r.get(w).__currentAnisotropy=w.anisotropy}}}function ue(C,w){let X=!1;C.__webglInit===void 0&&(C.__webglInit=!0,w.addEventListener("dispose",I),E(w));let ce=w.source,ee=d.get(ce);ee===void 0&&(ee={},d.set(ce,ee));let Re=he(w);if(Re!==C.__cacheKey){ee[Re]===void 0&&(ee[Re]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,X=!0),ee[Re].usedTimes++;let Ae=ee[C.__cacheKey];Ae!==void 0&&(ee[C.__cacheKey].usedTimes--,Ae.usedTimes===0&&V(w)),C.__cacheKey=Re,C.__webglTexture=ee[Re].texture}return X}function xe(C,w,X){return Math.floor(Math.floor(C/X)/w)}function me(C,w,X,ce){let ee=C.updateRanges;if(ee.length===0)i.texSubImage2D(e.TEXTURE_2D,0,0,0,w.width,w.height,X,ce,w.data);else{ee.sort((Ne,O)=>Ne.start-O.start);let Re=0;for(let Ne=1;Ne<ee.length;Ne++){let O=ee[Re],K=ee[Ne],de=O.start+O.count,Se=xe(K.start,w.width,4),Te=xe(O.start,w.width,4);K.start<=de+1&&Se===Te&&xe(K.start+K.count-1,w.width,4)===Se?O.count=Math.max(O.count,K.start+K.count-O.start):(++Re,ee[Re]=K)}ee.length=Re+1;let Ae=i.getParameter(e.UNPACK_ROW_LENGTH),H=i.getParameter(e.UNPACK_SKIP_PIXELS),ne=i.getParameter(e.UNPACK_SKIP_ROWS);i.pixelStorei(e.UNPACK_ROW_LENGTH,w.width);for(let Ne=0,O=ee.length;Ne<O;Ne++){let K=ee[Ne],de=Math.floor(K.start/4),Se=Math.ceil(K.count/4),Te=de%w.width,Ce=Math.floor(de/w.width),$e=Se;i.pixelStorei(e.UNPACK_SKIP_PIXELS,Te),i.pixelStorei(e.UNPACK_SKIP_ROWS,Ce),i.texSubImage2D(e.TEXTURE_2D,0,Te,Ce,$e,1,X,ce,w.data)}C.clearUpdateRanges(),i.pixelStorei(e.UNPACK_ROW_LENGTH,Ae),i.pixelStorei(e.UNPACK_SKIP_PIXELS,H),i.pixelStorei(e.UNPACK_SKIP_ROWS,ne)}}function ze(C,w,X){let ce=e.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ce=e.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ce=e.TEXTURE_3D);let ee=ue(C,w),Re=w.source;i.bindTexture(ce,C.__webglTexture,e.TEXTURE0+X);let Ae=r.get(Re);if(Re.version!==Ae.__version||ee===!0){if(i.activeTexture(e.TEXTURE0+X),!(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)){let ge=yt.getPrimaries(yt.workingColorSpace),ct=w.colorSpace===dr?null:yt.getPrimaries(w.colorSpace),st=w.colorSpace===dr||ge===ct?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,st)}i.pixelStorei(e.UNPACK_ALIGNMENT,w.unpackAlignment);let H=f(w.image,!1,a.maxTextureSize);H=je(w,H);let ne=n.convert(w.format,w.colorSpace),Ne=n.convert(w.type),O=b(w.internalFormat,ne,Ne,w.normalized,w.colorSpace,w.isVideoTexture);vt(ce,w);let K,de=w.mipmaps,Se=w.isVideoTexture!==!0,Te=Ae.__version===void 0||ee===!0,Ce=Re.dataReady,$e=M(w,H);if(w.isDepthTexture)O=_(w.format===fr,w.type),Te&&(Se?i.texStorage2D(e.TEXTURE_2D,1,O,H.width,H.height):i.texImage2D(e.TEXTURE_2D,0,O,H.width,H.height,0,ne,Ne,null));else if(w.isDataTexture)if(de.length>0){Se&&Te&&i.texStorage2D(e.TEXTURE_2D,$e,O,de[0].width,de[0].height);for(let ge=0,ct=de.length;ge<ct;ge++)K=de[ge],Se?Ce&&i.texSubImage2D(e.TEXTURE_2D,ge,0,0,K.width,K.height,ne,Ne,K.data):i.texImage2D(e.TEXTURE_2D,ge,O,K.width,K.height,0,ne,Ne,K.data);w.generateMipmaps=!1}else Se?(Te&&i.texStorage2D(e.TEXTURE_2D,$e,O,H.width,H.height),Ce&&me(w,H,ne,Ne)):i.texImage2D(e.TEXTURE_2D,0,O,H.width,H.height,0,ne,Ne,H.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Se&&Te&&i.texStorage3D(e.TEXTURE_2D_ARRAY,$e,O,de[0].width,de[0].height,H.depth);for(let ge=0,ct=de.length;ge<ct;ge++)if(K=de[ge],w.format!==bi)if(ne!==null)if(Se){if(Ce)if(w.layerUpdates.size>0){let st=Ah(K.width,K.height,w.format,w.type);for(let _t of w.layerUpdates){let Oe=K.data.subarray(_t*st/K.data.BYTES_PER_ELEMENT,(_t+1)*st/K.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ge,0,0,_t,K.width,K.height,1,ne,Oe)}}else i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ge,0,0,0,K.width,K.height,H.depth,ne,K.data)}else i.compressedTexImage3D(e.TEXTURE_2D_ARRAY,ge,O,K.width,K.height,H.depth,0,K.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Se?Ce&&i.texSubImage3D(e.TEXTURE_2D_ARRAY,ge,0,0,0,K.width,K.height,H.depth,ne,Ne,K.data):i.texImage3D(e.TEXTURE_2D_ARRAY,ge,O,K.width,K.height,H.depth,0,ne,Ne,K.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{Se&&Te&&i.texStorage2D(e.TEXTURE_2D,$e,O,de[0].width,de[0].height);for(let ge=0,ct=de.length;ge<ct;ge++)K=de[ge],w.format!==bi?ne!==null?Se?Ce&&i.compressedTexSubImage2D(e.TEXTURE_2D,ge,0,0,K.width,K.height,ne,K.data):i.compressedTexImage2D(e.TEXTURE_2D,ge,O,K.width,K.height,0,K.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Se?Ce&&i.texSubImage2D(e.TEXTURE_2D,ge,0,0,K.width,K.height,ne,Ne,K.data):i.texImage2D(e.TEXTURE_2D,ge,O,K.width,K.height,0,ne,Ne,K.data)}else if(w.isDataArrayTexture)if(Se){if(Te&&i.texStorage3D(e.TEXTURE_2D_ARRAY,$e,O,H.width,H.height,H.depth),Ce)if(w.layerUpdates.size>0){let ge=Ah(H.width,H.height,w.format,w.type);for(let ct of w.layerUpdates){let st=H.data.subarray(ct*ge/H.data.BYTES_PER_ELEMENT,(ct+1)*ge/H.data.BYTES_PER_ELEMENT);i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ct,H.width,H.height,1,ne,Ne,st)}w.clearLayerUpdates()}else i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,H.width,H.height,H.depth,ne,Ne,H.data)}else i.texImage3D(e.TEXTURE_2D_ARRAY,0,O,H.width,H.height,H.depth,0,ne,Ne,H.data);else if(w.isData3DTexture)Se?(Te&&i.texStorage3D(e.TEXTURE_3D,$e,O,H.width,H.height,H.depth),Ce&&i.texSubImage3D(e.TEXTURE_3D,0,0,0,0,H.width,H.height,H.depth,ne,Ne,H.data)):i.texImage3D(e.TEXTURE_3D,0,O,H.width,H.height,H.depth,0,ne,Ne,H.data);else if(w.isFramebufferTexture){if(Te)if(Se)i.texStorage2D(e.TEXTURE_2D,$e,O,H.width,H.height);else{let ge=H.width,ct=H.height;for(let st=0;st<$e;st++)i.texImage2D(e.TEXTURE_2D,st,O,ge,ct,0,ne,Ne,null),ge>>=1,ct>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in e){let ge=e.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),H.parentNode!==ge){ge.appendChild(H),u.add(w),ge.onpaint=ct=>{let st=ct.changedElements;for(let _t of u)st.includes(_t.image)&&(_t.needsUpdate=!0)},ge.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,H);else{let ct=e.RGBA,st=e.RGBA,_t=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,ct,st,_t,H)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(de.length>0){if(Se&&Te){let ge=He(de[0]);i.texStorage2D(e.TEXTURE_2D,$e,O,ge.width,ge.height)}for(let ge=0,ct=de.length;ge<ct;ge++)K=de[ge],Se?Ce&&i.texSubImage2D(e.TEXTURE_2D,ge,0,0,ne,Ne,K):i.texImage2D(e.TEXTURE_2D,ge,O,ne,Ne,K);w.generateMipmaps=!1}else if(Se){if(Te){let ge=He(H);i.texStorage2D(e.TEXTURE_2D,$e,O,ge.width,ge.height)}Ce&&i.texSubImage2D(e.TEXTURE_2D,0,0,0,ne,Ne,H)}else i.texImage2D(e.TEXTURE_2D,0,O,ne,Ne,H);S(w)&&w.mipmapsAutoUpdate===!0&&x(ce),Ae.__version=Re.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function ae(C,w,X){if(w.image.length!==6)return;let ce=ue(C,w),ee=w.source;i.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+X);let Re=r.get(ee);if(ee.version!==Re.__version||ce===!0){i.activeTexture(e.TEXTURE0+X);let Ae=yt.getPrimaries(yt.workingColorSpace),H=w.colorSpace===dr?null:yt.getPrimaries(w.colorSpace),ne=w.colorSpace===dr||Ae===H?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(e.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let Ne=w.isCompressedTexture||w.image[0].isCompressedTexture,O=w.image[0]&&w.image[0].isDataTexture,K=[];for(let Oe=0;Oe<6;Oe++)!Ne&&!O?K[Oe]=f(w.image[Oe],!0,a.maxCubemapSize):K[Oe]=O?w.image[Oe].image:w.image[Oe],K[Oe]=je(w,K[Oe]);let de=K[0],Se=n.convert(w.format,w.colorSpace),Te=n.convert(w.type),Ce=b(w.internalFormat,Se,Te,w.normalized,w.colorSpace),$e=w.isVideoTexture!==!0,ge=Re.__version===void 0||ce===!0,ct=ee.dataReady,st=M(w,de);vt(e.TEXTURE_CUBE_MAP,w);let _t;if(w.isDepthTexture){if(Ce=_(w.format===fr,w.type),ge)if($e)i.texStorage2D(e.TEXTURE_CUBE_MAP,1,Ce,de.width,de.height);else for(let Oe=0;Oe<6;Oe++)i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0,Ce,de.width,de.height,0,Se,Te,null)}else if(Ne){$e&&ge&&i.texStorage2D(e.TEXTURE_CUBE_MAP,st,Ce,de.width,de.height);for(let Oe=0;Oe<6;Oe++){_t=K[Oe].mipmaps;for(let Tt=0;Tt<_t.length;Tt++){let Pt=_t[Tt];w.format!==bi?Se!==null?$e?ct&&i.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt,0,0,Pt.width,Pt.height,Se,Pt.data):i.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt,Ce,Pt.width,Pt.height,0,Pt.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?ct&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt,0,0,Pt.width,Pt.height,Se,Te,Pt.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt,Ce,Pt.width,Pt.height,0,Se,Te,Pt.data)}}}else{if(_t=w.mipmaps,$e&&ge){_t.length>0&&st++;let Oe=He(K[0]);i.texStorage2D(e.TEXTURE_CUBE_MAP,st,Ce,Oe.width,Oe.height)}for(let Oe=0;Oe<6;Oe++)if(O){$e?ct&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0,0,0,K[Oe].width,K[Oe].height,Se,Te,K[Oe].data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0,Ce,K[Oe].width,K[Oe].height,0,Se,Te,K[Oe].data);for(let Tt=0;Tt<_t.length;Tt++){let Pt=_t[Tt].image[Oe].image;$e?ct&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt+1,0,0,Pt.width,Pt.height,Se,Te,Pt.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt+1,Ce,Pt.width,Pt.height,0,Se,Te,Pt.data)}}else{$e?ct&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0,0,0,Se,Te,K[Oe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,0,Ce,Se,Te,K[Oe]);for(let Tt=0;Tt<_t.length;Tt++){let Pt=_t[Tt];$e?ct&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt+1,0,0,Se,Te,Pt.image[Oe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Oe,Tt+1,Ce,Se,Te,Pt.image[Oe])}}}S(w)&&w.mipmapsAutoUpdate===!0&&x(e.TEXTURE_CUBE_MAP),Re.__version=ee.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function te(C,w,X,ce,ee,Re){let Ae=n.convert(X.format,X.colorSpace),H=n.convert(X.type),ne=b(X.internalFormat,Ae,H,X.normalized,X.colorSpace),Ne=r.get(w),O=r.get(X);if(O.__renderTarget=w,!Ne.__hasExternalTextures){let K=Math.max(1,w.width>>Re),de=Math.max(1,w.height>>Re);ee===e.TEXTURE_3D||ee===e.TEXTURE_2D_ARRAY?i.texImage3D(ee,Re,ne,K,de,w.depth,0,Ae,H,null):i.texImage2D(ee,Re,ne,K,de,0,Ae,H,null)}i.bindFramebuffer(e.FRAMEBUFFER,C),et(w)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ce,ee,O.__webglTexture,0,re(w)):(ee===e.TEXTURE_2D||ee>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,ce,ee,O.__webglTexture,Re),i.bindFramebuffer(e.FRAMEBUFFER,null)}function oe(C,w,X){if(e.bindRenderbuffer(e.RENDERBUFFER,C),w.depthBuffer){let ce=w.depthTexture,ee=ce&&ce.isDepthTexture?ce.type:null,Re=_(w.stencilBuffer,ee),Ae=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;et(w)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,re(w),Re,w.width,w.height):X?e.renderbufferStorageMultisample(e.RENDERBUFFER,re(w),Re,w.width,w.height):e.renderbufferStorage(e.RENDERBUFFER,Re,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Ae,e.RENDERBUFFER,C)}else{let ce=w.textures;for(let ee=0;ee<ce.length;ee++){let Re=ce[ee],Ae=n.convert(Re.format,Re.colorSpace),H=n.convert(Re.type),ne=b(Re.internalFormat,Ae,H,Re.normalized,Re.colorSpace);et(w)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,re(w),ne,w.width,w.height):X?e.renderbufferStorageMultisample(e.RENDERBUFFER,re(w),ne,w.width,w.height):e.renderbufferStorage(e.RENDERBUFFER,ne,w.width,w.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ie(C,w,X){let ce=w.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(e.FRAMEBUFFER,C),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ee=r.get(w.depthTexture);ee.__renderTarget=w;let Re=ce?w.depthTexture.image[0]:w.depthTexture.image;(!ee.__webglTexture||Re.width!==w.width||Re.height!==w.height)&&(Re.width=w.width,Re.height=w.height,w.depthTexture.needsUpdate=!0),ce?fe(w.depthTexture,0):Pe(w.depthTexture,0);let Ae=ee.__webglTexture,H=re(w),ne=ce?e.TEXTURE_CUBE_MAP_POSITIVE_X+X:e.TEXTURE_2D,Ne=w.depthTexture.format===fr?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(w.depthTexture.format===yr)et(w)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Ne,ne,Ae,0,H):e.framebufferTexture2D(e.FRAMEBUFFER,Ne,ne,Ae,0);else if(w.depthTexture.format===fr)et(w)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Ne,ne,Ae,0,H):e.framebufferTexture2D(e.FRAMEBUFFER,Ne,ne,Ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function be(C){let w=r.get(C),X=C.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==C.depthTexture){let ce=C.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ce){let ee=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ce.removeEventListener("dispose",ee)};ce.addEventListener("dispose",ee),w.__depthDisposeCallback=ee}w.__boundDepthTexture=ce}if(C.depthTexture&&!w.__autoAllocateDepthBuffer)if(X)for(let ce=0;ce<6;ce++)ie(w.__webglFramebuffer[ce],C,ce);else C.texture.mipmaps.length>0?ie(w.__webglFramebuffer[0],C,0):ie(w.__webglFramebuffer,C,0);else if(X){w.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(i.bindFramebuffer(e.FRAMEBUFFER,w.__webglFramebuffer[ce]),w.__webglDepthbuffer[ce]===void 0)w.__webglDepthbuffer[ce]=e.createRenderbuffer(),oe(w.__webglDepthbuffer[ce],C,!1);else{let ee=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Re=w.__webglDepthbuffer[ce];e.bindRenderbuffer(e.RENDERBUFFER,Re),e.framebufferRenderbuffer(e.FRAMEBUFFER,ee,e.RENDERBUFFER,Re)}}else if(C.texture.mipmaps.length>0?i.bindFramebuffer(e.FRAMEBUFFER,w.__webglFramebuffer[0]):i.bindFramebuffer(e.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=e.createRenderbuffer(),oe(w.__webglDepthbuffer,C,!1);else{let ce=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ee=w.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,ee),e.framebufferRenderbuffer(e.FRAMEBUFFER,ce,e.RENDERBUFFER,ee)}i.bindFramebuffer(e.FRAMEBUFFER,null)}function We(C,w,X){let ce=r.get(C);w!==void 0&&te(ce.__webglFramebuffer,C,C.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),X!==void 0&&be(C)}function U(C){let w=C.texture,X=r.get(C),ce=r.get(w);C.addEventListener("dispose",L),E(C);let ee=C.textures,Re=C.isWebGLCubeRenderTarget===!0,Ae=ee.length>1;if(Ae||(ce.__webglTexture===void 0&&(ce.__webglTexture=e.createTexture()),ce.__version=w.version,s.memory.textures++),Re){X.__webglFramebuffer=[];for(let H=0;H<6;H++)if(w.mipmaps.length>0){X.__webglFramebuffer[H]=[];for(let ne=0;ne<w.mipmaps.length;ne++)X.__webglFramebuffer[H][ne]=e.createFramebuffer()}else X.__webglFramebuffer[H]=e.createFramebuffer()}else{if(w.mipmaps.length>0){X.__webglFramebuffer=[];for(let H=0;H<w.mipmaps.length;H++)X.__webglFramebuffer[H]=e.createFramebuffer()}else X.__webglFramebuffer=e.createFramebuffer();if(Ae)for(let H=0,ne=ee.length;H<ne;H++){let Ne=r.get(ee[H]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=e.createTexture(),s.memory.textures++)}if(C.samples>0&&et(C)===!1){X.__webglMultisampledFramebuffer=e.createFramebuffer(),X.__webglColorRenderbuffer=[],i.bindFramebuffer(e.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let H=0;H<ee.length;H++){let ne=ee[H];X.__webglColorRenderbuffer[H]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,X.__webglColorRenderbuffer[H]);let Ne=n.convert(ne.format,ne.colorSpace),O=n.convert(ne.type),K=b(ne.internalFormat,Ne,O,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),de=re(C);e.renderbufferStorageMultisample(e.RENDERBUFFER,de,K,C.width,C.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+H,e.RENDERBUFFER,X.__webglColorRenderbuffer[H])}e.bindRenderbuffer(e.RENDERBUFFER,null),C.depthBuffer&&(X.__webglDepthRenderbuffer=e.createRenderbuffer(),oe(X.__webglDepthRenderbuffer,C,!0)),i.bindFramebuffer(e.FRAMEBUFFER,null)}}if(Re){i.bindTexture(e.TEXTURE_CUBE_MAP,ce.__webglTexture),vt(e.TEXTURE_CUBE_MAP,w);for(let H=0;H<6;H++)if(w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)te(X.__webglFramebuffer[H][ne],C,w,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+H,ne);else te(X.__webglFramebuffer[H],C,w,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+H,0);S(w)?x(e.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),i.unbindTexture()}else if(Ae){for(let H=0,ne=ee.length;H<ne;H++){let Ne=ee[H],O=r.get(Ne),K=e.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(K,O.__webglTexture),vt(K,Ne),te(X.__webglFramebuffer,C,Ne,e.COLOR_ATTACHMENT0+H,K,0),S(Ne)&&x(K)}i.unbindTexture()}else{let H=e.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(H=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(H,ce.__webglTexture),vt(H,w),w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)te(X.__webglFramebuffer[ne],C,w,e.COLOR_ATTACHMENT0,H,ne);else te(X.__webglFramebuffer,C,w,e.COLOR_ATTACHMENT0,H,0);S(w)?x(H):w.mipmaps.length>0&&e.texParameteri(H,e.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),i.unbindTexture()}C.depthBuffer&&be(C)}function Ie(C){let w=C.textures;for(let X=0,ce=w.length;X<ce;X++){let ee=w[X];if(S(ee)&&ee.mipmapsAutoUpdate===!0){let Re=A(C),Ae=r.get(ee).__webglTexture;i.bindTexture(Re,Ae),x(Re),i.unbindTexture()}}}let _e=[];function Xe(C){if(C.samples>0){if(et(C)===!1){let w=C.textures,X=C.width,ce=C.height,ee=e.COLOR_BUFFER_BIT,Re=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Ae=r.get(C),H=w.length>1;if(H)for(let ne=0;ne<w.length;ne++)i.bindFramebuffer(e.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.RENDERBUFFER,null),i.bindFramebuffer(e.FRAMEBUFFER,Ae.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.TEXTURE_2D,null,0);i.bindFramebuffer(e.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?i.bindFramebuffer(e.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):i.bindFramebuffer(e.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let ne=0;ne<w.length;ne++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ee|=e.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ee|=e.STENCIL_BUFFER_BIT)),H){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Ae.__webglColorRenderbuffer[ne]);let Ne=r.get(w[ne]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Ne,0)}e.blitFramebuffer(0,0,X,ce,0,0,X,ce,ee,e.NEAREST),l===!0&&(_e.length=0,_e.push(e.COLOR_ATTACHMENT0+ne),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&_e.push(Re),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,_e))}if(i.bindFramebuffer(e.READ_FRAMEBUFFER,null),i.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),H)for(let ne=0;ne<w.length;ne++){i.bindFramebuffer(e.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.RENDERBUFFER,Ae.__webglColorRenderbuffer[ne]);let Ne=r.get(w[ne]).__webglTexture;i.bindFramebuffer(e.FRAMEBUFFER,Ae.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ne,e.TEXTURE_2D,Ne,0)}i.bindFramebuffer(e.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let w=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[w])}}}function re(C){return Math.min(a.maxSamples,C.samples)}function et(C){let w=r.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function we(C){let w=s.render.frame;c.get(C)!==w&&(c.set(C,w),C.update())}function je(C,w){let X=C.colorSpace,ce=C.format,ee=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||X!==kn&&X!==dr&&(yt.getTransfer(X)===bt?(ce!==bi||ee!==Mi)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",X)),w}function He(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(h.width=C.naturalWidth||C.width,h.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(h.width=C.displayWidth,h.height=C.displayHeight):(h.width=C.width,h.height=C.height),h}this.allocateTextureUnit=$,this.resetTextureUnits=W,this.getTextureUnits=Q,this.setTextureUnits=ve,this.setTexture2D=Pe,this.setTexture2DArray=Ye,this.setTexture3D=Ve,this.setTextureCube=fe,this.rebindTextures=We,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Ie,this.updateMultisampleRenderTarget=Xe,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=te,this.useMultisampledRTT=et,this.dispose=B}function tm(e,t){function i(r,a=dr){let n,s=yt.getTransfer(a);if(r===Mi)return e.UNSIGNED_BYTE;if(r===el)return e.UNSIGNED_SHORT_4_4_4_4;if(r===tl)return e.UNSIGNED_SHORT_5_5_5_1;if(r===kh)return e.UNSIGNED_INT_5_9_9_9_REV;if(r===Gh)return e.UNSIGNED_INT_10F_11F_11F_REV;if(r===zh)return e.BYTE;if(r===Hh)return e.SHORT;if(r===Ya)return e.UNSIGNED_SHORT;if(r===Qo)return e.INT;if(r===Ni)return e.UNSIGNED_INT;if(r===mi)return e.FLOAT;if(r===qi)return e.HALF_FLOAT;if(r===Vh)return e.ALPHA;if(r===Wh)return e.RGB;if(r===bi)return e.RGBA;if(r===yr)return e.DEPTH_COMPONENT;if(r===fr)return e.DEPTH_STENCIL;if(r===il)return e.RED;if(r===es)return e.RED_INTEGER;if(r===Dr)return e.RG;if(r===rl)return e.RG_INTEGER;if(r===al)return e.RGBA_INTEGER;if(r===Rn||r===Cn||r===Pn||r===In)if(s===bt)if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(r===Rn)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Cn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Pn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===In)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(r===Rn)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Cn)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Pn)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===In)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===vo||r===_o||r===yo||r===xo)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(r===vo)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===_o)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===yo)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===xo)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===So||r===Mo||r===bo||r===Eo||r===wo||r===Fn||r===To)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(r===So||r===Mo)return s===bt?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(r===bo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(r===Eo)return n.COMPRESSED_R11_EAC;if(r===wo)return n.COMPRESSED_SIGNED_R11_EAC;if(r===Fn)return n.COMPRESSED_RG11_EAC;if(r===To)return n.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===Ao||r===Ro||r===Co||r===Po||r===Io||r===Lo||r===Do||r===Uo||r===No||r===Oo||r===Fo||r===Bo||r===zo||r===Ho)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(r===Ao)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ro)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Co)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Po)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Io)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Lo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Do)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Uo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===No)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Oo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Fo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Bo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===zo)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ho)return s===bt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ko||r===Go||r===Vo)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(r===ko)return s===bt?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Go)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Vo)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Wo||r===Xo||r===Bn||r===jo)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(r===Wo)return n.COMPRESSED_RED_RGTC1_EXT;if(r===Xo)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Bn)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===jo)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===la?e.UNSIGNED_INT_24_8:e[r]!==void 0?e[r]:null}return{convert:i}}var cM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,dM=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new nc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Sr({vertexShader:cM,fragmentShader:uM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new it(new Fi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},pM=class extends Zi{constructor(e,t){super();let i=this,r=null,a=1,n=null,s="local-floor",o=1,l=null,h=null,c=null,u=null,p=null,d=null,g=typeof XRWebGLBinding<"u",y=new dM,v={},m=t.getContextAttributes(),f=null,S=null,x=[],A=[],b=new se,_=null,M=null,E=new Jt;E.viewport=new Ct;let P=new Jt;P.viewport=new Ct;let I=[E,P],L=new Nf,Y=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let he=x[$];return he===void 0&&(he=new oo,x[$]=he),he.getTargetRaySpace()},this.getControllerGrip=function($){let he=x[$];return he===void 0&&(he=new oo,x[$]=he),he.getGripSpace()},this.getHand=function($){let he=x[$];return he===void 0&&(he=new oo,x[$]=he),he.getHandSpace()};function B($){let he=A.indexOf($.inputSource);if(he===-1)return;let Pe=x[he];Pe!==void 0&&(Pe.update($.inputSource,$.frame,l||n),Pe.dispatchEvent({type:$.type,data:$.inputSource}))}function Z(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",Z),r.removeEventListener("inputsourceschange",V);for(let $=0;$<x.length;$++){let he=A[$];he!==null&&(A[$]=null,x[$].disconnect(he))}Y=null,D=null,y.reset();for(let $ in v)delete v[$];if(e.setRenderTarget(f),p=null,u=null,c=null,r=null,S=null,ve.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(b.width,b.height,!1),M!==null){let $=M.camera;$.fov=M.fov,$.zoom=M.zoom,$.updateProjectionMatrix(),M=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){s=$,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||n},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return c===null&&g&&(c=new XRWebGLBinding(r,t)),c},this.getFrame=function(){return d},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",Z),r.addEventListener("inputsourceschange",V),m.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(b),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,Pe=null,Ye=null;m.depth&&(Ye=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=m.stencil?fr:yr,Pe=m.stencil?la:Ni);let Ve={colorFormat:t.RGBA8,depthFormat:Ye,scaleFactor:a};c=this.getBinding(),u=c.createProjectionLayer(Ve),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Pi(u.textureWidth,u.textureHeight,{format:bi,type:Mi,depthTexture:new ua(u.textureWidth,u.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let he={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(r,t,he),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Pi(p.framebufferWidth,p.framebufferHeight,{format:bi,type:Mi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(o),l=null,n=await r.requestReferenceSpace(s),ve.setContext(r),ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function V($){for(let he=0;he<$.removed.length;he++){let Pe=$.removed[he],Ye=A.indexOf(Pe);Ye>=0&&(A[Ye]=null,x[Ye].disconnect(Pe))}for(let he=0;he<$.added.length;he++){let Pe=$.added[he],Ye=A.indexOf(Pe);if(Ye===-1){for(let fe=0;fe<x.length;fe++)if(fe>=A.length){A.push(Pe),Ye=fe;break}else if(A[fe]===null){A[fe]=Pe,Ye=fe;break}if(Ye===-1)break}let Ve=x[Ye];Ve&&Ve.connect(Pe)}}function pe($,he){he===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(he.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let he=$.near,Pe=$.far;y.texture!==null&&(y.depthNear>0&&(he=y.depthNear),y.depthFar>0&&(Pe=y.depthFar)),L.near=P.near=E.near=he,L.far=P.far=E.far=Pe,(Y!==L.near||D!==L.far)&&(r.updateRenderState({depthNear:L.near,depthFar:L.far}),Y=L.near,D=L.far),L.layers.mask=$.layers.mask|6,E.layers.mask=L.layers.mask&-5,P.layers.mask=L.layers.mask&-3;let Ye=$.parent,Ve=L.cameras;pe(L,Ye);for(let fe=0;fe<Ve.length;fe++)pe(Ve[fe],Ye);L.projectionMatrix.copy(E.projectionMatrix),L.projectionMatrixInverse.copy(E.projectionMatrixInverse),M===null&&$.isPerspectiveCamera&&(M={camera:$,fov:$.fov,zoom:$.zoom}),z($,L,Ye)};function z($,he,Pe){Pe===null?$.matrix.copy(he.matrixWorld):($.matrix.copy(Pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(he.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(he.projectionMatrix),$.projectionMatrixInverse.copy(he.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Za*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(u===null&&p===null))return o},this.setFoveation=function($){o=$,u!==null&&(u.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(L)},this.getCameraTexture=function($){return v[$]};let W=null;function Q($,he){if(h=he.getViewerPose(l||n),d=he,h!==null){let Pe=h.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let Ye=!1;Pe.length!==L.cameras.length&&(L.cameras.length=0,Ye=!0);for(let fe=0;fe<Pe.length;fe++){let rt=Pe[fe],pt=null;if(p!==null)pt=p.getViewport(rt);else{let vt=c.getViewSubImage(u,rt);pt=vt.viewport,fe===0&&(e.setRenderTargetTextures(S,vt.colorTexture,vt.depthStencilTexture),e.setRenderTarget(S))}let Ue=I[fe];Ue===void 0&&(Ue=new Jt,Ue.layers.enable(fe),Ue.viewport=new Ct,I[fe]=Ue),Ue.matrix.fromArray(rt.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(rt.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(pt.x,pt.y,pt.width,pt.height),fe===0&&(L.matrix.copy(Ue.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ye===!0&&L.cameras.push(Ue)}let Ve=r.enabledFeatures;if(Ve&&Ve.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&g){c=i.getBinding();let fe=c.getDepthInformation(Pe[0]);fe&&fe.isValid&&fe.texture&&y.init(fe,r.renderState)}if(Ve&&Ve.includes("camera-access")&&g){e.state.unbindTexture(),c=i.getBinding();for(let fe=0;fe<Pe.length;fe++){let rt=Pe[fe].camera;if(rt){let pt=v[rt];pt||(pt=new nc,v[rt]=pt);let Ue=c.getCameraImage(rt);pt.sourceTexture=Ue}}}}for(let Pe=0;Pe<x.length;Pe++){let Ye=A[Pe],Ve=x[Pe];Ye!==null&&Ve!==void 0&&Ve.update(Ye,he,l||n)}W&&W($,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),d=null}let ve=new Wf;ve.setAnimationLoop(Q),this.setAnimationLoop=function($){W=$},this.dispose=function(){}}},fM=new lt,im=new ut;im.set(-1,0,0,0,1,0,0,0,1);function mM(e,t){function i(v,m){v.matrixAutoUpdate===!0&&v.updateMatrix(),m.value.copy(v.matrix)}function r(v,m){m.color.getRGB(v.fogColor.value,cf(e)),m.isFog?(v.fogNear.value=m.near,v.fogFar.value=m.far):m.isFogExp2&&(v.fogDensity.value=m.density)}function a(v,m,f,S,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?n(v,m):m.isMeshLambertMaterial?(n(v,m),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(n(v,m),u(v,m)):m.isMeshPhongMaterial?(n(v,m),c(v,m),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(n(v,m),p(v,m),m.isMeshPhysicalMaterial&&d(v,m,x)):m.isMeshMatcapMaterial?(n(v,m),g(v,m)):m.isMeshDepthMaterial?n(v,m):m.isMeshDistanceMaterial?(n(v,m),y(v,m)):m.isMeshNormalMaterial?n(v,m):m.isLineBasicMaterial?(s(v,m),m.isLineDashedMaterial&&o(v,m)):m.isPointsMaterial?l(v,m,f,S):m.isSpriteMaterial?h(v,m):m.isShadowMaterial?(v.color.value.copy(m.color),v.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function n(v,m){v.opacity.value=m.opacity,m.color&&v.diffuse.value.copy(m.color),m.emissive&&v.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(v.map.value=m.map,i(m.map,v.mapTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,i(m.alphaMap,v.alphaMapTransform)),m.bumpMap&&(v.bumpMap.value=m.bumpMap,i(m.bumpMap,v.bumpMapTransform),v.bumpScale.value=m.bumpScale,m.side===gi&&(v.bumpScale.value*=-1)),m.normalMap&&(v.normalMap.value=m.normalMap,i(m.normalMap,v.normalMapTransform),v.normalScale.value.copy(m.normalScale),m.side===gi&&v.normalScale.value.negate()),m.displacementMap&&(v.displacementMap.value=m.displacementMap,i(m.displacementMap,v.displacementMapTransform),v.displacementScale.value=m.displacementScale,v.displacementBias.value=m.displacementBias),m.emissiveMap&&(v.emissiveMap.value=m.emissiveMap,i(m.emissiveMap,v.emissiveMapTransform)),m.specularMap&&(v.specularMap.value=m.specularMap,i(m.specularMap,v.specularMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest);let f=t.get(m),S=f.envMap,x=f.envMapRotation;S&&(v.envMap.value=S,v.envMapRotation.value.setFromMatrix4(fM.makeRotationFromEuler(x)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&v.envMapRotation.value.premultiply(im),v.reflectivity.value=m.reflectivity,v.ior.value=m.ior,v.refractionRatio.value=m.refractionRatio),m.lightMap&&(v.lightMap.value=m.lightMap,v.lightMapIntensity.value=m.lightMapIntensity,i(m.lightMap,v.lightMapTransform)),m.aoMap&&(v.aoMap.value=m.aoMap,v.aoMapIntensity.value=m.aoMapIntensity,i(m.aoMap,v.aoMapTransform))}function s(v,m){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,m.map&&(v.map.value=m.map,i(m.map,v.mapTransform))}function o(v,m){v.dashSize.value=m.dashSize,v.totalSize.value=m.dashSize+m.gapSize,v.scale.value=m.scale}function l(v,m,f,S){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,v.size.value=m.size*f,v.scale.value=S*.5,m.map&&(v.map.value=m.map,i(m.map,v.uvTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,i(m.alphaMap,v.alphaMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest)}function h(v,m){v.diffuse.value.copy(m.color),v.opacity.value=m.opacity,v.rotation.value=m.rotation,m.map&&(v.map.value=m.map,i(m.map,v.mapTransform)),m.alphaMap&&(v.alphaMap.value=m.alphaMap,i(m.alphaMap,v.alphaMapTransform)),m.alphaTest>0&&(v.alphaTest.value=m.alphaTest)}function c(v,m){v.specular.value.copy(m.specular),v.shininess.value=Math.max(m.shininess,1e-4)}function u(v,m){m.gradientMap&&(v.gradientMap.value=m.gradientMap)}function p(v,m){v.metalness.value=m.metalness,m.metalnessMap&&(v.metalnessMap.value=m.metalnessMap,i(m.metalnessMap,v.metalnessMapTransform)),v.roughness.value=m.roughness,m.roughnessMap&&(v.roughnessMap.value=m.roughnessMap,i(m.roughnessMap,v.roughnessMapTransform)),m.envMap&&(v.envMapIntensity.value=m.envMapIntensity)}function d(v,m,f){v.ior.value=m.ior,m.diffuseRoughness>0&&(v.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(v.diffuseRoughnessMap.value=m.diffuseRoughnessMap,i(m.diffuseRoughnessMap,v.diffuseRoughnessMapTransform))),m.sheen>0&&(v.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),v.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(v.sheenColorMap.value=m.sheenColorMap,i(m.sheenColorMap,v.sheenColorMapTransform)),m.sheenRoughnessMap&&(v.sheenRoughnessMap.value=m.sheenRoughnessMap,i(m.sheenRoughnessMap,v.sheenRoughnessMapTransform))),m.clearcoat>0&&(v.clearcoat.value=m.clearcoat,v.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(v.clearcoatMap.value=m.clearcoatMap,i(m.clearcoatMap,v.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,i(m.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(v.clearcoatNormalMap.value=m.clearcoatNormalMap,i(m.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===gi&&v.clearcoatNormalScale.value.negate())),m.dispersion>0&&(v.dispersion.value=m.dispersion),m.retroreflectivity>0&&(v.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(v.iridescence.value=m.iridescence,v.iridescenceIOR.value=m.iridescenceIOR,v.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,v.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(v.iridescenceMap.value=m.iridescenceMap,i(m.iridescenceMap,v.iridescenceMapTransform)),m.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=m.iridescenceThicknessMap,i(m.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),m.transmission>0&&(v.transmission.value=m.transmission,v.transmissionSamplerMap.value=f.texture,v.transmissionSamplerSize.value.set(f.width,f.height),m.transmissionMap&&(v.transmissionMap.value=m.transmissionMap,i(m.transmissionMap,v.transmissionMapTransform)),v.thickness.value=m.thickness,m.thicknessMap&&(v.thicknessMap.value=m.thicknessMap,i(m.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=m.attenuationDistance,v.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(v.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(v.anisotropyMap.value=m.anisotropyMap,i(m.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=m.specularIntensity,v.specularColor.value.copy(m.specularColor),m.specularColorMap&&(v.specularColorMap.value=m.specularColorMap,i(m.specularColorMap,v.specularColorMapTransform)),m.specularIntensityMap&&(v.specularIntensityMap.value=m.specularIntensityMap,i(m.specularIntensityMap,v.specularIntensityMapTransform))}function g(v,m){m.matcap&&(v.matcap.value=m.matcap)}function y(v,m){let f=t.get(m).light;v.referencePosition.value.setFromMatrixPosition(f.matrixWorld),v.nearDistance.value=f.shadow.camera.near,v.farDistance.value=f.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function gM(e,t,i,r){let a={},n={};function s(f,S){let x=S.program;r.uniformBlockBinding(f,x,a[f.id])}function o(f,S){let x=a[f.id];x===void 0&&(g(f),x=l(f),a[f.id]=x,f.addEventListener("dispose",v));let A=S.program;r.updateUBOMapping(f,A);let b=t.render.frame;n[f.id]!==b&&(h(f),n[f.id]=b)}function l(f){let S=e.createBuffer(),x=f.__size,A=f.usage;return e.bindBuffer(e.UNIFORM_BUFFER,S),e.bufferData(e.UNIFORM_BUFFER,x,A),e.bindBuffer(e.UNIFORM_BUFFER,null),S}function h(f){let S=a[f.id],x=f.uniforms,A=f.__cache;e.bindBuffer(e.UNIFORM_BUFFER,S);for(let b=0,_=x.length;b<_;b++){let M=x[b];if(Array.isArray(M))for(let E=0,P=M.length;E<P;E++)c(M[E],b,E,A);else c(M,b,0,A)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function c(f,S,x,A){if(p(f,S,x,A)===!0){let b=f.__offset,_=f.value;if(Array.isArray(_)){let M=0;for(let E=0;E<_.length;E++){let P=_[E],I=y(P,!0);u(P,f.__data,M),M+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,f.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,b,f.__data)}}function u(f,S,x){typeof f=="number"||typeof f=="boolean"?S[x]=f:f.isMatrix3?(S[x]=f.elements[0],S[x+1]=f.elements[1],S[x+2]=f.elements[2],S[x+3]=0,S[x+4]=f.elements[3],S[x+5]=f.elements[4],S[x+6]=f.elements[5],S[x+7]=0,S[x+8]=f.elements[6],S[x+9]=f.elements[7],S[x+10]=f.elements[8],S[x+11]=0):ArrayBuffer.isView(f)?S.set(f.subarray(0,S.length-x),x):f.toArray(S,x)}function p(f,S,x,A){let b=f.value,_=S+"_"+x;if(Array.isArray(b)){A[_]===void 0&&(A[_]=[]);let M=A[_],E=!1;for(let P=0;P<b.length;P++)d(b[P],M,P)===!0&&(E=!0);return E}return d(b,A,_)}function d(f,S,x){if(S[x]===void 0)return typeof f=="number"||typeof f=="boolean"?S[x]=f:ArrayBuffer.isView(f)?S[x]=f.slice():S[x]=f.clone(),!0;{let A=S[x];if(typeof f=="number"||typeof f=="boolean"){if(A!==f)return S[x]=f,!0}else{if(ArrayBuffer.isView(f))return!0;if(A.equals(f)===!1)return A.copy(f),!0}}return!1}function g(f){let S=f.uniforms,x=0,A=16;for(let _=0,M=S.length;_<M;_++){let E=Array.isArray(S[_])?S[_]:[S[_]];for(let P=0,I=E.length;P<I;P++){let L=E[P],Y=Array.isArray(L.value)?L.value:[L.value],D=Array.isArray(S[_])||Array.isArray(L.value),B=x;for(let V=0,pe=Y.length;V<pe;V++){let z=Y[V],W=y(z,D),Q=x%A,ve=Q%W.boundary,$=Q+ve;x+=ve,$!==0&&A-$<W.storage&&(x+=A-$),V===0&&(B=x),x+=W.storage}let Z=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new Z((x-B)/Float32Array.BYTES_PER_ELEMENT),L.__offset=B}}let b=x%A;return b>0&&(x+=A-b),f.__size=x,f.__cache={},this}function y(f,S){let x={boundary:0,storage:0};return typeof f=="number"||typeof f=="boolean"?(x.boundary=4,x.storage=4):f.isVector2?(x.boundary=8,x.storage=8):f.isVector3||f.isColor?(x.boundary=16,x.storage=12):f.isVector4?(x.boundary=16,x.storage=16):f.isMatrix3?(x.boundary=16,x.storage=48):f.isMatrix4?(x.boundary=16,x.storage=64):f.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(f)?(x.boundary=16,x.storage=f.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",f),S===!0&&(x.boundary=16,x.storage=Math.ceil(x.storage/16)*16),x}function v(f){let S=f.target;S.removeEventListener("dispose",v),e.deleteBuffer(a[S.id]),delete a[S.id],delete n[S.id]}function m(){for(let f in a)e.deleteBuffer(a[f]);a={},n={}}return{bind:s,update:o,dispose:m}}var vM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),er=null;function _M(){return er===null&&(er=new Ui(vM,16,16,Dr,qi),er.name="DFG_LUT",er.minFilter=Nt,er.magFilter=Nt,er.wrapS=Kt,er.wrapT=Kt,er.generateMipmaps=!1,er.needsUpdate=!0),er}var wc=class{constructor(e={}){let{canvas:t=qd(),context:i=null,depth:r=!0,stencil:a=!1,alpha:n=!1,antialias:s=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:c=!1,reversedDepthBuffer:u=!1,outputBufferType:p=Mi}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=n;let g=p,y=new Set([al,rl,es]),v=new Set([Mi,Ni,Ya,la,el,tl]),m=new Uint32Array(4),f=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]},x=null,A=null,b=[],_=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=rr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let E=this,P=!1,I=null,L=null,Y=null,D=null;this._outputColorSpace=Xt;let B=0,Z=0,V=null,pe=-1,z=null,W=new Ct,Q=new Ct,ve=null,$=new ke(0),he=0,Pe=t.width,Ye=t.height,Ve=1,fe=null,rt=null,pt=new Ct(0,0,Pe,Ye),Ue=new Ct(0,0,Pe,Ye),vt=!1,ue=new ca,xe=new tc,me=!1,ze=!1,ae=new lt,te=new R,oe=new Ct,ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},be=!1;function We(){return V===null?Ve:1}let U=i;function Ie(T,F){return t.getContext(T,F)}let _e,Xe,re,et,we,je,He,C,w,X,ce,ee,Re,Ae,H,ne,Ne,O,K,de,Se,Te,Ce;try{let T={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:c};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r187"),t.addEventListener("webglcontextlost",ct,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",_t,!1),U===null){let F="webgl2";if(U=Ie(F,T),U===null)throw Ie(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}$e()}catch(T){throw t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",_t,!1),Qe("WebGLRenderer: "+T.message),T}function $e(){_e=new b1(U),_e.init(),Se=new tm(U,_e),Xe=new d1(U,_e,e,Se),re=new lM(U,_e),Xe.reversedDepthBuffer&&u&&re.buffers.depth.setReversed(!0),L=U.createFramebuffer(),Y=U.createFramebuffer(),D=U.createFramebuffer(),et=new T1(U),we=new YS,je=new hM(U,_e,re,we,Xe,Se,et),He=new M1(E),C=new R_(U),Te=new c1(U,C),w=new E1(U,C,et,Te),X=new R1(U,w,C,Te,et),O=new A1(U,Xe,je),H=new p1(we),ce=new qS(E,He,_e,Xe,Te,H),ee=new mM(E,we),Re=new JS,Ae=new iM(_e),Ne=new h1(E,He,re,X,d,o),ne=new oM(E,X,Xe),Ce=new gM(U,et,Xe,re),K=new u1(U,_e,et),de=new w1(U,_e,et),et.programs=ce.programs,E.capabilities=Xe,E.extensions=_e,E.properties=we,E.renderLists=Re,E.shadowMap=ne,E.state=re,E.info=et}g!==Mi&&(M=new P1(g,t.width,t.height,s,r,a));let ge=new pM(E,U);this.xr=ge,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let T=_e.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=_e.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Ve},this.setPixelRatio=function(T){T!==void 0&&(Ve=T,this.setSize(Pe,Ye,!1))},this.getSize=function(T){return T.set(Pe,Ye)},this.setSize=function(T,F,J=!0){if(ge.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}Pe=T,Ye=F,t.width=Math.floor(T*Ve),t.height=Math.floor(F*Ve),J===!0&&(t.style.width=T+"px",t.style.height=F+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(Pe*Ve,Ye*Ve).floor()},this.setDrawingBufferSize=function(T,F,J){Pe=T,Ye=F,Ve=J,t.width=Math.floor(T*J),t.height=Math.floor(F*J),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(g===Mi){Qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(W)},this.getViewport=function(T){return T.copy(pt)},this.setViewport=function(T,F,J,q){T.isVector4?pt.set(T.x,T.y,T.z,T.w):pt.set(T,F,J,q),re.viewport(W.copy(pt).multiplyScalar(We()).round())},this.getScissor=function(T){return T.copy(Ue)},this.setScissor=function(T,F,J,q){T.isVector4?Ue.set(T.x,T.y,T.z,T.w):Ue.set(T,F,J,q),re.scissor(Q.copy(Ue).multiplyScalar(We()).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(T){re.setScissorTest(vt=T)},this.setOpaqueSort=function(T){fe=T},this.setTransparentSort=function(T){rt=T},this.getClearColor=function(T){return T.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,J=!0){let q=0;if(T){let j=!1;if(V!==null){let Ee=V.texture.format;j=y.has(Ee)}if(j){let Ee=V.texture.type,Fe=v.has(Ee),De=Ne.getClearColor(),Ze=Ne.getClearAlpha(),nt=De.r,gt=De.g,xt=De.b;Fe?(m[0]=nt,m[1]=gt,m[2]=xt,m[3]=Ze,U.clearBufferuiv(U.COLOR,0,m)):(f[0]=nt,f[1]=gt,f[2]=xt,f[3]=Ze,U.clearBufferiv(U.COLOR,0,f))}else q|=U.COLOR_BUFFER_BIT}F&&(q|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(q|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&U.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),I=T},this.dispose=function(){t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",_t,!1),Ne.dispose(),Re.dispose(),Ae.dispose(),je.dispose(),we.dispose(),He.dispose(),X.dispose(),w.dispose(),Te.dispose(),Ce.dispose(),ce.dispose(),ge.dispose(),ge.removeEventListener("sessionstart",on),ge.removeEventListener("sessionend",ls),zi.stop()};function ct(T){T.preventDefault(),Wn("WebGLRenderer: Context Lost."),P=!0}function st(){Wn("WebGLRenderer: Context Restored."),P=!1;let T=et.autoReset,F=ne.enabled,J=ne.autoUpdate,q=ne.needsUpdate,j=ne.type;$e(),et.autoReset=T,ne.enabled=F,ne.autoUpdate=J,ne.needsUpdate=q,ne.type=j}function _t(T){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Oe(T){let F=T.target;F.removeEventListener("dispose",Oe),Tt(F)}function Tt(T){Pt(T),we.remove(T)}function Pt(T){let F=we.get(T).programs;F!==void 0&&(F.forEach(function(J){ce.releaseProgram(J)}),T.isShaderMaterial&&ce.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,J,q,j,Ee){F===null&&(F=ie);let Fe=j.isMesh&&j.matrixWorld.determinantAffine()<0,De=at(T,F,J,q,j);re.setMaterial(q,Fe);let Ze=J.index,nt=1;if(q.wireframe===!0){if(Ze=w.getWireframeAttribute(J),Ze===void 0)return;nt=2}let gt=J.drawRange,xt=J.attributes.position,Ke=gt.start*nt,Mt=(gt.start+gt.count)*nt;Ee!==null&&(Ke=Math.max(Ke,Ee.start*nt),Mt=Math.min(Mt,(Ee.start+Ee.count)*nt)),Ze!==null?(Ke=Math.max(Ke,0),Mt=Math.min(Mt,Ze.count)):xt!=null&&(Ke=Math.max(Ke,0),Mt=Math.min(Mt,xt.count));let Vt=Mt-Ke;if(Vt<0||Vt===1/0)return;Te.setup(j,q,De,J,Ze);let At,It=K;if(Ze!==null&&(At=C.get(Ze),It=de,It.setIndex(At)),j.isMesh)q.wireframe===!0?(re.setLineWidth(q.wireframeLinewidth*We()),It.setMode(U.LINES)):It.setMode(U.TRIANGLES);else if(j.isLine){let Ot=q.linewidth;Ot===void 0&&(Ot=1),re.setLineWidth(Ot*We()),j.isLineSegments?It.setMode(U.LINES):j.isLineLoop?It.setMode(U.LINE_LOOP):It.setMode(U.LINE_STRIP)}else j.isPoints?It.setMode(U.POINTS):j.isSprite&&It.setMode(U.TRIANGLES);if(j.isBatchedMesh)if(_e.get("WEBGL_multi_draw"))It.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{let Ot=j._multiDrawStarts,tt=j._multiDrawCounts,ui=j._multiDrawCount,kr=Ze?C.get(Ze).bytesPerElement:1,Gr=we.get(q).currentProgram.getUniforms();for(let ni=0;ni<ui;ni++)Gr.setValue(U,"_gl_DrawID",ni),It.render(Ot[ni]/kr,tt[ni])}else if(j.isInstancedMesh)It.renderInstances(Ke,Vt,j.count);else if(J.isInstancedBufferGeometry){let Ot=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,tt=Math.min(J.instanceCount,Ot);It.renderInstances(Ke,Vt,tt)}else It.render(Ke,Vt)};function ss(T,F,J,q){I!==null&&T.isNodeMaterial&&I.setObject(q,T),me===!0&&H.setState(T,J,!1),T.transparent===!0&&T.side===Di&&T.forceSinglePass===!1?(T.side=gi,T.needsUpdate=!0,le(T,F,q),T.side=Ir,T.needsUpdate=!0,le(T,F,q),T.side=Di):le(T,F,q)}this.compile=function(T,F,J=null){J===null&&(J=T),I!==null&&I.renderStart(T,F,J),A=Ae.get(J),A.init(F),_.push(A),J.traverseVisible(function(j){j.isLight&&j.layers.test(F.layers)&&(A.pushLight(j),j.castShadow&&A.pushShadow(j))}),T!==J&&T.traverseVisible(function(j){j.isLight&&j.layers.test(F.layers)&&(A.pushLight(j),j.castShadow&&A.pushShadow(j))}),A.setupLights(),I!==null&&I.updateLights(A.state.lightsArray),ze=this.localClippingEnabled,me=H.init(this.clippingPlanes,ze),me===!0&&H.setGlobalState(this.clippingPlanes,F),I!==null&&ne.render(A.state.shadowsArray,J,F);let q=new Set;return T.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;let Ee=j.material;if(Ee)if(Array.isArray(Ee))for(let Fe=0;Fe<Ee.length;Fe++){let De=Ee[Fe];ss(De,J,F,j),q.add(De)}else ss(Ee,J,F,j),q.add(Ee)}),A=_.pop(),I!==null&&I.renderEnd(),q},this.compileAsync=function(T,F,J=null){let q=this.compile(T,F,J);return new Promise(j=>{function Ee(){if(q.forEach(function(Fe){let De=we.get(Fe).currentProgram;(De===void 0||De.isReady())&&q.delete(Fe)}),q.size===0){j(T);return}setTimeout(Ee,10)}_e.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let sn=null;function os(T){sn&&sn(T)}function on(){zi.stop()}function ls(){zi.start()}let zi=new Wf;zi.setAnimationLoop(os),typeof self<"u"&&zi.setContext(self),this.setAnimationLoop=function(T){sn=T,ge.setAnimationLoop(T),T===null?zi.stop():zi.start()},ge.addEventListener("sessionstart",on),ge.addEventListener("sessionend",ls),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;I!==null&&I.renderStart(T,F);let J=ge.enabled===!0&&ge.isPresenting===!0,q=M!==null&&(V===null||J)&&M.begin(E,V);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ge.enabled===!0&&ge.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(ge.cameraAutoUpdate===!0&&ge.updateCamera(F),F=ge.getCamera()),T.isScene===!0&&T.onBeforeRender(E,T,F,V),A=Ae.get(T,_.length),A.init(F),A.state.textureUnits=je.getTextureUnits(),_.push(A),ae.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?xe.setFromArrayCamera(F):ue.setFromProjectionMatrix(ae,Ci,F.reversedDepth),ze=this.localClippingEnabled,me=H.init(this.clippingPlanes,ze),x=Re.get(T,b.length),x.init(),b.push(x),this.info.render.frame++,ge.enabled===!0&&ge.isPresenting===!0){let Ee=E.xr.getDepthSensingMesh();Ee!==null&&ln(Ee,F,-1/0,E.sortObjects)}ln(T,F,0,E.sortObjects),x.finish(),I!==null&&I.updateLights(A.state.lightsArray),E.sortObjects===!0&&x.sort(fe,rt),be=ge.enabled===!1||ge.isPresenting===!1||ge.hasDepthSensing()===!1,be&&Ne.addToRenderList(x,T),this.info.autoReset===!0&&this.info.reset(),me===!0&&H.beginShadows();let j=A.state.shadowsArray;if(ne.render(j,T,F),me===!0&&H.endShadows(),(q&&M.hasRenderPass())===!1){let Ee=x.opaque,Fe=x.transmissive;if(A.setupLights(),F.isArrayCamera){let De=F.cameras;if(Fe.length>0)for(let Ze=0,nt=De.length;Ze<nt;Ze++){let gt=De[Ze];cs(Ee,Fe,T,gt)}be&&Ne.render(T);for(let Ze=0,nt=De.length;Ze<nt;Ze++){let gt=De[Ze];hs(x,T,gt,gt.viewport)}}else Fe.length>0&&cs(Ee,Fe,T,F),be&&Ne.render(T),hs(x,T,F)}V!==null&&Z===0&&(je.updateMultisampleRenderTarget(V),je.updateRenderTargetMipmap(V)),q&&M.end(E),T.isScene===!0&&T.onAfterRender(E,T,F),Te.resetDefaultState(),pe=-1,z=null,_.pop(),_.length>0?(A=_[_.length-1],je.setTextureUnits(A.state.textureUnits),me===!0&&H.setGlobalState(E.clippingPlanes,A.state.camera)):A=null,b.pop(),b.length>0?x=b[b.length-1]:x=null,I!==null&&I.renderEnd()};function ln(T,F,J,q){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)J=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)A.pushLight(T),T.castShadow&&A.pushShadow(T);else if(T.isSprite){let Ee=F.isArrayCamera?xe:ue;if(!T.frustumCulled||T.intersectsFrustum(Ee)){q&&oe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ae);let Fe=X.update(T),De=T.material;De.visible&&x.push(T,Fe,De,J,oe.z,null,F)}}else if(T.isMesh||T.isLine||T.isPoints){let Ee=F.isArrayCamera?xe:ue;if(!T.frustumCulled||T.intersectsFrustum(Ee)){let Fe=X.update(T),De=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),oe.copy(T.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),oe.copy(Fe.boundingSphere.center)),oe.applyMatrix4(T.matrixWorld).applyMatrix4(ae)),Array.isArray(De)){let Ze=Fe.groups;for(let nt=0,gt=Ze.length;nt<gt;nt++){let xt=Ze[nt],Ke=De[xt.materialIndex];Ke&&Ke.visible&&x.push(T,Fe,Ke,J,oe.z,xt,F)}}else De.visible&&x.push(T,Fe,De,J,oe.z,null,F)}}}let j=T.children;for(let Ee=0,Fe=j.length;Ee<Fe;Ee++)ln(j[Ee],F,J,q)}function hs(T,F,J,q){let{opaque:j,transmissive:Ee,transparent:Fe}=T;A.setupLightsView(J),me===!0&&H.setGlobalState(E.clippingPlanes,J),q&&re.viewport(W.copy(q)),j.length>0&&N(j,F,J),Ee.length>0&&N(Ee,F,J),Fe.length>0&&N(Fe,F,J),re.buffers.depth.setTest(!0),re.buffers.depth.setMask(!0),re.buffers.color.setMask(!0),re.setPolygonOffset(!1)}function cs(T,F,J,q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[q.id]===void 0){let xt=_e.has("EXT_color_buffer_half_float")||_e.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[q.id]=new Pi(1,1,{generateMipmaps:!0,type:xt?qi:Mi,minFilter:ji,samples:Math.max(4,Xe.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:yt.workingColorSpace})}let j=A.state.transmissionRenderTarget[q.id],Ee=q.viewport||W;j.setSize(Ee.z*E.transmissionResolutionScale,Ee.w*E.transmissionResolutionScale);let Fe=E.getRenderTarget(),De=E.getActiveCubeFace(),Ze=E.getActiveMipmapLevel();E.setRenderTarget(j),E.getClearColor($),he=E.getClearAlpha(),he<1&&E.setClearColor(16777215,.5),E.clear(),be&&Ne.render(J);let nt=E.toneMapping;E.toneMapping=rr;let gt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),A.setupLightsView(q),me===!0&&H.setGlobalState(E.clippingPlanes,q),N(T,J,q),je.updateMultisampleRenderTarget(j),je.updateRenderTargetMipmap(j),_e.has("WEBGL_multisampled_render_to_texture")===!1){let xt=!1;for(let Ke=0,Mt=F.length;Ke<Mt;Ke++){let Vt=F[Ke],{object:At,geometry:It,material:Ot,group:tt}=Vt;if(Ot.side===Di&&At.layers.test(q.layers)){let ui=Ot.side;Ot.side=gi,Ot.needsUpdate=!0,G(At,J,q,It,Ot,tt),Ot.side=ui,Ot.needsUpdate=!0,xt=!0}}xt===!0&&(je.updateMultisampleRenderTarget(j),je.updateRenderTargetMipmap(j))}E.setRenderTarget(Fe,De,Ze),E.setClearColor($,he),gt!==void 0&&(q.viewport=gt),E.toneMapping=nt}function N(T,F,J){let q=F.isScene===!0?F.overrideMaterial:null;for(let j=0,Ee=T.length;j<Ee;j++){let Fe=T[j],{object:De,geometry:Ze,group:nt}=Fe,gt=Fe.material;gt.allowOverride===!0&&q!==null&&(gt=q),De.layers.test(J.layers)&&G(De,F,J,Ze,gt,nt)}}function G(T,F,J,q,j,Ee){I!==null&&j.isNodeMaterial&&I.setObject(T,j),T.onBeforeRender(E,F,J,q,j,Ee),T.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),j.onBeforeRender(E,F,J,q,T,Ee),j.transparent===!0&&j.side===Di&&j.forceSinglePass===!1?(j.side=gi,j.needsUpdate=!0,E.renderBufferDirect(J,F,q,j,T,Ee),j.side=Ir,j.needsUpdate=!0,E.renderBufferDirect(J,F,q,j,T,Ee),j.side=Di):E.renderBufferDirect(J,F,q,j,T,Ee),T.onAfterRender(E,F,J,q,j,Ee)}function k(T){let F=0;for(let J of T)J.texture!==null&&F++;return F}function le(T,F,J){F.isScene!==!0&&(F=ie);let q=we.get(T),j=A.state.lights,Ee=A.state.shadowsArray,Fe=j.state.version,De=ce.getParameters(T,j.state,Ee,F,J,A.state.lightProbeGridArray),Ze=ce.getProgramCacheKey(De),nt=q.programs;q.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,q.fog=F.fog;let gt=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;q.envMap=He.get(T.envMap||q.environment,gt),q.envMapRotation=q.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,nt===void 0&&(T.addEventListener("dispose",Oe),nt=new Map,q.programs=nt,q.programVariants=new Map);let xt=nt.get(Ze);if(xt!==void 0){if(q.currentProgram===xt&&q.lightsStateVersion===Fe)return Me(T,De),xt}else De.uniforms=ce.getUniforms(T),I!==null&&T.isNodeMaterial&&I.build(T,J,De),T.onBeforeCompile(De,E),xt=ce.acquireProgram(De,Ze),nt.set(Ze,xt),q.uniforms=De.uniforms;let Ke=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ke.clippingPlanes=H.uniform),Me(T,De),q.needsLights=mt(T),q.lightsStateVersion=Fe,q.needsLights&&(Ke.ambientLightColor.value=j.state.ambient,Ke.lightProbe.value=j.state.probe,Ke.sunLights.value=j.state.sun,Ke.sunLightShadows.value=j.state.sunShadow,Ke.directionalLights.value=j.state.directional,Ke.directionalLightShadows.value=j.state.directionalShadow,Ke.spotLights.value=j.state.spot,Ke.spotLightShadows.value=j.state.spotShadow,Ke.rectAreaLights.value=j.state.rectArea,Ke.ltc_1.value=j.state.rectAreaLTC1,Ke.ltc_2.value=j.state.rectAreaLTC2,Ke.pointLights.value=j.state.point,Ke.pointLightShadows.value=j.state.pointShadow,Ke.hemisphereLights.value=j.state.hemi,Ke.sunShadowMatrix.value=j.state.sunShadowMatrix,Ke.sunShadowCascade.value=j.state.sunShadowCascade,Ke.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Ke.spotLightMatrix.value=j.state.spotLightMatrix,Ke.spotLightMap.value=j.state.spotLightMap,Ke.pointShadowMatrix.value=j.state.pointShadowMatrix),q.numLightProbeGrids=k(A.state.lightProbeGridArray),q.currentProgram=xt,q.uniformsList=null,xt}function Je(T,F,J,q,j){let Ee=we.get(T),Fe=Ee.currentProgram.id+","+q+","+j,De=Ee.programVariants.get(Fe);return De===void 0?(De=le(T,F,J),Ee.programVariants.set(Fe,De)):(Ee.currentProgram=De,Ee.uniformsList=null,Ee.outputColorSpace=q,Ee.toneMapping=j),De}function ye(T){if(T.uniformsList===null){let F=T.currentProgram.getUniforms();T.uniformsList=lo.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function Me(T,F){let J=we.get(T);J.outputColorSpace=F.outputColorSpace,J.batching=F.batching,J.batchingColor=F.batchingColor,J.instancing=F.instancing,J.instancingColor=F.instancingColor,J.instancingMorph=F.instancingMorph,J.skinning=F.skinning,J.morphTargets=F.morphTargets,J.morphNormals=F.morphNormals,J.morphColors=F.morphColors,J.morphTargetsCount=F.morphTargetsCount,J.numClippingPlanes=F.numClippingPlanes,J.numIntersection=F.numClipIntersection,J.vertexAlphas=F.vertexAlphas,J.vertexTangents=F.vertexTangents,J.toneMapping=F.toneMapping}function at(T,F,J,q,j){F.isScene!==!0&&(F=ie),je.resetTextureUnits();let Ee=F.fog,Fe=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?F.environment:null,De=V===null?E.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:yt.workingColorSpace,Ze=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,nt=He.get(q.envMap||Fe,Ze),gt=q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,xt=!!J.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ke=!!J.morphAttributes.position,Mt=!!J.morphAttributes.normal,Vt=!!J.morphAttributes.color,At=rr;q.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(At=E.toneMapping);let It=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Ot=It!==void 0?It.length:0,tt=we.get(q),ui=A.state.lights;if(me===!0&&(ze===!0||T!==z)){let Lt=T===z&&q.id===pe;H.setState(q,T,Lt)}let kr=!1,Gr=!1;q.version===tt.__version?tt.needsLights&&tt.lightsStateVersion!==ui.state.version||j.isBatchedMesh&&tt.batching===!1||!j.isBatchedMesh&&tt.batching===!0||j.isBatchedMesh&&tt.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&tt.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&tt.instancing===!1||!j.isInstancedMesh&&tt.instancing===!0||j.isSkinnedMesh&&tt.skinning===!1||!j.isSkinnedMesh&&tt.skinning===!0||j.isInstancedMesh&&tt.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&tt.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&tt.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&tt.instancingMorph===!1&&j.morphTexture!==null||tt.envMap!==nt||q.fog===!0&&tt.fog!==Ee||tt.numClippingPlanes!==void 0&&(tt.numClippingPlanes!==H.numPlanes||tt.numIntersection!==H.numIntersection)||tt.vertexAlphas!==gt||tt.vertexTangents!==xt||tt.morphTargets!==Ke||tt.morphNormals!==Mt||tt.morphColors!==Vt||tt.morphTargetsCount!==Ot||tt.numLightProbeGrids!==k(A.state.lightProbeGridArray)?kr=!0:(tt.outputColorSpace!==De||tt.toneMapping!==At)&&(Gr=!0):(kr=!0,tt.__version=q.version);let ni=tt.currentProgram;(kr===!0||Gr===!0)&&(ni=Gr===!0?Je(q,F,j,De,At):le(q,F,j),I&&q.isNodeMaterial&&I.onUpdateProgram(q,ni,tt));let us=!1,br=!1,Vr=!1,St=ni.getUniforms(),ei=tt.uniforms;if(re.useProgram(ni.program)&&(us=!0,br=!0,Vr=!0),q.id!==pe&&(pe=q.id,br=!0),us||z!==T){re.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),St.setValue(U,"projectionMatrix",T.projectionMatrix),St.setValue(U,"viewMatrix",T.matrixWorldInverse);let Lt=St.map.cameraPosition;Lt!==void 0&&Lt.setValue(U,te.setFromMatrixPosition(T.matrixWorld)),Xe.logarithmicDepthBuffer&&St.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&St.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),z!==T&&(z=T,br=!0,Vr=!0)}if(tt.needsLights&&(ui.state.sunShadowMap.length>0&&St.setValue(U,"sunShadowMap",ui.state.sunShadowMap,je),ui.state.directionalShadowMap.length>0&&St.setValue(U,"directionalShadowMap",ui.state.directionalShadowMap,je),ui.state.spotShadowMap.length>0&&St.setValue(U,"spotShadowMap",ui.state.spotShadowMap,je),ui.state.pointShadowMap.length>0&&St.setValue(U,"pointShadowMap",ui.state.pointShadowMap,je)),j.isSkinnedMesh){St.setOptional(U,j,"bindMatrix"),St.setOptional(U,j,"bindMatrixInverse");let Lt=j.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),St.setValue(U,"boneTexture",Lt.boneTexture,je))}j.isBatchedMesh&&(St.setOptional(U,j,"batchingTexture"),St.setValue(U,"batchingTexture",j._matricesTexture,je),St.setOptional(U,j,"batchingIdTexture"),St.setValue(U,"batchingIdTexture",j._indirectTexture,je),St.setOptional(U,j,"batchingColorTexture"),j._colorsTexture!==null&&St.setValue(U,"batchingColorTexture",j._colorsTexture,je));let Hi=J.morphAttributes;if((Hi.position!==void 0||Hi.normal!==void 0||Hi.color!==void 0)&&O.update(j,J,ni),(br||tt.receiveShadow!==j.receiveShadow)&&(tt.receiveShadow=j.receiveShadow,St.setValue(U,"receiveShadow",j.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&F.environment!==null&&(ei.envMapIntensity.value=F.environmentIntensity),ei.dfgLUT!==void 0&&(ei.dfgLUT.value=_M()),br){if(St.setValue(U,"toneMappingExposure",E.toneMappingExposure),tt.needsLights&&ot(ei,Vr),Ee&&q.fog===!0&&ee.refreshFogUniforms(ei,Ee),ee.refreshMaterialUniforms(ei,q,Ve,Ye,A.state.transmissionRenderTarget[T.id]),tt.needsLights&&tt.numLightProbeGrids>0){let Lt=S,di=0;for(let nr of A.state.lightProbeGridArray)nr.texture!==null&&(Lt.textures[di]=nr.texture,Lt.min[di]=nr.boundingBox.min,Lt.max[di]=nr.boundingBox.max,Lt.resolution[di]=nr.resolution,di++);for(let nr in Lt)Lt[nr].length=di;ei.probesSH.value=Lt.textures,ei.probesMin.value=Lt.min,ei.probesMax.value=Lt.max,ei.probesResolution.value=Lt.resolution}lo.upload(U,ye(tt),ei,je)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(lo.upload(U,ye(tt),ei,je),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&St.setValue(U,"center",j.center),St.setValue(U,"modelViewMatrix",j.modelViewMatrix),St.setValue(U,"normalMatrix",j.normalMatrix),St.setValue(U,"modelMatrix",j.matrixWorld),q.uniformsGroups!==void 0){let Lt=q.uniformsGroups;for(let di=0,nr=Lt.length;di<nr;di++){let Rc=Lt[di];Ce.update(Rc,ni),Ce.bind(Rc,ni)}}return ni}function ot(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.sunLights.needsUpdate=F,T.sunLightShadows.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function mt(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return Z},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(T,F,J){let q=we.get(T);q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),we.get(T.texture).__webglTexture=F,we.get(T.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:J,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){let J=we.get(T);J.__webglFramebuffer=F,J.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,J=0){V=T,B=F,Z=J;let q=null,j=!1,Ee=!1;if(T){let Fe=we.get(T);if(Fe.__useDefaultFramebuffer!==void 0){re.bindFramebuffer(U.FRAMEBUFFER,Fe.__webglFramebuffer),W.copy(T.viewport),Q.copy(T.scissor),ve=T.scissorTest,re.viewport(W),re.scissor(Q),re.setScissorTest(ve),pe=-1;return}else if(Fe.__webglFramebuffer===void 0)je.setupRenderTarget(T);else if(Fe.__hasExternalTextures)je.rebindTextures(T,we.get(T.texture).__webglTexture,we.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let nt=T.depthTexture;if(Fe.__boundDepthTexture!==nt){if(nt!==null&&we.has(nt)&&(T.width!==nt.image.width||T.height!==nt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");je.setupDepthRenderbuffer(T)}}let De=T.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(Ee=!0);let Ze=we.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ze[F])?q=Ze[F][J]:q=Ze[F],j=!0):T.samples>0&&je.useMultisampledRTT(T)===!1?q=we.get(T).__webglMultisampledFramebuffer:Array.isArray(Ze)?q=Ze[J]:q=Ze,W.copy(T.viewport),Q.copy(T.scissor),ve=T.scissorTest}else W.copy(pt).multiplyScalar(Ve).floor(),Q.copy(Ue).multiplyScalar(Ve).floor(),ve=vt;if(J!==0&&(q=L),re.bindFramebuffer(U.FRAMEBUFFER,q)&&re.drawBuffers(T,q),re.viewport(W),re.scissor(Q),re.setScissorTest(ve),j){let Fe=we.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,Fe.__webglTexture,J)}else if(Ee){let Fe=F;for(let De=0;De<T.textures.length;De++){let Ze=we.get(T.textures[De]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+De,Ze.__webglTexture,J,Fe)}}else if(T!==null&&J!==0){let Fe=we.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Fe.__webglTexture,J)}pe=-1};function wt(T){let F=we.get(T);return(F.__readFormat!==T.format||F.__readType!==T.type)&&(F.__readFormat=T.format,F.__readType=T.type,F.__formatReadable=Xe.textureFormatReadable(T.format),F.__typeReadable=Xe.textureTypeReadable(T.type)),F}this.readRenderTargetPixels=function(T,F,J,q,j,Ee,Fe,De=0){if(!(T&&T.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ze=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ze=Ze[Fe],Array.isArray(Ze)&&(Ze=Ze[0])),Ze){re.bindFramebuffer(U.FRAMEBUFFER,Ze);try{let nt=T.textures[De],gt=nt.format,xt=nt.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+De);let Ke=wt(nt);if(Ke.__formatReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ke.__typeReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-q&&J>=0&&J<=T.height-j&&U.readPixels(F,J,q,j,Se.convert(gt),Se.convert(xt),Ee)}finally{let nt=V!==null?we.get(V).__webglFramebuffer:null;re.bindFramebuffer(U.FRAMEBUFFER,nt)}}},this.readRenderTargetPixelsAsync=async function(T,F,J,q,j,Ee,Fe,De=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ze=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ze=Ze[Fe],Array.isArray(Ze)&&(Ze=Ze[0])),Ze)if(F>=0&&F<=T.width-q&&J>=0&&J<=T.height-j){re.bindFramebuffer(U.FRAMEBUFFER,Ze);let nt=T.textures[De],gt=nt.format,xt=nt.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+De);let Ke=wt(nt);if(Ke.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ke.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Mt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Mt),U.bufferData(U.PIXEL_PACK_BUFFER,Ee.byteLength,U.STREAM_READ),U.readPixels(F,J,q,j,Se.convert(gt),Se.convert(xt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Vt=V!==null?we.get(V).__webglFramebuffer:null;re.bindFramebuffer(U.FRAMEBUFFER,Vt);let At=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Eg(U,At,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Mt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Ee),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(Mt),U.deleteSync(At),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,J=0){let q=Math.pow(2,-J),j=Math.floor(T.image.width*q),Ee=Math.floor(T.image.height*q),Fe=F!==null?F.x:0,De=F!==null?F.y:0;je.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,J,0,0,Fe,De,j,Ee),re.unbindTexture()},this.copyTextureToTexture=function(T,F,J=null,q=null,j=0,Ee=0){let Fe,De,Ze,nt,gt,xt,Ke,Mt,Vt,At=T.isCompressedTexture?T.mipmaps[Ee]:T.image;if(J!==null)Fe=J.max.x-J.min.x,De=J.max.y-J.min.y,Ze=J.isBox3?J.max.z-J.min.z:1,nt=J.min.x,gt=J.min.y,xt=J.isBox3?J.min.z:0;else{let St=Math.pow(2,-j);Fe=Math.floor(At.width*St),De=Math.floor(At.height*St),T.isDataArrayTexture?Ze=At.depth:T.isData3DTexture?Ze=Math.floor(At.depth*St):Ze=1,nt=0,gt=0,xt=0}q!==null?(Ke=q.x,Mt=q.y,Vt=q.z):(Ke=0,Mt=0,Vt=0);let It=Se.convert(F.format),Ot=Se.convert(F.type),tt;F.isData3DTexture?(je.setTexture3D(F,0),tt=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(je.setTexture2DArray(F,0),tt=U.TEXTURE_2D_ARRAY):(je.setTexture2D(F,0),tt=U.TEXTURE_2D),re.activeTexture(U.TEXTURE0),re.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),re.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),re.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);let ui=re.getParameter(U.UNPACK_ROW_LENGTH),kr=re.getParameter(U.UNPACK_IMAGE_HEIGHT),Gr=re.getParameter(U.UNPACK_SKIP_PIXELS),ni=re.getParameter(U.UNPACK_SKIP_ROWS),us=re.getParameter(U.UNPACK_SKIP_IMAGES);re.pixelStorei(U.UNPACK_ROW_LENGTH,At.width),re.pixelStorei(U.UNPACK_IMAGE_HEIGHT,At.height),re.pixelStorei(U.UNPACK_SKIP_PIXELS,nt),re.pixelStorei(U.UNPACK_SKIP_ROWS,gt),re.pixelStorei(U.UNPACK_SKIP_IMAGES,xt);let br=T.isDataArrayTexture||T.isData3DTexture,Vr=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){let St=we.get(T),ei=we.get(F),Hi=we.get(St.__renderTarget),Lt=we.get(ei.__renderTarget);re.bindFramebuffer(U.READ_FRAMEBUFFER,Hi.__webglFramebuffer),re.bindFramebuffer(U.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let di=0;di<Ze;di++)br&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,we.get(T).__webglTexture,j,xt+di),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,we.get(F).__webglTexture,Ee,Vt+di)),U.blitFramebuffer(nt,gt,nt+Fe,gt+De,Ke,Mt,Ke+Fe,Mt+De,U.DEPTH_BUFFER_BIT,U.NEAREST);re.bindFramebuffer(U.READ_FRAMEBUFFER,null),re.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(j!==0||T.isRenderTargetTexture||we.has(T)){let St=we.get(T),ei=we.get(F);re.bindFramebuffer(U.READ_FRAMEBUFFER,Y),re.bindFramebuffer(U.DRAW_FRAMEBUFFER,D);for(let Hi=0;Hi<Ze;Hi++)br?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,St.__webglTexture,j,xt+Hi):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,St.__webglTexture,j),Vr?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ei.__webglTexture,Ee,Vt+Hi):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ei.__webglTexture,Ee),j!==0?U.blitFramebuffer(nt,gt,nt+Fe,gt+De,Ke,Mt,Ke+Fe,Mt+De,U.COLOR_BUFFER_BIT,U.NEAREST):Vr?U.copyTexSubImage3D(tt,Ee,Ke,Mt,Vt+Hi,nt,gt,Fe,De):U.copyTexSubImage2D(tt,Ee,Ke,Mt,nt,gt,Fe,De);re.bindFramebuffer(U.READ_FRAMEBUFFER,null),re.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Vr?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(tt,Ee,Ke,Mt,Vt,Fe,De,Ze,It,Ot,At.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(tt,Ee,Ke,Mt,Vt,Fe,De,Ze,It,At.data):U.texSubImage3D(tt,Ee,Ke,Mt,Vt,Fe,De,Ze,It,Ot,At):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Ee,Ke,Mt,Fe,De,It,Ot,At.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Ee,Ke,Mt,At.width,At.height,It,At.data):U.texSubImage2D(U.TEXTURE_2D,Ee,Ke,Mt,Fe,De,It,Ot,At);re.pixelStorei(U.UNPACK_ROW_LENGTH,ui),re.pixelStorei(U.UNPACK_IMAGE_HEIGHT,kr),re.pixelStorei(U.UNPACK_SKIP_PIXELS,Gr),re.pixelStorei(U.UNPACK_SKIP_ROWS,ni),re.pixelStorei(U.UNPACK_SKIP_IMAGES,us),Ee===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&U.generateMipmap(tt),re.unbindTexture()},this.initRenderTarget=function(T){we.get(T).__webglFramebuffer===void 0&&je.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?je.setTextureCube(T,0):T.isData3DTexture?je.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?je.setTexture2DArray(T,0):je.setTexture2D(T,0),re.unbindTexture()},this.resetState=function(){B=0,Z=0,V=null,re.reset(),Te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=yt._getDrawingBufferColorSpace(e),t.unpackColorSpace=yt._getUnpackColorSpace()}};function rm(){let t=new URLSearchParams(location.search).get("tier"),r=(navigator.maxTouchPoints||0)>1||/iPhone|iPad|Android/i.test(navigator.userAgent),a=t==="high"||t==="mobile"||t==="low"?t:r?"mobile":"high";return{tier:a,mobile:r,forced:!!t,settings:yM(a,r)}}function yM(e,t){let i=window.devicePixelRatio||1;return e==="low"?{tier:e,pixelRatio:t?.75:Math.min(i,1),maxPixels:2e6,particleScale:.5}:e==="mobile"?{tier:e,pixelRatio:1,maxPixels:32e5,particleScale:1}:{tier:e,pixelRatio:Math.min(i,2),maxPixels:42e5,particleScale:1}}var am={ice:"shaved_ice-1024.jpg",enamel:"machine_enamel-512.jpg",wood:"wood_counter-512.jpg",shop:"kakigori_shop-512.jpg"};function xM(e){let t=am[e],i=window.KAKI_TEX&&window.KAKI_TEX[t];return location.protocol==="file:"&&i?i:"assets/"+t}function nm(e,t){let i=new xc,r=Math.min(4,e.capabilities.getMaxAnisotropy()),a={},n=Object.keys(am).map(s=>new Promise(o=>{let l=i.load(xM(s),()=>o(l),void 0,h=>{t&&t("texture "+s),o(l)});l.colorSpace=Xt,l.wrapS=l.wrapT=Lr,l.anisotropy=s==="shop"?1:r,l.name=s,a[s]=l}));return{textures:a,ready:Promise.all(n)}}function Tl(e,t,i){let r=document.createElement("canvas");r.width=e,r.height=t,i(r.getContext("2d"),e,t);let a=new rc(r);return a.colorSpace=Xt,a}function sm(){let e=Tl(64,64,(a,n)=>{let s=a.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);s.addColorStop(0,"rgba(60,40,20,0.55)"),s.addColorStop(.55,"rgba(60,40,20,0.25)"),s.addColorStop(1,"rgba(60,40,20,0)"),a.fillStyle=s,a.fillRect(0,0,n,n)}),t=Tl(64,64,(a,n)=>{let s=a.createRadialGradient(n/2,n/2,n*.18,n/2,n/2,n/2);s.addColorStop(0,"rgba(255,255,255,0)"),s.addColorStop(.55,"rgba(255,250,200,0.9)"),s.addColorStop(1,"rgba(255,240,160,0)"),a.fillStyle=s,a.fillRect(0,0,n,n)}),i=Tl(64,64,(a,n)=>{a.fillStyle="#ff5c8a",a.beginPath(),a.moveTo(32,54),a.bezierCurveTo(4,36,6,10,22,10),a.bezierCurveTo(28,10,32,16,32,20),a.bezierCurveTo(32,16,36,10,42,10),a.bezierCurveTo(58,10,60,36,32,54),a.fill(),a.fillStyle="rgba(255,255,255,0.7)",a.beginPath(),a.ellipse(22,22,5,3.5,-.6,0,Math.PI*2),a.fill()}),r=Tl(256,64,(a,n,s)=>{a.fillStyle="#2f6fb3",a.fillRect(0,0,n,s),a.strokeStyle="rgba(255,255,255,0.85)",a.lineWidth=3;for(let o=10;o<s+10;o+=14){a.beginPath();for(let l=0;l<=n;l+=4)a.lineTo(l,o+Math.sin(l/10)*4);a.stroke()}a.fillStyle="rgba(0,0,0,0.25)";for(let o=0;o<n;o+=64)a.fillRect(o,0,2,s)});for(let a of[e,t,i])a.wrapS=a.wrapT=Kt;return r.wrapS=Lr,{blob:e,glow:t,heart:i,noren:r}}var om=new lt,lm=new Bt,hm=new Yi,SM=new R,MM=new R;function ai(e){let t=[],i=[],r=[],a=new ke;for(let s of e){let o=s.geo.index?s.geo.toNonIndexed():s.geo,l=s.scale==null?[1,1,1]:typeof s.scale=="number"?[s.scale,s.scale,s.scale]:s.scale;hm.set(...s.rot||[0,0,0]),lm.setFromEuler(hm),om.compose(MM.set(...s.pos||[0,0,0]),lm,SM.set(...l)),o.applyMatrix4(om),a.set(s.color);let h=o.attributes.position.array,c=o.attributes.normal.array;for(let u=0;u<h.length;u++)t.push(h[u]),i.push(c[u]);for(let u=0;u<h.length/3;u++)r.push(a.r,a.g,a.b);o!==s.geo&&o.dispose(),s.geo.dispose()}let n=new dt;return n.setAttribute("position",new qe(t,3)),n.setAttribute("normal",new qe(i,3)),n.setAttribute("color",new qe(r,3)),n.computeBoundingSphere(),n}var Ii=(e,t,i)=>e<t?t:e>i?i:e;var an=e=>e<=0?0:e>=1?1:e*e*(3-2*e),Tc=e=>{e=Ii(e,0,1);let t=1.70158;return 1+(t+1)*(e-1)**3+t*(e-1)**2},zr=e=>e<=0||e>=1?0:Math.sin(Math.PI*e)*(1-.3*e),wi=(e,t)=>1-Math.exp(-e*t);function cm(e){let t=0;return e.traverseVisible(i=>{if(!i.isMesh||!i.geometry)return;let r=i.geometry,n=(r.index?r.index.count:r.attributes.position?r.attributes.position.count:0)/3;r.drawRange&&r.drawRange.count!==1/0&&(n=Math.min(n,r.drawRange.count/3)),t+=n*(i.isInstancedMesh?i.count:1)}),Math.round(t)}function um(e){e.traverse(t=>{if(t.userData&&t.userData.shared)return;t.geometry&&!t.geometry.userData.shared&&t.geometry.dispose();let i=Array.isArray(t.material)?t.material:t.material?[t.material]:[];for(let r of i)r.userData.shared||r.dispose()})}var Ge={spout:new R(0,.4,-.02),bowlHome:new R(0,0,0),bowlEnter:new R(-.95,0,.06),work:{x0:-.12,x1:.1,z0:-.12,z1:.11},column:new R(.24,0,-.28),give:new R(-.38,0,-.215),giveRadius:.13,customerFront:new R(-.38,.03,-.5),queue:[new R(-.7,.03,-.72),new R(-1,.03,-.9)],exit:new R(-1.5,.03,-.48),bottleStart:new R(.255,0,-.06),bottleDir:new R(1,0,0),bottleGap:.058,tray:new R(-.33,0,.12),shelfX:.5,shelfZ:-.7,shelfScale:.5,shelfSlots:[[.38,.2475,-.7],[.5,.2475,-.7],[.62,.2475,-.7],[.38,.0075,-.7],[.5,.0075,-.7],[.62,.0075,-.7]].map(e=>new R(...e)),counter:{x0:-.9,x1:.9,z0:-.35,z1:.35}},Ac=[{id:"red",color:[.93,.13,.22],hex:15212602,kind:"syrup"},{id:"green",color:[.3,.8,.25],hex:5098560,kind:"syrup"},{id:"blue",color:[.15,.52,.96],hex:2524661,kind:"syrup"},{id:"yellow",color:[1,.84,.1],hex:16766490,kind:"syrup"},{id:"milk",color:[.99,.97,.9],hex:16775398,kind:"milk"}];function dm(e,t,i){let r={pick:[],disposables:[]},a=_e=>(r.disposables.push(_e),_e),n=new _l(16774376,1322e4,1.35),s=new Ml(16777215,1.7);s.position.set(.5,1.2,.7),e.add(n,s),e.background=new ke(15984338);let o=a(new vi({map:t.shop,color:15921906}));o.map=t.shop.clone(),a(o.map),o.map.wrapS=o.map.wrapT=Kt,o.map.needsUpdate=!0;let l=new it(a(new Fi(3.6,3.6)),o);l.position.set(.05,.55,-1.7),e.add(l);let h=t.wood.clone();a(h),h.repeat.set(3,2),h.needsUpdate=!0;let c=new it(a(new Fi(3.6,1.6)),a(new fa({map:h,color:12098170})));c.rotation.x=-Math.PI/2,c.position.set(0,-.42,-1),e.add(c);let u=t.wood.clone();a(u),u.repeat.set(2.2,1),u.needsUpdate=!0;let p=a(new ri({map:u,roughness:.75})),d=new it(a(new Qt(1.9,.04,.74)),p);d.position.set(0,-.02,0),e.add(d);let g=t.wood.clone();a(g),g.repeat.set(3.2,1.3),g.needsUpdate=!0;let y=new it(a(new Fi(2.8,1.4)),a(new fa({map:g,color:15918806})));y.rotation.x=-Math.PI/2,y.position.set(0,-5e-4,.98),e.add(y);let v=new it(a(new Qt(1.9,.5,.03)),a(new fa({color:10119748})));v.position.set(0,-.29,-.355),e.add(v);let m=new it(a(new Fi(2.4,.22,1,1)),a(new fa({map:i.noren,side:Di})));i.noren.repeat.set(4,1),m.position.set(0,.86,-.95),e.add(m);let f=t.enamel.clone();a(f),f.repeat.set(1,1),f.needsUpdate=!0;let S=a(new ri({map:f,color:16777215,roughness:.38,vertexColors:!0})),x=a(new ri({color:14212579,roughness:.3,metalness:.35,vertexColors:!0})),A=new $t;A.name="machine",e.add(A);let b=Ge.spout,_=Ge.column,M=b.x-_.x,E=b.z-_.z,P=Math.hypot(M,E),I=ai([{geo:new kt(.07,.08,.035,28),color:16777215,pos:[_.x,.0175,_.z]},{geo:new kt(.026,.032,.52,18),color:16777215,pos:[_.x,.29,_.z]},{geo:new yi(.036,16,10),color:16777215,pos:[_.x,.55,_.z]},{geo:new Qt(.05,.04,P),color:16777215,pos:[_.x+M/2,.545,_.z+E/2],rot:[0,Math.atan2(M,E),0]},{geo:new kt(.09,.08,.075,32),color:16777215,pos:[b.x,b.y+.075,b.z]},{geo:new kt(.095,.095,.012,32),color:16777215,pos:[b.x,b.y+.116,b.z]}]);A.add(new it(a(I),S));let L=ai([{geo:new kt(.06,.016,.04,24,1,!0),color:16777215,pos:[b.x,b.y+.02,b.z]},{geo:new kt(.008,.008,.12,10),color:16777215,pos:[b.x,b.y+.215,b.z]},{geo:new kt(.05,.05,.01,24),color:16777215,pos:[b.x,b.y+.21,b.z]},{geo:new yi(.016,12,8),color:15218767,pos:[b.x,b.y+.285,b.z]},{geo:new Qt(.07,.018,.02),color:16777215,pos:[b.x-.115,b.y+.075,b.z-.03]}]);A.add(new it(a(L),x));let Y=a(new ri({map:t.ice,color:14676991,roughness:.25,emissive:10473710,emissiveIntensity:.25})),D=new it(a(new Qt(.1,.07,.1)),Y);D.position.set(b.x,b.y+.155,b.z),A.add(D);let B=new $t;B.name="wheel",B.position.set(b.x-.155,b.y+.075,b.z-.03);let Z=[];for(let _e=0;_e<5;_e++){let Xe=_e/5*Math.PI*2;Z.push({geo:new kt(.006,.006,.07,6),color:16777215,pos:[Math.cos(Xe)*.035,Math.sin(Xe)*.035,0],rot:[0,0,Xe-Math.PI/2]})}let V=ai([{geo:new Fr(.072,.009,8,40),color:16777215},{geo:new kt(.016,.016,.03,16),color:16777215,rot:[Math.PI/2,0,0]},...Z]);B.add(new it(a(V),S));let pe=new it(a(ai([{geo:new kt(.006,.006,.03,8),color:14212579,rot:[Math.PI/2,0,0],pos:[0,0,.015]},{geo:new yi(.016,14,10),color:15218767,pos:[0,0,.035],scale:[1,1,1.25]}])),x);pe.position.set(-.072,0,0),B.add(pe),A.add(B);let z=new it(a(new yi(.11,8,6)),a(new vi({visible:!1})));z.userData.kind="wheel",B.add(z),r.pick.push(z);let W=new it(a(new Qt(.2,.16,.2)),z.material);W.position.set(b.x,b.y+.12,b.z),W.userData.kind="wheel",A.add(W),r.pick.push(W),r.machine=A,r.wheel=B,r.iceBlock=D,r.enamelMat=S;let Q=[[0,-.14],[.021,-.14],[.026,-.132],[.026,-.06],[.022,-.042],[.009,-.03],[.009,-.014],[.005,-.004],[.003,0]].map(([_e,Xe])=>new se(_e,Xe)),ve=a(new rs(Q,20)),$=a(new kt(.0095,.0095,.012,14));$.translate(0,-.02,0);let he=a(new ri({color:16777215,roughness:.4})),Pe=a(new kt(.03,.02,.12,18));Pe.translate(0,-.075,0),Pe.scale(1.15,1,.65),r.bottles=Ac.map((_e,Xe)=>{let re=new $t;re.name="bottle-"+_e.id;let et=a(new ri({color:_e.hex,roughness:.18,emissive:_e.hex,emissiveIntensity:.12}));if(_e.kind==="milk"){re.add(new it(Pe,et));let He=a(new kt(.012,.014,.016,14));He.translate(0,-.012,0),re.add(new it(He,a(new ri({color:3832800,roughness:.4}))))}else re.add(new it(ve,et)),re.add(new it($,he));let we=new it(a(new kt(.04,.04,.19,8)),z.material);we.position.y=-.08,we.userData.kind="bottle",we.userData.index=Xe,re.add(we),r.pick.push(we);let je=Ge.bottleStart.clone().addScaledVector(Ge.bottleDir,Ge.bottleGap*Xe);return je.y=.155,re.position.copy(je),e.add(re),{syrup:_e,group:re,mat:et,home:je,state:"home",t:0,tilt:0,rate:0,target:new R,pointer:null,hopT:9}});let Ye=a(new ri({map:u,color:14267276,roughness:.7})),Ve=new Or(a(new kt(.036,.039,.015,24)),Ye,Ac.length);Ve.frustumCulled=!1,Ve.count=Ac.length,e.add(Ve),r.coasters=Ve;let fe=a(new ri({vertexColors:!0,roughness:.35}));fe.userData.shared=!0;let rt={cherry:ai([{geo:new yi(.012,14,10),color:14159916,pos:[0,.011,0]},{geo:new kt(.0013,.0013,.028,5),color:6060580,pos:[.004,.032,0],rot:[0,0,-.35]}]),shiratama:ai([{geo:new yi(.0115,14,10),color:16776696,pos:[0,.009,0],scale:[1,.78,1]}]),mikan:ai([{geo:new yi(.0125,14,10),color:16753183,pos:[0,.008,0],scale:[1,.72,1]},{geo:new kt(.003,.003,.003,6),color:6986282,pos:[0,.0172,0]}])};for(let _e in rt)rt[_e].userData.shared=!0,a(rt[_e]);r.toppingGeos=rt,r.toppingMat=fe,r.toppingKinds=["cherry","shiratama","mikan"];let pt=[[0,0],[.07,0],[.085,.012],[.088,.016],[.08,.012],[0,.006]].map(([_e,Xe])=>new se(_e,Xe)),Ue=new it(a(new rs(pt,32)),a(new ri({color:16774112,roughness:.4})));Ue.position.copy(Ge.tray),e.add(Ue),r.dish=Ue,r.piles=r.toppingKinds.map((_e,Xe)=>{let re=-Math.PI/2+Xe/3*Math.PI*2+.4,et=new R(Math.cos(re)*.042,.008,Math.sin(re)*.042),we=new $t;we.position.copy(Ge.tray).add(et),e.add(we);for(let He=0;He<3;He++){let C=new it(rt[_e],fe),w=He/3*Math.PI*2;C.position.set(Math.cos(w)*.012,He===2?.006:0,Math.sin(w)*.012),C.rotation.y=w,we.add(C)}let je=new it(a(new yi(.04,8,6)),z.material);return je.userData.kind="pile",je.userData.index=Xe,we.add(je),r.pick.push(je),{kind:_e,group:we,off:et,hopT:9}});let vt=a(new ri({map:u,color:15784120,roughness:.8,vertexColors:!0})),ue=Ge.shelfX,xe=Ge.shelfZ,me=.385,ze=ai([{geo:new Qt(me,.015,.15),color:16777215,pos:[ue,0,xe]},{geo:new Qt(me,.015,.15),color:16777215,pos:[ue,.24,xe]},{geo:new Qt(me,.015,.15),color:16777215,pos:[ue,.48,xe]},{geo:new Qt(.015,.9,.15),color:16777215,pos:[ue-me/2,0,xe]},{geo:new Qt(.015,.9,.15),color:16777215,pos:[ue+me/2,0,xe]},{geo:new Qt(me,.9,.01),color:14205088,pos:[ue,0,xe-.075]}]),ae=new it(a(ze),vt);e.add(ae);let te=a(new vi({map:i.blob,transparent:!0,depthWrite:!1})),oe=a(new Fi(1,1));oe.rotateX(-Math.PI/2);let ie=new Or(oe,te,24);ie.count=0,ie.frustumCulled=!1,ie.renderOrder=1,e.add(ie),r.blobs=ie;let be=a(new vi({map:i.glow,transparent:!0,depthWrite:!1,blending:Nn,opacity:0})),We=a(new Fi(1,1));We.rotateX(-Math.PI/2),r.glow=new it(We,be),r.glow.renderOrder=2,r.glow.position.y=.003,e.add(r.glow),r.giveGlow=new it(We,a(be.clone())),r.giveGlow.renderOrder=2,r.giveGlow.visible=!1,r.giveGlow.position.set(Ge.give.x,.003,Ge.give.z),e.add(r.giveGlow);let U=a(new vi({map:i.heart,transparent:!0,depthWrite:!1})),Ie=new Or(a(new Fi(.05,.05)),U,16);return Ie.count=0,Ie.frustumCulled=!1,Ie.renderOrder=3,e.add(Ie),r.hearts=Ie,r}function pm(){let e=null,t=null,i=null,r=null,a={},n=!1;function s(d,g){let y=Math.floor(e.sampleRate*d),v=e.createBuffer(1,y,e.sampleRate),m=v.getChannelData(0);return g(m,e.sampleRate),v}function o(){if(e){e.state==="suspended"&&e.resume();return}let d=window.AudioContext||window.webkitAudioContext;if(!d)return;e=new d;let g=e.createDynamicsCompressor();g.threshold.value=-18,g.ratio.value=4,t=e.createGain(),t.gain.value=.7,t.connect(g),g.connect(e.destination),i=s(1.5,y=>{for(let v=0;v<y.length;v++)y[v]=Math.random()*2-1}),r=s(2,(y,v)=>{for(let f=0;f<y.length;f++)y[f]=0;let m=2*900;for(let f=0;f<m;f++){let S=Math.floor(Math.random()*(y.length-400)),x=.2+Math.random()*.8,A=30+Math.random()*120;for(let b=0;b<300;b++)y[S+b]+=(Math.random()*2-1)*x*Math.exp(-b/A)}}),a.shari=l(r,"bandpass",5200,.9),a.slide=l(i,"lowpass",2400,.7),a.flow=l(i,"lowpass",520,2.5,!0),n=!0}function l(d,g,y,v,m){let f=e.createBufferSource();f.buffer=d,f.loop=!0;let S=e.createBiquadFilter();S.type=g,S.frequency.value=y,S.Q.value=v;let x=e.createGain();if(x.gain.value=0,f.connect(S),S.connect(x),x.connect(t),f.start(),m){let A=e.createOscillator();A.frequency.value=3.2;let b=e.createGain();b.gain.value=260,A.connect(b),b.connect(S.frequency),A.start()}return{g:x,f:S}}function h(d,g,y){if(!n)return;let v=e.currentTime;a.shari.g.gain.setTargetAtTime(Math.min(1,d)*.32,v,.06),a.slide.g.gain.setTargetAtTime(Math.min(1,g)*.16,v,.08),a.flow.g.gain.setTargetAtTime(Math.min(1,y)*.3,v,.1)}function c(d,g,{type:y="sine",vol:v=.3,slide:m=0,at:f=0,attack:S=.005}={}){if(!n)return;let x=e.currentTime+f,A=e.createOscillator();A.type=y,A.frequency.setValueAtTime(d,x),m&&A.frequency.exponentialRampToValueAtTime(Math.max(30,d*m),x+g);let b=e.createGain();b.gain.setValueAtTime(1e-4,x),b.gain.exponentialRampToValueAtTime(v,x+S),b.gain.exponentialRampToValueAtTime(1e-4,x+g),A.connect(b),b.connect(t),A.start(x),A.stop(x+g+.05)}function u(d,g,{q:y=1,vol:v=.3,at:m=0,type:f="bandpass"}={}){if(!n)return;let S=e.currentTime+m,x=e.createBufferSource();x.buffer=i;let A=e.createBiquadFilter();A.type=f,A.frequency.value=g,A.Q.value=y;let b=e.createGain();b.gain.setValueAtTime(v,S),b.gain.exponentialRampToValueAtTime(1e-4,S+d),x.connect(A),A.connect(b),b.connect(t),x.start(S,Math.random()),x.stop(S+d+.02)}return{init:o,setLevels:h,sfx:{pop:(d=1)=>c(520*d,.12,{type:"triangle",vol:.25,slide:1.8}),boing:(d=1)=>{c(300*d,.25,{type:"sine",vol:.22,slide:2.2})},click:()=>u(.03,3200,{q:2,vol:.18}),plop:(d=1)=>c(420*d,.16,{type:"sine",vol:.28,slide:.45}),drip:()=>c(900+Math.random()*300,.09,{type:"sine",vol:.15,slide:.6}),spill:()=>u(.35,3e3,{q:.6,vol:.12}),slide:()=>u(.4,1800,{q:.5,vol:.1,type:"lowpass"}),whoosh:()=>u(.4,900,{q:.7,vol:.12}),munch:()=>{u(.09,1400,{q:1.5,vol:.4}),u(.09,1100,{q:1.5,vol:.35,at:.16})},chime:()=>{[784,988,1175,1568].forEach((d,g)=>c(d,.5,{vol:.16,at:g*.09}))},happy:(d=600)=>{c(d,.22,{type:"triangle",vol:.26,slide:1.6}),c(d*1.5,.3,{type:"triangle",vol:.22,slide:1.3,at:.2}),c(d*2,.25,{type:"sine",vol:.1,at:.42,slide:.8})},hello:(d=600)=>c(d*1.2,.18,{type:"triangle",vol:.16,slide:1.4}),sparkle:()=>{for(let d=0;d<4;d++)c(1800+Math.random()*1600,.12,{vol:.06,at:d*.05})}},get enabled(){return n},suspend:()=>e&&e.suspend(),resume:()=>e&&e.resume()}}function fm(e){let t=[],i=d=>{t.push(String(d).slice(0,160)),t.length>20&&t.shift()};window.addEventListener("error",d=>i(d.message||d)),window.addEventListener("unhandledrejection",d=>i("promise: "+(d.reason&&d.reason.message||d.reason)));let r=[],a=d=>{r.push(String(d)),r.length>5&&r.shift()},n=new Float32Array(180),s=0,o=0,l=0,h=null,c={};e&&(h=document.createElement("div"),h.style.cssText="position:fixed;left:max(6px,env(safe-area-inset-left));top:max(6px,env(safe-area-inset-top));z-index:10;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.55);padding:5px 7px;border-radius:6px;pointer-events:none;white-space:pre;max-width:60vw;overflow:hidden",document.body.appendChild(h));function u(d,g){let y=new Map,v=new Set;g.traverse(A=>{A.geometry&&v.add(A.geometry);let b=Array.isArray(A.material)?A.material:A.material?[A.material]:[];for(let _ of b)for(let M in _){let E=_[M];if(E&&E.isTexture&&E.source){let P=E.image||{},I=P.width||0,L=P.height||0,Y=E.isDataTexture&&E.type!==1009?16:4,D=E.generateMipmaps!==!1&&E.minFilter!==1006&&E.minFilter!==1003?4/3:1;y.set(E.source.uuid+":"+E.wrapS+E.wrapT,I*L*Y*D)}}});let m=0;for(let A of y.values())m+=A;let f=0;for(let A of v){for(let b in A.attributes)f+=A.attributes[b].array.byteLength;A.index&&(f+=A.index.array.byteLength)}g.traverse(A=>{A.isInstancedMesh&&(f+=A.instanceMatrix.array.byteLength)});let S=d.domElement,x=S.width*S.height*12;return{textures:y.size,texMiB:m/1048576,geoMiB:f/1048576,fbMiB:x/1048576,totalMiB:(m+f+x)/1048576}}function p(d,g,y,v){if(!e||(n[s]=d,s=(s+1)%n.length,o=Math.min(n.length,o+1),l+=d,l<.5))return;l=0;let m=v(),f=Array.from(n.slice(0,o)).sort((M,E)=>M-E),S=f.reduce((M,E)=>M+E,0)/Math.max(1,f.length),x=f[Math.floor(f.length*.95)]||0,A=g.info.render,b=u(g,y),_=m.heroObjs?m.heroObjs.reduce((M,E)=>M+cm(E),0):0;c={tier:m.tier,canvas:g.domElement.width+"\xD7"+g.domElement.height,pr:g.getPixelRatio(),fps:S>0?1/S:0,p95ms:x*1e3,calls:A.calls,tris:A.triangles,heroTris:_,textures:b.textures,glTextures:g.info.memory.textures,geometries:g.info.memory.geometries,gpuMiB:b.totalMiB,texMiB:b.texMiB,geoMiB:b.geoMiB,fbMiB:b.fbMiB,errors:t.length,scene:m.scene||"",readyMs:m.readyMs||0,touch:navigator.maxTouchPoints||0,renderScale:m.renderScale||1,view:m.view?m.view.w+"\xD7"+m.view.h:"",shot:m.cam?m.cam.shot:"",heroFrac:m.cam?m.cam.frac:0,camDist:m.cam?m.cam.dist:0,camPitch:m.cam?m.cam.pitch:0},h&&(h.textContent=`tier ${c.tier} (touch ${c.touch})  view ${c.view}  canvas ${c.canvas} @${c.pr.toFixed(2)} (scale ${c.renderScale})
cam ${c.shot}  hero ${(c.heroFrac*100).toFixed(0)}% of short side  dist ${c.camDist.toFixed(2)}m  pitch ${c.camPitch.toFixed(0)}\xB0
ready ${Math.round(c.readyMs)}ms
fps ${c.fps.toFixed(1)}  p95 ${c.p95ms.toFixed(1)}ms
calls ${c.calls}  tris ${c.tris} (hero ${_})
tex ${c.textures} (gl ${c.glTextures})  geo ${c.geometries}
GPU\u2248${c.gpuMiB.toFixed(1)}MiB (tex ${c.texMiB.toFixed(1)} geo ${c.geoMiB.toFixed(1)} fb ${c.fbMiB.toFixed(1)})
${c.scene}
`+(t.length?"ERR "+t.slice(-3).join(`
    `):"errors 0")+(r.length?`
`+r.slice(-2).join(`
`):""))}return{frame:p,pushErr:i,note:a,notes:r,errors:t,get stats(){return c}}}var Rl=["usagi","kuma","neko","pengin"],mm={usagi:[{fur:16777215,belly:16773364,ear:16758472},{fur:15983311,belly:16775406,ear:16756928}],kuma:[{fur:11893320,belly:15782308,ear:9067059},{fur:15253642,belly:16773334,ear:13081186}],neko:[{fur:16164172,belly:16773600,ear:16758472},{fur:12172486,belly:16185082,ear:16758472}],pengin:[{fur:3424346,belly:16777215,ear:16754224},{fur:5930920,belly:16777215,ear:16757575}]},nn={usagi:900,kuma:360,neko:700,pengin:540},Al=null;function va(){return Al||(Al=new ri({vertexColors:!0,roughness:.75}),Al.userData.shared=!0),Al}var Gt=(e,t=16,i=12)=>new yi(e,t,i);function gm(e,t=0){let i=mm[e][t%mm[e].length],r=2761264,a=16752564,n=16777215,s=new $t;s.name="animal-"+e;let o=new $t;s.add(o);let l=[{geo:Gt(.1,18,14),color:i.fur,pos:[0,-.06,0],scale:[1,1.12,.9]},{geo:Gt(.07,18,14),color:i.belly,pos:[0,-.07,.058],scale:[.95,1.05,.5]}];e==="usagi"&&l.push({geo:Gt(.03,10,8),color:n,pos:[0,-.12,-.09]}),e==="kuma"&&l.push({geo:Gt(.022,10,8),color:i.fur,pos:[0,-.13,-.09]});let h=new it(ai(l),va());o.add(h);let c=new $t;c.position.set(0,.1,.01),o.add(c);let u=[],p=e==="pengin"?.078:.082;if(u.push({geo:Gt(p,22,16),color:i.fur,scale:e==="usagi"?[1,.95,.95]:[1.08,.96,.96]}),e==="usagi"){for(let B of[-1,1])u.push({geo:Gt(.026,12,10),color:i.fur,pos:[B*.032,.11,-.005],scale:[1,2.6,.7],rot:[0,0,-B*.18]}),u.push({geo:Gt(.015,10,8),color:i.ear,pos:[B*.034,.112,.012],scale:[1,2.6,.4],rot:[0,0,-B*.18]});u.push({geo:Gt(.022,12,10),color:n,pos:[0,-.025,.066],scale:[1.4,.9,.8]})}else if(e==="kuma"){for(let B of[-1,1])u.push({geo:Gt(.03,12,10),color:i.fur,pos:[B*.062,.058,-.01],scale:[1,1,.6]}),u.push({geo:Gt(.017,10,8),color:i.ear,pos:[B*.062,.058,.004],scale:[1,1,.4]});u.push({geo:Gt(.036,14,10),color:i.belly,pos:[0,-.026,.06],scale:[1.25,.85,.75]})}else if(e==="neko"){for(let B of[-1,1])u.push({geo:new pa(.03,.05,4),color:i.fur,pos:[B*.05,.075,0],rot:[0,Math.PI/4,-B*.35]}),u.push({geo:new pa(.017,.03,4),color:i.ear,pos:[B*.05,.072,.012],rot:[0,Math.PI/4,-B*.35]});u.push({geo:Gt(.026,12,10),color:i.belly,pos:[0,-.028,.066],scale:[1.5,.85,.75]})}else e==="pengin"&&(u.push({geo:Gt(.066,18,14),color:i.belly,pos:[0,-.004,.026],scale:[1.02,.86,.82]}),u.push({geo:new pa(.014,.026,10),color:i.ear,pos:[0,-.02,.088],rot:[Math.PI/2,0,0],scale:[1.3,1,.7]}));e!=="pengin"&&u.push({geo:Gt(.009,10,8),color:e==="kuma"?r:16748456,pos:[0,-.012,e==="kuma"?.088:.082],scale:[1.3,1,1]});for(let B of[-1,1])u.push({geo:Gt(.014,10,8),color:a,pos:[B*.05,-.022,.06],scale:[1.2,.8,.4],rot:[0,B*.6,0]});c.add(new it(ai(u),va()));let d=e==="pengin"?.086:.078,g=.014,y=.03,v=new it(ai([{geo:Gt(.011,12,10),color:r,pos:[-y,g,d],scale:[1,1.15,.6]},{geo:Gt(.011,12,10),color:r,pos:[y,g,d],scale:[1,1.15,.6]},{geo:Gt(.0035,6,5),color:n,pos:[-y+.004,g+.005,d+.007]},{geo:Gt(.0035,6,5),color:n,pos:[y+.004,g+.005,d+.007]}]),va());c.add(v);let m=new it(ai([{geo:new Fr(.011,.0032,5,12,Math.PI),color:r,pos:[-y,g-.004,d+.002]},{geo:new Fr(.011,.0032,5,12,Math.PI),color:r,pos:[y,g-.004,d+.002]}]),va());m.visible=!1,c.add(m);let f=e==="kuma"?.093:e==="pengin"?.084:.083,S=e==="pengin"?-.042:-.034,x=new it(ai([{geo:new Fr(.009,.0022,5,10,Math.PI),color:r,pos:[0,S+.006,f],rot:[0,0,Math.PI]}]),va());c.add(x);let A=new it(ai([{geo:Gt(.012,12,8),color:10234684,pos:[0,S,f-.002],scale:[1.1,.9,.5]},{geo:Gt(.007,8,6),color:16744341,pos:[0,S-.004,f+.002],scale:[1.2,.6,.5]}]),va());A.visible=!1,c.add(A);let b=()=>ai([{geo:new fl(.022,.05,4,10),color:i.fur,pos:[0,-.04,0]}]),_=[-1,1].map(B=>{let Z=new $t;return Z.position.set(B*.085,-.01,.03),Z.add(new it(b(),va())),o.add(Z),Z}),M=new it(new yi(.17,8,6),new vi({visible:!1}));M.position.y=.04,M.userData.kind="customer",s.add(M);let E={mode:"wait",modeT:0,blinkT:1+Math.random()*2,hopT:9,yaw:0,leanAmt:0,eat:0,happy:0,walkFrom:new R,walkTo:new R,walkDur:1,walkT:1,eager:0,wave:0,phase:Math.random()*6};function P(B){E.mode=B,E.modeT=0}function I(B,Z){E.walkFrom.copy(s.position),E.walkTo.copy(B),E.walkDur=Z,E.walkT=0}function L(){E.hopT=0}function Y(B,Z){if(E.modeT+=B,E.phase+=B,E.walkT<E.walkDur){E.walkT=Math.min(E.walkDur,E.walkT+B);let Ye=E.walkT/E.walkDur,Ve=Ye*Ye*(3-2*Ye);s.position.lerpVectors(E.walkFrom,E.walkTo,Ve),s.position.y=E.walkFrom.y+(E.walkTo.y-E.walkFrom.y)*Ve+Math.abs(Math.sin(Ye*Math.PI*5))*.02}E.blinkT-=B;let V=1;E.blinkT<0&&(V=.12,E.blinkT<-.12&&(E.blinkT=2+Math.random()*3)),v.scale.set(1,V,1);let pe=Ii((Z.lookX-s.position.x)*1.6,-.5,.5);E.yaw+=(pe-E.yaw)*wi(4,B),E.eager+=((Z.eager||0)-E.eager)*wi(5,B);let z=E.mode==="eat",W=E.mode==="happy";E.eat+=((z?1:0)-E.eat)*wi(8,B),E.happy+=((W?1:0)-E.happy)*wi(6,B);let Q=E.eager*.22+E.eat*.45;o.rotation.x=Q,c.rotation.set(-.14+E.eat*.5+Math.sin(E.phase*1.3)*.03,E.yaw*(1-E.eat),Math.sin(E.phase*.9)*.05),E.hopT+=B;let ve=Math.sin(E.phase*2.2)*.003;E.hopT<.45&&(ve+=zr(E.hopT/.45)*.05),W&&(ve+=Math.abs(Math.sin(E.modeT*7))*.045*Math.max(0,1-E.modeT/2.2)),o.position.y=ve;let $=W||z;m.visible=W,v.visible=!W,A.visible=$&&(W||Math.sin(E.modeT*18)>0),x.visible=!A.visible;let he=Math.max(E.eager,E.eat),Pe=E.mode==="wave"||E.mode==="leave"?1:0;E.wave+=(Pe-E.wave)*wi(6,B),_[0].rotation.set(-.9-he*.6-E.happy*1.2+Math.sin(E.modeT*14)*E.happy*.3,0,-.2-E.happy*.5),_[1].rotation.set(-.9-he*.6-E.happy*1.2-E.wave*1.6+Math.sin(E.modeT*14)*E.happy*.3,0,.2+E.happy*.5+E.wave*(.6+Math.sin(E.modeT*9)*.5))}function D(){s.traverse(B=>{B.geometry&&B.geometry.dispose(),B.material&&!B.material.userData.shared&&B.material.dispose()}),s.removeFromParent()}return{kind:e,group:s,head:c,pick:M,update:Y,setMode:P,walkTo:I,poke:L,dispose:D,get mode(){return E.mode},get walking(){return E.walkT<E.walkDur}}}function vm(e,t){let i=null;if(t.root.traverse(ae=>{ae.name==="hero.mound"&&ae.isMesh&&(i=ae)}),!i||!i.geometry||!i.geometry.index)return null;let r=i.geometry,a=r.attributes;if(!a.position||!a.normal||!a.color||!a.aSurf||!a.uv)return null;let n=a.position.count,s=Math.round(Math.sqrt(n));if(s*s!==n||s<4)return null;let o=a.position.array,l=o[0],h=o[2],c=o[3]-o[0];if(!(c>0))return null;let u=r.index.array,p=new Uint8Array(n),d=new Uint8Array(n);for(let ae=0;ae<u.length;ae+=3){let te=s,oe=s;for(let ie=0;ie<3;ie++){let be=u[ae+ie];p[be]=1;let We=be%s,U=be/s|0;We<te&&(te=We),U<oe&&(oe=U)}d[oe*s+te]=1}let g=new Uint8Array(n);(()=>{for(let ae=0;ae<n;ae++){let te=ae%s,oe=ae/s|0;g[ae]=p[ae]&&Math.abs(o[ae*3]-(l+te*c))<1e-6&&Math.abs(o[ae*3+2]-(h+oe*c))<1e-6?1:0}})();let v=2*s-1,m=v*v,f=new Float32Array(m*3),S=new Float32Array(m*3),x=new Float32Array(m*3),A=new Float32Array(m*3),b=new Float32Array(m*2),_=new Uint8Array(m),M=[];for(let ae=0;ae<s-1;ae++)for(let te=0;te<s-1;te++)if(d[ae*s+te])for(let oe=0;oe<2;oe++)for(let ie=0;ie<2;ie++){let be=2*te+ie,We=2*ae+oe,U=We*v+be,Ie=U+1,_e=U+v,Xe=_e+1;be+We&1?M.push(U,_e,Ie,Ie,_e,Xe):M.push(U,_e,Xe,U,Xe,Ie)}let E=new e.BufferGeometry,P=new e.BufferAttribute(f,3).setUsage(e.DynamicDrawUsage),I=new e.BufferAttribute(S,3).setUsage(e.DynamicDrawUsage),L=new e.BufferAttribute(x,3).setUsage(e.DynamicDrawUsage),Y=new e.BufferAttribute(A,3).setUsage(e.DynamicDrawUsage),D=new e.BufferAttribute(b,2);E.setAttribute("position",P),E.setAttribute("normal",I),E.setAttribute("color",L),E.setAttribute("aSurf",Y),E.setAttribute("uv",D),E.setIndex(M),E.boundingSphere=r.boundingSphere?r.boundingSphere.clone():new e.Sphere(new e.Vector3(0,.12,0),.2);let B=new e.Mesh(E,i.material);B.name="shell.moundSmooth",B.position.copy(i.position),B.quaternion.copy(i.quaternion),B.scale.copy(i.scale),B.renderOrder=i.renderOrder,i.parent.add(B),i.visible=!1;let Z=(ae,te,oe,ie)=>(-ae+9*te+9*oe-ie)*.0625,V=(ae,te,oe)=>{let ie=te<oe?te:oe,be=te<oe?oe:te;return ae<ie?ie:ae>be?be:ae};function pe(ae,te,oe,ie,be,We){let U=ae*3,Ie=oe*3,_e=ie*3,Xe=z,re=W,et=Q,we=ve,je=$;f[U]=(Xe[Ie]+Xe[_e])*.5,f[U+2]=(Xe[Ie+2]+Xe[_e+2])*.5,b[ae*2]=(je[oe*2]+je[ie*2])*.5,b[ae*2+1]=(je[oe*2+1]+je[ie*2+1])*.5;for(let He=0;He<3;He++)S[U+He]=(re[Ie+He]+re[_e+He])*.5;if(We){let He=te*3,C=be*3;f[U+1]=Z(Xe[He+1],Xe[Ie+1],Xe[_e+1],Xe[C+1]);for(let w=0;w<3;w++)x[U+w]=V(Z(et[He+w],et[Ie+w],et[_e+w],et[C+w]),et[Ie+w],et[_e+w]),A[U+w]=V(Z(we[He+w],we[Ie+w],we[_e+w],we[C+w]),we[Ie+w],we[_e+w])}else{f[U+1]=(Xe[Ie+1]+Xe[_e+1])*.5;for(let He=0;He<3;He++)x[U+He]=(et[Ie+He]+et[_e+He])*.5,A[U+He]=(we[Ie+He]+we[_e+He])*.5}}let z=o,W=a.normal.array,Q=a.color.array,ve=a.aSurf.array,$=a.uv.array,he=new Float32Array(n*3),Pe=new Float32Array(n*3),Ye=new Float32Array(n*3),Ve=new Uint8Array(n),fe=new Uint8Array(n);function rt(ae){for(let te=0;te<n;te++){let oe=te*3;Ve[te]=g[te]&&(ae[oe]>.01||ae[oe+1]>.01||ae[oe+2]>.01)?1:0}for(let te=0;te<n;te++){if(!g[te]){fe[te]=0;continue}let oe=te%s,ie=te/s|0;fe[te]=Ve[te]||oe>0&&Ve[te-1]||oe<s-1&&Ve[te+1]||ie>0&&Ve[te-s]||ie<s-1&&Ve[te+s]?1:0}}function pt(ae,te){for(let oe=0;oe<2;oe++){let ie=oe===0?ae:Ye,be=oe===0?Ye:te,We=oe===0?1:s;for(let U=0;U<n;U++){let Ie=U*3;if(!fe[U]){be[Ie]=ie[Ie],be[Ie+1]=ie[Ie+1],be[Ie+2]=ie[Ie+2];continue}let _e=oe===0?U%s:U/s|0,Xe=_e>0&&g[U-We]?1:0,re=_e<s-1&&g[U+We]?1:0,et=1/(2+Xe+re),we=(U-We*Xe)*3,je=(U+We*re)*3;be[Ie]=(2*ie[Ie]+Xe*ie[we]+re*ie[je])*et,be[Ie+1]=(2*ie[Ie+1]+Xe*ie[we+1]+re*ie[je+1])*et,be[Ie+2]=(2*ie[Ie+2]+Xe*ie[we+2]+re*ie[je+2])*et}}}function Ue(){z=a.position.array,W=a.normal.array,$=a.uv.array,rt(a.aSurf.array),pt(a.color.array,he),pt(a.aSurf.array,Pe),Q=he,ve=Pe;for(let te=0;te<s;te++)for(let oe=0;oe<s;oe++){let ie=te*s+oe,be=2*te*v+2*oe,We=ie*3,U=be*3;for(let Ie=0;Ie<3;Ie++)f[U+Ie]=z[We+Ie],S[U+Ie]=W[We+Ie],x[U+Ie]=Q[We+Ie],A[U+Ie]=ve[We+Ie];if(b[be*2]=$[ie*2],b[be*2+1]=$[ie*2+1],_[be]=g[ie],oe<s-1){let Ie=ie,_e=ie+1,Xe=g[Ie]&&g[_e],re=Xe&&oe>0&&oe<s-2&&g[ie-1]&&g[ie+2];pe(be+1,re?ie-1:Ie,Ie,_e,re?ie+2:_e,re),_[be+1]=Xe?1:0}if(te<s-1){let Ie=ie,_e=ie+s,Xe=g[Ie]&&g[_e],re=Xe&&te>0&&te<s-2&&g[ie-s]&&g[ie+2*s];pe(be+v,re?ie-s:Ie,Ie,_e,re?ie+2*s:_e,re),_[be+v]=Xe?1:0}}for(let te=0;te<s-1;te++)for(let oe=0;oe<s-1;oe++){let ie=(2*te+1)*v+2*oe+1,be=ie*3,We=ie-v,U=ie+v,Ie=ie-1,_e=ie+1,Xe=We-1,re=We+1,et=U-1,we=U+1,je=_[Xe]&&_[re]&&_[et]&&_[we];_[ie]=je?1:0;for(let He=0;He<3;He++){let C=(f[Xe*3+He]+f[re*3+He]+f[et*3+He]+f[we*3+He])*.25,w=(f[We*3+He]+f[U*3+He]+f[Ie*3+He]+f[_e*3+He])*.25;f[be+He]=je&&He===1?2*w-C:C,S[be+He]=(S[Xe*3+He]+S[re*3+He]+S[et*3+He]+S[we*3+He])*.25;for(let X=0;X<2;X++){let ce=X===0?x:A,ee=ce[Xe*3+He],Re=ce[re*3+He],Ae=ce[et*3+He],H=ce[we*3+He],ne=(ce[We*3+He]+ce[U*3+He]+ce[Ie*3+He]+ce[_e*3+He])*.5-(ee+Re+Ae+H)*.25;je||(ne=(ee+Re+Ae+H)*.25);let Ne=Math.min(ee,Re,Ae,H),O=Math.max(ee,Re,Ae,H);ce[be+He]=ne<Ne?Ne:ne>O?O:ne}}b[ie*2]=(b[Xe*2]+b[we*2])*.5,b[ie*2+1]=(b[Xe*2+1]+b[we*2+1])*.5}let ae=1/c;for(let te=0;te<v;te++)for(let oe=0;oe<v;oe++){let ie=te*v+oe,be=ie*3;if(oe>0&&te>0&&oe<v-1&&te<v-1&&_[ie]&&_[ie-1]&&_[ie+1]&&_[ie-v]&&_[ie+v]){let We=(f[(ie+1)*3+1]-f[(ie-1)*3+1])*ae,U=(f[(ie+v)*3+1]-f[(ie-v)*3+1])*ae,Ie=1/Math.sqrt(We*We+1+U*U);S[be]=-We*Ie,S[be+1]=Ie,S[be+2]=-U*Ie}else{let We=Math.hypot(S[be],S[be+1],S[be+2]);We>1e-6?(S[be]/=We,S[be+1]/=We,S[be+2]/=We):(S[be]=0,S[be+1]=1,S[be+2]=0)}}P.needsUpdate=!0,I.needsUpdate=!0,L.needsUpdate=!0,Y.needsUpdate=!0,D.needsUpdate=!0}let vt=-1,ue=0,xe=0,me=!1;function ze(ae){xe++;let te=a.position.version+a.color.version*7+a.aSurf.version*13;if(te!==vt&&(vt=te,me=!0),!me||!ae&&xe&1)return;me=!1;let oe=performance.now();Ue(),ue=ue*.9+(performance.now()-oe)*.1}return ze(!0),{mesh:B,update:ze,get ms(){return ue},onContextRestored(){P.needsUpdate=!0,I.needsUpdate=!0,L.needsUpdate=!0,Y.needsUpdate=!0,D.needsUpdate=!0},dispose(){B.removeFromParent(),E.dispose(),i.visible=!0}}}var bM=320,EM=14,wM=3.5,TM=3.4,_m=18;function ym({scene:e,camera:t,rig:i,renderer:r,world:a,createHero:n,tier:s,textures:o,audio:l,debug:h}){let c=a,u=r.domElement,p=0,d=n(Ki,{tier:s,variant:0,textures:{ice:o.ice||null,syrup:null},onEvent:(N,G)=>B(N,G)});e.add(d.root),e.add(d.fx);let g=d.dims,y=null;if(new URLSearchParams(location.search).get("smooth")!=="0")try{y=vm(Ki,d)}catch(N){h.pushErr("smooth: "+N.message),y=null}let v=new $t;v.name="toppings",d.root.add(v);let m={};for(let N of c.toppingKinds){let G=new Or(c.toppingGeos[N],c.toppingMat,_m);G.count=0,G.frustumCulled=!1,v.add(G),m[N]=G}let f={time:0,state:"enter",stateT:0,round:0,variant:0,served:0,bowlPos:Ge.bowlEnter.clone(),bowlTarget:Ge.bowlHome.clone(),bowlVel:new R,bowlHopT:9,held:null,lastTouch:0,lastHint:0,glowT:9,machineHopT:9,wheelAngle:0,wheelOmega:0,clickAcc:0,snowMade:0,give:null,pouring:0,giveGlowT:9};d.root.position.copy(f.bowlPos);let S={time:0,held:!1,bowlVel:{x:0,z:0},snow:{rate:1,x:Ge.spout.x,y:Ge.spout.y,z:Ge.spout.z},pours:[],busy:!1},x=[0,1].map(()=>({id:"",x:0,y:0,z:0,color:[1,1,1],rate:0,kind:"syrup"})),A=[],b=[],_=[],M=[],E=[],P=0,I=()=>{let N=Rl[P%Rl.length],G=gm(N,Math.floor(P/Rl.length));return P++,G.pick.userData.who=G,e.add(G.group),G},L=I();L.group.position.copy(Ge.customerFront);let Y=[I(),I()];Y.forEach((N,G)=>N.group.position.copy(Ge.queue[G]));let D=[];function B(N,G){let k=l.sfx;N==="land"?k.pop(1.2):N==="slide"?k.slide():N==="spill"?k.spill():N==="syrupHit"?k.plop(1):N==="pool"?k.drip():N==="stage"&&(G.stage>p&&k.sparkle(),p=G.stage)}let Z=new as,V=new se,pe=new Ri(new R(0,1,0),0),z=new R,W=new R,Q=new Map;function ve(N){let G=u.getBoundingClientRect();V.set((N.clientX-G.left)/G.width*2-1,-((N.clientY-G.top)/G.height)*2+1),Z.setFromCamera(V,t)}function $(N,G){return pe.constant=-N,Z.ray.intersectPlane(pe,G)}function he(N){ve(N);let G=[...c.pick,L.pick,...Y.map(le=>le.pick)],k=Z.intersectObjects(G,!1);return k.length?k[0].object.userData:f.state==="free"&&Z.intersectObjects(d.pickables,!0).length?{kind:"bowl"}:f.state==="free"&&$(.05,z)&&Math.hypot(z.x-f.bowlPos.x,z.z-f.bowlPos.z)<g.pickRadius+.03?{kind:"bowl"}:null}u.addEventListener("pointerdown",N=>{N.preventDefault(),l.init(),f.lastTouch=f.time,f.waitTouch=!1;try{u.setPointerCapture(N.pointerId)}catch{}let G=he(N),k={id:N.pointerId,kind:G?G.kind:null,index:G?G.index:-1,x0:N.clientX,y0:N.clientY,t0:performance.now(),moved:!1,e:N,data:{}};if(Q.set(N.pointerId,k),!!G){if(k.kind==="bowl"){if(f.held){k.kind=null;return}f.held=k,$(g.rimHeight,z),k.data.off=new R(f.bowlPos.x-z.x,0,f.bowlPos.z-z.z),l.sfx.pop(.9)}else if(k.kind==="wheel")f.lastBackTouch=f.time,k.data.ang=Ve(N),k.data.t=performance.now(),f.wheelOmega=Math.max(f.wheelOmega,4),l.sfx.click();else if(k.kind==="bottle"){let le=c.bottles[k.index];if(le.pointer||le.state==="auto"){k.kind=null;return}le.pointer=k,l.sfx.pop(1.4)}else if(k.kind==="pile")c.piles[k.index].hopT=0,l.sfx.pop(1.6);else if(k.kind==="customer"){f.lastBackTouch=f.time;let le=G.who||L;if(le!==L){le.poke(),l.sfx.hello(nn[le.kind]),k.kind=null;return}L.poke(),l.sfx.hello(nn[L.kind])}}},{passive:!1}),u.addEventListener("pointermove",N=>{let G=Q.get(N.pointerId);if(G){if(N.preventDefault(),G.e=N,f.lastTouch=f.time,!G.moved&&Math.hypot(N.clientX-G.x0,N.clientY-G.y0)>EM){if(G.moved=!0,G.kind==="bottle"){let k=c.bottles[G.index];k.state="drag"}G.kind==="pile"&&U(G)}if(G.kind==="wheel"){let k=Ve(N),le=performance.now(),Je=k-G.data.ang;Je>Math.PI&&(Je-=Math.PI*2),Je<-Math.PI&&(Je+=Math.PI*2);let ye=Math.max(.008,(le-G.data.t)/1e3),Me=Ii(-Je/ye,-30,30);f.wheelOmega+=(Me-f.wheelOmega)*.5,G.moved&&Math.abs(f.wheelOmega)<5&&(f.wheelOmega+=.6*Math.sign(f.wheelOmega||1)),G.data.ang=k,G.data.t=le}}},{passive:!1});function Pe(N,G){G||l.init();let k=Q.get(N.pointerId);if(!k)return;Q.delete(N.pointerId);let le=!G&&!k.moved&&performance.now()-k.t0<bM*2;if(k.kind==="bowl"&&f.held===k)f.held=null,f.state==="free"&&f.bowlPos.distanceTo(z.set(Ge.give.x,0,Ge.give.z))<Ge.giveRadius?et():le&&(f.bowlHopT=0,l.sfx.boing(1.1));else if(k.kind==="wheel")le&&(f.wheelOmega=Math.min(30,Math.abs(f.wheelOmega)+11),l.sfx.click());else if(k.kind==="bottle"){let Je=c.bottles[k.index];Je.pointer=null,le&&Je.state==="home"?xe(Je):Je.state==="drag"&&(Je.state="return",Je.t=0,Je.from=Je.group.position.clone())}else if(k.kind==="pile"){let Je=b.find(ye=>ye.pointer===k);Je?_e(Je):le&&Ie(c.piles[k.index].kind,c.piles[k.index].group.position)}else k.kind==="customer"&&le&&f.state==="free"&&et()}u.addEventListener("pointerup",N=>Pe(N,!1)),u.addEventListener("pointercancel",N=>Pe(N,!0)),u.addEventListener("contextmenu",N=>N.preventDefault());let Ye=new R;function Ve(N){c.wheel.getWorldPosition(Ye),Ye.project(t);let G=u.getBoundingClientRect(),k=(Ye.x*.5+.5)*G.width+G.left,le=(-Ye.y*.5+.5)*G.height+G.top;return Math.atan2(-(N.clientY-le),N.clientX-k)}let fe=new se(Ge.work.x0+.02,Ge.work.z0+.03),rt=new se(Ge.give.x,Ge.give.z);function pt(N,G,k){let le=Ii(N,Ge.work.x0,Ge.work.x1),Je=Ii(G,Ge.work.z0,Ge.work.z1),ye=Math.hypot(N-le,G-Je),Me=W.set(rt.x-fe.x,0,rt.y-fe.y),at=Me.x*Me.x+Me.z*Me.z,ot=Ii(((N-fe.x)*Me.x+(G-fe.y)*Me.z)/at,0,1),mt=fe.x+Me.x*ot,wt=fe.y+Me.z*ot,T=Math.hypot(N-mt,G-wt),F=.06;T>F?(mt+=(N-mt)/T*F,wt+=(G-wt)/T*F):(mt=N,wt=G);let J=Math.hypot(N-mt,G-wt);return ye<=J?k.set(le,0,Je):k.set(mt,0,wt),k}let Ue={y:0,nx:0,ny:1,nz:0,inside:!1};function vt(N,G){let k=N-f.bowlPos.x,le=G-f.bowlPos.z;return Math.hypot(k,le)>g.rimRadius?0:(d.sampleSurface(k,le,Ue),Ue.y+d.root.position.y)}function ue(N){let G=-1,k=0,le=0;for(let Je=0;Je<10;Je++){let ye=Math.random()*Math.PI*2,Me=Math.sqrt(Math.random())*g.rimRadius*.6,at=Math.cos(ye)*Me,ot=Math.sin(ye)*Me;d.sampleSurface(at,ot,Ue);let mt=Ue.y+Math.random()*.01;mt>G&&(G=mt,k=at,le=ot)}return N.set(k,0,le)}function xe(N){if(f.state!=="free"){N.hopT=0;return}N.state="auto",N.t=0,N.from=N.group.position.clone(),ue(N.target),N.spin=Math.random()*Math.PI*2,l.sfx.whoosh()}function me(N){let G=0;for(let k of c.bottles){k.hopT+=N;let le=k.group,Je=0,ye=z;if(k.state==="drag"&&k.pointer){if(ve(k.pointer.e),$(.1,ye)){let at=vt(ye.x,ye.z);ye.y=Math.max(at+.12,.2),le.position.lerp(ye,wi(22,N))}Je=Math.hypot(le.position.x-f.bowlPos.x,le.position.z-f.bowlPos.z)<g.rimRadius+.01&&f.state==="free"?1:.35}else if(k.state==="auto"){k.t+=N;let Me=k.spin+k.t*2.6,at=.022,ot=f.bowlPos.x+k.target.x+Math.cos(Me)*at,mt=f.bowlPos.z+k.target.z+Math.sin(Me)*at,wt=Math.max(vt(ot,mt)+.12,.2);if(k.t<.45){let T=an(k.t/.45);ye.set(k.from.x+(ot-k.from.x)*T,k.from.y+(wt-k.from.y)*T+Math.sin(T*Math.PI)*.08,k.from.z+(mt-k.from.z)*T),le.position.copy(ye),Je=.5}else k.t<2.2&&f.state==="free"?(le.position.lerp(ye.set(ot,wt,mt),wi(10,N)),Je=1):(k.state="return",k.t=0,k.from=le.position.clone())}else if(k.state==="return"){k.t+=N;let Me=an(Math.min(1,k.t/.4));le.position.lerpVectors(k.from,k.home,Me),le.position.y+=Math.sin(Me*Math.PI)*.05,Me>=1&&(k.state="home",l.sfx.click())}else le.position.copy(k.home),le.position.y+=zr(k.hopT/.4)*.035,k.pointer&&!k.pointer.moved&&(le.position.y+=.01);if(k.tilt+=(Je-k.tilt)*wi(9,N),le.rotation.set(0,0,k.tilt*2.25),k.rate=k.tilt>.8?(k.tilt-.8)/.2:0,k.mat.emissiveIntensity=.12+Math.max(0,1-k.hopT/.8)*.5,k.rate>.02&&G<x.length&&!S.busy){let Me=x[G++];Me.id=k.syrup.id,Me.x=le.position.x,Me.y=le.position.y,Me.z=le.position.z,Me.color=k.syrup.color,Me.rate=k.rate,Me.kind=k.syrup.kind}}S.pours.length=0;for(let k=0;k<G;k++)S.pours.push(x[k]);return G}let ze=new lt,ae=new Bt,te=new Bt,oe=new R(0,1,0),ie=new R,be=new R;function We(N){let G=new it(c.toppingGeos[N],c.toppingMat);return e.add(G),G}function U(N){let G=c.piles[N.index],k={kind:G.kind,mesh:We(G.kind),mode:"drag",t:0,pointer:N,from:G.group.position.clone(),to:new R};k.mesh.position.copy(G.group.position),b.push(k)}function Ie(N,G){let k={kind:N,mesh:We(N),mode:"hop",t:0,pointer:null,from:G.clone(),to:ue(new R)};k.to.x+=(Math.random()-.5)*.03,k.to.z+=(Math.random()-.5)*.03,k.mesh.position.copy(G),b.push(k)}function _e(N){N.pointer=null;let G=N.mesh.position.x-f.bowlPos.x,k=N.mesh.position.z-f.bowlPos.z;Math.hypot(G,k)<g.rimRadius*.92&&f.state==="free"?(N.mode="fall",N.t=0,N.to.set(G,0,k),N.from=N.mesh.position.clone()):(N.mode="back",N.t=0,N.from=N.mesh.position.clone(),N.to.copy(c.piles[c.toppingKinds.indexOf(N.kind)].group.position))}function Xe(N,G,k){A.length>=_m&&A.shift(),A.push({kind:N,lx:G,lz:k,ry:Math.random()*Math.PI*2,t:0}),l.sfx.pop(1.3+Math.random()*.3)}function re(N){for(let at=b.length-1;at>=0;at--){let ot=b[at];ot.t+=N;let mt=ot.mesh;if(ot.mode==="drag"){if(ve(ot.pointer.e),$(.08,z)){let wt=vt(z.x,z.z);z.y=Math.max(wt,.02)+.05,mt.position.lerp(z,wi(25,N))}}else if(ot.mode==="hop"||ot.mode==="fall"){let wt=ot.mode==="hop"?.55:.22,T=Math.min(1,ot.t/wt),F=f.bowlPos.x+ot.to.x,J=f.bowlPos.z+ot.to.z,q=vt(F,J);if(mt.position.set(ot.from.x+(F-ot.from.x)*T,ot.from.y+(q-ot.from.y)*T+(ot.mode==="hop"?Math.sin(T*Math.PI)*.12:0),ot.from.z+(J-ot.from.z)*T),T>=1){f.state==="free"&&Xe(ot.kind,ot.to.x,ot.to.z),mt.removeFromParent(),b.splice(at,1);continue}}else if(ot.mode==="back"){let wt=Math.min(1,ot.t/.3);if(mt.position.lerpVectors(ot.from,ot.to,an(wt)),mt.scale.setScalar(1-wt*.8),wt>=1){mt.removeFromParent(),b.splice(at,1);continue}}mt.rotation.y+=N*3}let G={};for(let at of c.toppingKinds)G[at]=0;let k=ze,le=ae,Je=oe,ye=ie,Me=be;for(let at of A){at.t+=N,d.sampleSurface(at.lx,at.lz,Ue),ye.set(Ue.nx*.5,1,Ue.nz*.5).normalize(),le.setFromUnitVectors(Je,ye),le.multiply(te.setFromAxisAngle(Je,at.ry));let ot=at.t<.25?.6+Tc(at.t/.25)*.4:1;k.compose(z.set(at.lx,Ue.y-.002+zr(at.t/.3)*.01,at.lz),le,Me.set(ot,ot,ot)),m[at.kind].setMatrixAt(G[at.kind]++,k)}for(let at of c.toppingKinds)m[at].count=G[at],m[at].instanceMatrix.needsUpdate=!0}function et(){if(f.state==="free"){f.state="give",f.stateT=0,f.held=null,f.give={from:f.bowlPos.clone(),bitten:!1,happy:!1,snapped:!1,entered:!1,munch:0};for(let N of c.bottles)(N.state==="drag"||N.state==="auto")&&(N.pointer=null,N.state="return",N.t=0,N.from=N.group.position.clone());for(let N of b)N.mode==="drag"&&_e(N);l.sfx.whoosh()}}function we(N){let G=f.give,k=f.stateT,le=z.set(Ge.give.x,0,Ge.give.z);if(k<.6?f.bowlTarget.lerpVectors(G.from,le,an(k/.6)):f.bowlTarget.copy(le),f.bowlPos.copy(f.bowlTarget),k>.6&&!G.snapped&&(L.mode==="wait"||L.mode==="wave")&&L.setMode("eat"),k>.78&&G.munch===0&&(G.munch=1,l.sfx.munch()),k>.85&&!G.bitten){G.bitten=!0;let Je=L.group.position.x-f.bowlPos.x,ye=L.group.position.z-f.bowlPos.z,Me=Math.hypot(Je,ye)||1;d.bite(Je/Me*.03,ye/Me*.03,.032)}if(k>1.3&&!G.happy&&(G.happy=!0,L.setMode("happy"),l.sfx.happy(nn[L.kind]),l.sfx.chime(),w(L)),k>2.5&&!G.snapped){G.snapped=!0;let Je=d.snapshot();for(let Me of A){let at=new it(c.toppingGeos[Me.kind],c.toppingMat);d.sampleSurface(Me.lx,Me.lz,Ue),at.position.set(Me.lx,Ue.y-.002,Me.lz),at.rotation.y=Me.ry,Je.add(at)}Je.position.copy(f.bowlPos),e.add(Je),A.length=0,d.root.visible=!1,f.variant++,d.reset({variant:f.variant}),p=0,f.snowMade=0,He(Je),L.setMode("leave"),L.walkTo(Ge.exit,1.8),D.push({a:L,t:0}),L=Y.shift(),L.walkTo(Ge.customerFront,1.3),L.setMode("wait"),Y.forEach((Me,at)=>Me.walkTo(Ge.queue[at],1.3));let ye=I();ye.group.position.set(Ge.queue[1].x-.5,Ge.queue[1].y,Ge.queue[1].z-.2),ye.walkTo(Ge.queue[1],1.6),Y.push(ye)}k>2.9&&!G.entered&&(G.entered=!0,d.root.visible=!0,f.bowlPos.copy(Ge.bowlEnter),f.state="enter",f.stateT=0,f.served++,f.waitTouch=!0,l.sfx.whoosh())}function je(N){let G=Math.min(1,f.stateT/.9);f.bowlPos.lerpVectors(Ge.bowlEnter,Ge.bowlHome,Tc(G)),G>=1&&(f.state="free",f.stateT=0,f.bowlTarget.copy(Ge.bowlHome),f.bowlHopT=0,f.machineHopT=.1,f.glowT=0,f.lastHint=f.time,l.sfx.boing(1),l.sfx.hello(nn[L.kind]))}function He(N){if(_.length>=Ge.shelfSlots.length){let G=_.shift();G.obj.userData.dispose&&G.obj.userData.dispose(),G.obj.removeFromParent(),_.forEach((k,le)=>{k.from=k.obj.position.clone(),k.slot=le,k.t=0,k.fromScale=k.obj.scale.x})}_.push({obj:N,slot:_.length,t:0,from:N.position.clone(),fromScale:1})}function C(N){for(let G of _){if(G.t>=1)continue;G.t=Math.min(1,G.t+N/.9);let k=Ge.shelfSlots[G.slot],le=an(G.t);G.obj.position.lerpVectors(G.from,k,le),G.obj.position.y+=Math.sin(le*Math.PI)*.18,G.obj.scale.setScalar(G.fromScale+(Ge.shelfScale-G.fromScale)*le)}}function w(N){for(let G=0;G<9;G++){let k=N.group.position.clone();k.y+=.2,k.z+=.05,E.push({p:k,v:new R((Math.random()-.5)*.35,.35+Math.random()*.3,.1+Math.random()*.1),t:-G*.06})}}function X(N){let G=ze,k=be,le=0;for(let Je=E.length-1;Je>=0;Je--){let ye=E[Je];if(ye.t+=N,ye.t>1.6){E.splice(Je,1);continue}if(ye.t<0)continue;ye.p.addScaledVector(ye.v,N),ye.v.y-=.12*N,ye.v.x*=.98;let Me=Math.min(1,ye.t/.15)*(ye.t>1.2?Math.max(0,1-(ye.t-1.2)/.4):1)*(1+Math.sin(ye.t*12)*.08);G.compose(ye.p,t.quaternion,k.set(Me,Me,Me)),le<16&&c.hearts.setMatrixAt(le++,G)}c.hearts.count=le,c.hearts.instanceMatrix.needsUpdate=!0}function ce(){if(f.state!=="free"||f.time-f.lastTouch<wM||f.time-f.lastHint<TM)return;f.lastHint=f.time;let N=d.getStats();N.volume<.3?(f.bowlHopT=0,f.glowT=0,f.wheelOmega+=6,l.sfx.boing(1)):N.coverage<.1?(c.bottles.forEach((G,k)=>{G.hopT=-k*.15}),l.sfx.pop(1.5)):(f.giveGlowT=0,L.poke(),L.setMode("wave"),setTimeout(()=>L.mode==="wave"&&L.setMode("wait"),1500),c.piles.forEach((G,k)=>{G.hopT=-.3-k*.12}),l.sfx.hello(nn[L.kind]))}let ee=new lt,Re=new Bt,Ae=new R,H=new R;function ne(N,G,k,le){ee.compose(H.set(G,.0012,k),Re,Ae.set(le,1,le)),c.blobs.setMatrixAt(N,ee)}function Ne(){let N=0;d.root.visible&&ne(N++,f.bowlPos.x,f.bowlPos.z,g.rimRadius*2.5*(1-d.root.position.y*6)),ne(N++,Ge.column.x,Ge.column.z,.22),ne(N++,c.dish.position.x,c.dish.position.z,.21);for(let G of c.bottles){let k=Math.max(0,G.group.position.y-G.home.y);ne(N++,G.group.position.x,G.group.position.z,Math.max(.02,.075-k*.25))}c.blobs.count=N,c.blobs.instanceMatrix.needsUpdate=!0}let O={frac:.62,pitch:{work:44,pour:54,carry:34,overview:30,give:28},land:{ax:0,ay:-.1},port:{ax:0,ay:-.24},idleOverview:7,idleOverviewDone:3.5},K=Array.from({length:40},()=>new R),de=new R,Se={name:"overview",pts:K,n:0,subN:0,focus:de,pitch:34,yaw:0,frac:O.frac,minFrac:0,ax:0,ay:0,time:.8,followTime:.4},Te=0,Ce=0;f.lastBackTouch=-9,f.waitTouch=!0;function $e(N,G,k,le){let Je=g.rimRadius,ye=g.rimHeight;for(let Me=0;Me<8;Me++){let at=Me/8*Math.PI*2;K[N++].set(G+Math.cos(at)*Je,ye,k+Math.sin(at)*Je)}return K[N++].set(G,0,k+g.footRadius),K[N++].set(G-g.footRadius,0,k),K[N++].set(G+g.footRadius,0,k),K[N++].set(G,le,k),N}function ge(N,G,k){let le=G.group.position;return K[N++].set(le.x-.12,.02,le.z+.05),K[N++].set(le.x+.12,.02,le.z+.05),K[N++].set(le.x,k,le.z),N}function ct(){if(f.state==="give")return"give";if(f.state==="enter")return"overview";if(f.held)return"carry";if(Ce>.05||f.pouring>0)return"pour";if(f.waitTouch||f.time-f.lastBackTouch<2.5||st("wheel")||st("customer"))return"overview";let N=f.time-f.lastTouch,G=d.getStats();return N>(G.stage>=3?O.idleOverviewDone:O.idleOverview)?"overview":"work"}function st(N){for(let G of Q.values())if(G.kind===N)return!0;return!1}function _t(N){let G=d.getStats();Te+=(Math.max(G.peak||0,g.rimHeight+.07)-Te)*wi(1.2,N),Ce+=((f.pouring>0?1:0)-Ce)*wi(1.6,N);let k=i.view.portrait?O.port:O.land,le=Ge.bowlHome,Je=ct(),ye=Se,Me=0;if(ye.name=Je,ye.minFrac=0,ye.shiftX=.45,ye.shiftY=.45,ye.ax=k.ax,ye.ay=k.ay,ye.time=.8,ye.followTime=.45,Je==="give")Me=$e(0,Ge.give.x,Ge.give.z,Math.min(Te,.2)),ye.subN=Me,Me=ge(Me,L,.36),de.set((Ge.give.x+L.group.position.x)/2,.12,(Ge.give.z+L.group.position.z)/2),ye.pitch=O.pitch.give,ye.frac=.84,ye.minFrac=.34,ye.ay=i.view.portrait?-.1:-.04,ye.time=1.2,ye.followTime=1;else if(Je==="carry"){let at=(Ge.work.x0+Ge.work.x1)/2,ot=(Ge.work.z0+Ge.work.z1)/2;Me=$e(0,at,ot,Te),ye.subN=Me,Me=$e(Me,Ge.give.x,Ge.give.z,g.rimHeight),Me=ge(Me,L,.16),de.set((at+Ge.give.x)/2,Te*.4,(ot+Ge.give.z)/2),ye.pitch=O.pitch.carry,ye.frac=.9,ye.minFrac=.5,ye.shiftX=i.view.portrait?.75:.5,ye.shiftY=.75,ye.time=1,ye.followTime=.8}else if(Je==="overview"){let at=f.state==="enter"?le.x:f.bowlPos.x,ot=f.state==="enter"?le.z:f.bowlPos.z;Me=$e(0,at,ot,Te),ye.subN=Me,K[Me++].set(Ge.spout.x,Ge.spout.y+.04,Ge.spout.z),c.wheel.getWorldPosition(K[Me++]),Me=ge(Me,L,.3),de.set(at,.15,ot-.1),ye.pitch=O.pitch.overview,ye.frac=.92,ye.minFrac=.42,ye.shiftX=i.view.portrait?.3:.12,ye.shiftY=.85,ye.ay=i.view.portrait?-.08:0,ye.time=1.1,ye.followTime=.9}else Me=$e(0,f.bowlPos.x,f.bowlPos.z,Te),ye.subN=Me,de.set(f.bowlPos.x,Te*.45,f.bowlPos.z),ye.pitch=O.pitch.work+(O.pitch.pour-O.pitch.work)*Ce,ye.frac=O.frac,ye.time=.8,ye.followTime=.6;ye.n=Me,i.update(N,ye)}let Oe=new R,Tt=new lt,Pt=new Bt,ss=new R(1,1,1),sn=.07;function os(N,G,k,le){return i.screenToPlane(N,G,k,le)?(le.x=Ii(le.x,-.85,.85),le.z=Ii(le.z,-.3,1.2),le.y=0,le):null}function on(N,G){let k=N.x-f.bowlPos.x,le=N.z-f.bowlPos.z,Je=Math.hypot(k,le),ye=g.rimRadius+G+.01;if(Je<ye){let Me=Je>1e-4?ye/Je:0;N.x=f.bowlPos.x+(Je>1e-4?k*Me:ye),N.z=f.bowlPos.z+le*Me}return N}function ls(){let N=i.view,G=N.safe,k=G.l,le=N.w-G.r,Je=G.t,ye=N.h-G.b,Me=Math.min(le-k,ye-Je);for(let mt=0;mt<c.bottles.length;mt++){let wt,T;if(N.portrait){let J=Math.min(.19*(le-k),.2*Me);wt=(k+le)/2+(mt-2)*J,T=ye-.02*Me}else{let J=Ii(N.aspect/1.3333333333333333,1,1.6);wt=le-(mt&1?.09:.09+.145*J)*Me,T=Je+(.25+.15*mt)*Me}let F=c.bottles[mt];os(wt,T,sn,Oe)&&(on(Oe,.04),F.home.x=Oe.x,F.home.z=Oe.z),Tt.compose(Oe.set(F.home.x,.0075,F.home.z),Pt,ss),c.coasters.setMatrixAt(mt,Tt)}c.coasters.instanceMatrix.needsUpdate=!0;let at=N.portrait?k+.03*Me:k+.16*Me,ot=N.portrait?ye-.45*Me:ye-.16*Me;os(at,ot,.01,Oe)&&(on(Oe,.09),c.dish.position.x=Oe.x,c.dish.position.z=Oe.z);for(let mt of c.piles)mt.group.position.x=c.dish.position.x+mt.off.x,mt.group.position.z=c.dish.position.z+mt.off.z}let zi=f.bowlPos.clone();function ln(N){f.time+=N,f.stateT+=N,_t(N),ls(),f.state==="free"?(f.held&&(ve(f.held.e),$(g.rimHeight,z)&&pt(z.x+f.held.data.off.x,z.z+f.held.data.off.z,f.bowlTarget)),f.bowlPos.lerp(f.bowlTarget,wi(16,N))):f.state==="give"?we(N):f.state==="enter"&&je(N),f.bowlVel.set((f.bowlPos.x-zi.x)/N,0,(f.bowlPos.z-zi.z)/N),zi.copy(f.bowlPos),f.bowlHopT+=N,d.root.position.set(f.bowlPos.x,zr(f.bowlHopT/.45)*.03,f.bowlPos.z),f.machineHopT+=N,c.machine.position.y=zr(f.machineHopT/.5)*.025,f.wheelOmega*=Math.exp(-1.3*N),f.wheelAngle-=f.wheelOmega*N,c.wheel.rotation.z=f.wheelAngle,f.clickAcc+=Math.abs(f.wheelOmega)*N,f.clickAcc>Math.PI*2/10&&(f.clickAcc=0,l.sfx.click());let G=f.state==="free",k=Math.min(2,Math.abs(f.wheelOmega)/6),le=G?(f.pouring>0?.3:1)+k:0;f.snowMade+=le*N,c.iceBlock.scale.y=Math.max(.35,1-f.snowMade/160),c.iceBlock.position.y=Ge.spout.y+.12+c.iceBlock.scale.y*.035,S.time=f.time,S.held=!!f.held,S.busy=f.state!=="free",S.bowlVel.x=f.bowlVel.x,S.bowlVel.z=f.bowlVel.z,le>0&&(S.snow=S.snow||{x:0,y:0,z:0,rate:0},S.snow.rate=le,S.snow.x=Ge.spout.x,S.snow.y=Ge.spout.y+c.machine.position.y,S.snow.z=Ge.spout.z);let Je=S.snow;le<=0&&(S.snow=null);let ye=me(N);f.pouring=ye>0?.6:Math.max(0,f.pouring-N),d.root.updateMatrixWorld(),d.update(N,S),S.snow||(S.snow=Je),re(N);for(let F of c.piles)F.hopT+=N,F.group.position.y=.008+zr(F.hopT/.4)*.03;let Me=Math.hypot(f.bowlPos.x-Ge.give.x,f.bowlPos.z-Ge.give.z),at=f.state==="free"?Ii(1-(Me-.05)/.3,0,1):f.state==="give"&&f.stateT<.6?1:0;L.update(N,{lookX:f.bowlPos.x,eager:at});for(let F of Y)F.update(N,{lookX:f.bowlPos.x,eager:0});for(let F=D.length-1;F>=0;F--){let J=D[F];J.t+=N,J.a.update(N,{lookX:-2,eager:0}),J.t>1.9&&(J.a.dispose(),D.splice(F,1))}C(N),X(N),ce(),Ne(),y&&y.update(),f.glowT+=N;let ot=f.glowT<1.6?Math.sin(f.glowT/1.6*Math.PI):0;c.glow.material.opacity=ot*.85,c.glow.visible=ot>.01,c.glow.position.set(f.bowlPos.x,.003,f.bowlPos.z),c.glow.scale.setScalar(g.rimRadius*3.2+ot*.06),f.giveGlowT+=N;let mt=f.state==="free"&&f.held?Math.max(.45,Ii(1-(Me-Ge.giveRadius)/.25,0,1)):0,wt=Math.max(f.giveGlowT<2.4?Math.sin(f.giveGlowT/1.2*Math.PI)**2:0,mt*(.55+.25*Math.sin(f.time*6)));c.giveGlow.material.opacity=wt,c.giveGlow.visible=wt>.01&&f.state==="free",c.giveGlow.scale.setScalar(.36+wt*.05);let T=d.levels;l.setLevels(le>0?.25+.25*(le-1)+T.land*.5:0,Math.max(T.slide,T.spill*.8),Math.max(T.flow,ye?.5:0))}f.state="enter",f.stateT=.5;function hs(N){let G=new R;if(N==="bowl")G.set(f.bowlPos.x,g.rimHeight,f.bowlPos.z);else if(N==="give")G.set(Ge.give.x,g.rimHeight,Ge.give.z);else if(N==="wheel")c.wheel.getWorldPosition(G);else if(N==="customer")L.group.getWorldPosition(G),G.y+=.1;else if(N.startsWith("bottle")){let le=c.bottles[+N.slice(6)];G.copy(le.group.position),G.y-=.07}else if(N.startsWith("pile"))G.copy(c.piles[+N.slice(4)].group.position);else if(N.startsWith("local:")){let[le,Je]=N.slice(6).split(",").map(Number);G.set(f.bowlPos.x+le,g.rimHeight,f.bowlPos.z+Je)}G.project(t);let k=u.getBoundingClientRect();return{x:(G.x*.5+.5)*k.width+k.left,y:(-G.y*.5+.5)*k.height+k.top}}function cs(){y&&y.dispose(),d.dispose();for(let N of _)N.obj.userData.dispose&&N.obj.userData.dispose(),N.obj.removeFromParent();[L,...Y].forEach(N=>N.dispose());for(let N in m)m[N].dispose();um(e)}return{update:ln,hero:d,screenOf:hs,dispose:cs,onContextRestored(){d.onContextRestored(),y&&y.onContextRestored()},heroObjs:[d.root,d.fx],get bottlesHome(){return c.bottles.every(N=>N.state==="home")},get happy(){return L.mode==="happy"||f.give&&f.give.happy},get customerWalking(){return L.walking},get label(){let N=d.getStats();return`${f.state} served ${f.served} stage ${N.stage} vol ${N.volume.toFixed(2)} cov ${N.coverage.toFixed(2)}`+(y?`  smooth ${y.ms.toFixed(2)}ms`:"")},get state(){return{state:f.state,served:f.served,stats:d.getStats(),toppings:A.length,shelf:_.length}}}}var _a=Math.PI/180;function Hr(e,t,i,r,a,n){let s=2/Math.max(1e-4,a),o=s*n,l=1/(1+o+.48*o*o+.235*o*o*o),h=e-t,c=(i[r]+s*h)*n;i[r]=(i[r]-s*c)*l;let u=t+(h+c)*l;return t-e>0==u>t&&(u=t,i[r]=0),u}function xm(e){let t={w:1,h:1,aspect:1,portrait:!1,safe:{l:0,r:0,t:0,b:0},tanShort:.3,tanX:.3,tanY:.3},i={fx:0,fy:.1,fz:0,dist:1,pitch:45*_a,yaw:0,ax:0,ay:0},r={fx:0,fy:0,fz:0,dist:0,pitch:0,yaw:0,ax:0,ay:0},a={...i},n=!0,s={shot:"",frac:0,goalFrac:0,dist:0,pitch:0},o=new R,l=new R,h=new R,c=new R;function u(b,_,M){t.w=Math.max(1,b),t.h=Math.max(1,_),t.aspect=t.w/t.h,t.portrait=t.aspect<1,M&&(t.safe=M);let E=Math.max(t.aspect,1/t.aspect),P=Math.tan(17*_a),I=Math.tan(29*_a);P*E>I&&(P=I/E),t.tanShort=P,t.tanY=t.portrait?P/t.aspect:P,t.tanX=t.tanY*t.aspect,e.fov=2*Math.atan(t.tanY)/_a,e.aspect=t.aspect,e.updateProjectionMatrix()}function p(b,_){let M=Math.cos(b),E=Math.sin(b),P=Math.cos(_),I=Math.sin(_);h.set(-I*M,-E,-P*M),o.set(P,0,-I),l.crossVectors(o,h)}let d={frac:0,cx:0,cy:0};function g(b,_,M,E,P,I,L,Y){p(L,Y);let D=1/0,B=-1/0,Z=1/0,V=-1/0;for(let pe=0;pe<_;pe++){let z=b[pe],W=z.x-M,Q=z.y-E,ve=z.z-P,$=Math.max(.02,I+W*h.x+Q*h.y+ve*h.z),he=(W*o.x+Q*o.y+ve*o.z)/$,Pe=(W*l.x+Q*l.y+ve*l.z)/$;he<D&&(D=he),he>B&&(B=he),Pe<Z&&(Z=Pe),Pe>V&&(V=Pe)}return d.frac=Math.max(B-D,V-Z)/(2*t.tanShort),d.cx=(D+B)/2,d.cy=(Z+V)/2,d}function y(b,_,M,E,P,I,L){for(let Y=0;Y<6;Y++){let D=g(b,_,M.x,M.y,M.z,L,P,I);L=Math.min(4,Math.max(.25,L*(D.frac/E)))}return L}function v(b,_){let M=_.pitch*_a,E=(_.yaw||0)*_a,P=_.focus,I=_.subN||_.n,L=y(_.pts,_.n,P,_.frac,M,E,a.dist>.05?a.dist:1),Y=!1;if(_.minFrac&&I<_.n){let z=y(_.pts,I,P,_.minFrac,M,E,L);z<L&&(L=z,Y=!0)}let D=g(_.pts,_.n,P.x,P.y,P.z,L,M,E),B=D.cx,Z=D.cy;if(Y){let z=g(_.pts,I,P.x,P.y,P.z,L,M,E),W=_.minFrac*t.tanShort,Q=Math.max(0,t.tanX-W)*(_.shiftX==null?.45:_.shiftX),ve=Math.max(0,t.tanY-W)*(_.shiftY==null?.45:_.shiftY);B=z.cx+Math.max(-Q,Math.min(Q,B-z.cx)),Z=z.cy+Math.max(-ve,Math.min(ve,Z-z.cy))}p(M,E),a.fx=P.x+(o.x*B+l.x*Z)*L,a.fy=P.y+(o.y*B+l.y*Z)*L,a.fz=P.z+(o.z*B+l.z*Z)*L,a.dist=L,a.pitch=M,a.yaw=E,a.ax=_.ax||0,a.ay=_.ay||0,s.shot=_.name,s.goalFrac=_.frac;let V=_.time||.6,pe=_.followTime||V*.6;if(n){Object.assign(i,a);for(let z in r)r[z]=0;n=!1}else i.fx=Hr(i.fx,a.fx,r,"fx",pe,b),i.fy=Hr(i.fy,a.fy,r,"fy",pe,b),i.fz=Hr(i.fz,a.fz,r,"fz",pe,b),i.dist=Hr(i.dist,a.dist,r,"dist",V,b),i.pitch=Hr(i.pitch,a.pitch,r,"pitch",V*1.1,b),i.yaw=Hr(i.yaw,a.yaw,r,"yaw",V*1.1,b),i.ax=Hr(i.ax,a.ax,r,"ax",V,b),i.ay=Hr(i.ay,a.ay,r,"ay",V,b);m(),s.frac=g(_.pts,I,i.fx,i.fy,i.fz,i.dist,i.pitch,i.yaw).frac,s.dist=i.dist,s.pitch=i.pitch/_a}function m(){p(i.pitch,i.yaw),e.position.set(i.fx-h.x*i.dist,i.fy-h.y*i.dist,i.fz-h.z*i.dist),e.up.set(0,1,0),e.lookAt(c.set(i.fx,i.fy,i.fz));let b=-i.ax*.5*t.w,_=i.ay*.5*t.h;Math.abs(b)>.01||Math.abs(_)>.01?e.setViewOffset(t.w,t.h,b,_,t.w,t.h):e.clearViewOffset(),e.updateMatrixWorld(!0)}let f=new as,S=new se,x=new Ri(new R(0,1,0),0);function A(b,_,M,E){return S.set(b/t.w*2-1,-(_/t.h)*2+1),f.setFromCamera(S,e),x.constant=-M,f.ray.intersectPlane(x,E)}return{view:t,info:s,update:v,setViewport:u,screenToPlane:A,snap(){n=!0}}}async function AM(e){let t=new URLSearchParams(location.search),i=fm(t.get("debug")==="1"),r=performance.now(),a=rm(),n=a.settings,s=document.getElementById("c"),o=new wc({canvas:s,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});o.outputColorSpace=Xt,o.toneMapping=Qn,o.toneMappingExposure=1,o.shadowMap.enabled=!1;let l=new ul,h=new Jt(34,1,.03,8),c=xm(h),u=1,p=document.getElementById("safe");function d(){if(!p)return{l:0,r:0,t:0,b:0};let z=getComputedStyle(p);return{l:parseFloat(z.paddingLeft)||0,r:parseFloat(z.paddingRight)||0,t:parseFloat(z.paddingTop)||0,b:parseFloat(z.paddingBottom)||0}}let g=0,y=0,v=0;function m(){let z=s.getBoundingClientRect(),W=Math.max(1,Math.round(z.width||window.innerWidth)),Q=Math.max(1,Math.round(z.height||window.innerHeight)),ve=n.pixelRatio;W*Q*ve*ve>n.maxPixels&&(ve=Math.sqrt(n.maxPixels/(W*Q))),ve*=u,(W!==g||Q!==y||ve!==v)&&(o.setPixelRatio(ve),o.setSize(W,Q,!1),g=W,y=Q,v=ve),c.setViewport(W,Q,d())}m();let f=!1,S=()=>{f||(f=!0,requestAnimationFrame(()=>{f=!1,m()}))};window.addEventListener("resize",S),window.addEventListener("orientationchange",()=>{S(),setTimeout(S,250)}),window.visualViewport&&(window.visualViewport.addEventListener("resize",S),window.visualViewport.addEventListener("scroll",S)),window.ResizeObserver&&new ResizeObserver(S).observe(s);let{textures:x,ready:A}=nm(o,z=>i.pushErr(z));await Promise.race([A,new Promise(z=>setTimeout(z,2500))]);let b=sm(),_=dm(l,x,b),M=pm(),E=ym({scene:l,camera:h,rig:c,renderer:o,world:_,createHero:e,tier:n.tier,textures:x,audio:M,debug:i}),P=!1;s.addEventListener("webglcontextlost",z=>{z.preventDefault(),P=!0,i.note("context lost")},!1),s.addEventListener("webglcontextrestored",()=>{P=!1,i.note("context restored"),l.traverse(z=>{let W=Array.isArray(z.material)?z.material:z.material?[z.material]:[];for(let Q of W){for(let ve in Q){let $=Q[ve];$&&$.isTexture&&($.needsUpdate=!0)}Q.needsUpdate=!0}});try{E.onContextRestored()}catch(z){i.pushErr(z.message)}m(),L=performance.now()},!1);let I=()=>({tier:n.tier,heroObjs:E.heroObjs,scene:E.label,readyMs:window.__kaki.readyMs,renderScale:u,cam:c.info,view:c.view}),L=performance.now(),Y=0,D=!1,B=0,Z=0,V=0;document.addEventListener("visibilitychange",()=>{D=document.hidden,L=performance.now(),D?M.suspend():M.resume()});function pe(z){if(requestAnimationFrame(pe),D||P){L=z;return}let W=(z-L)/1e3;L=z;let Q=Math.min(.05,Math.max(1e-4,W));try{E.update(Q),o.render(l,h)}catch(ve){i.pushErr(ve&&ve.message||ve),console.error(ve)}if(Y||(Y=performance.now(),document.body.classList.add("ready"),window.__kaki.readyMs=Y-r),i.frame(W,o,l,I),!a.forced&&u>.75&&z-Y>6e3&&(B+=W,V++,B>3)){let ve=V/B;Z=ve<35?Z+1:0,B=0,V=0,Z>=2&&(Z=0,u=u>.85?.85:.75,m(),i.note("renderScale\u2192"+u+" (fps "+ve.toFixed(0)+")"))}}window.__kaki={ready:!0,readyMs:0,game:E,renderer:o,scene:l,camera:h,rig:c,THREE:Ki,resize:m,screenOf:z=>E.screenOf(z),get state(){return E.state},get debug(){return i.stats},errors:i.errors},requestAnimationFrame(pe)}return wm(RM);})();
