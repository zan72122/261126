var KakigoriShell=(()=>{var fl=Object.defineProperty;var ym=Object.getOwnPropertyDescriptor;var xm=Object.getOwnPropertyNames;var Sm=Object.prototype.hasOwnProperty;var wc=(e,t)=>{for(var i in t)fl(e,i,{get:t[i],enumerable:!0})},Mm=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of xm(t))!Sm.call(e,a)&&a!==i&&fl(e,a,{get:()=>t[a],enumerable:!(r=ym(t,a))||r.enumerable});return e};var bm=e=>Mm(fl({},"__esModule",{value:!0}),e);var EM={};wc(EM,{start:()=>bM});var dr={};wc(dr,{ACESFilmicToneMapping:()=>xh,AddEquation:()=>Wr,AddOperation:()=>Cd,AdditiveAnimationBlendMode:()=>Ih,AdditiveBlending:()=>Mn,AgXToneMapping:()=>Mh,AlphaFormat:()=>Rh,AlwaysCompare:()=>Dh,AlwaysDepth:()=>qs,AlwaysStencilFunc:()=>Od,AmbientLight:()=>Ef,AnimationAction:()=>Uf,AnimationClip:()=>Fn,AnimationLoader:()=>mv,AnimationMixer:()=>Wv,AnimationObjectGroup:()=>Gv,AnimationUtils:()=>hv,ArcCurve:()=>Rp,ArrayCamera:()=>Pf,ArrowHelper:()=>g_,AttachedBindMode:()=>rh,Audio:()=>Df,AudioAnalyser:()=>Lv,AudioContext:()=>oc,AudioListener:()=>Cv,AudioLoader:()=>wv,AxesHelper:()=>v_,BackSide:()=>si,BasicDepthPacking:()=>Nd,BasicShadowMap:()=>Rm,BatchedMesh:()=>fp,BezierInterpolant:()=>_f,Bone:()=>zh,BooleanKeyframeTrack:()=>aa,Box2:()=>Bf,Box3:()=>ei,Box3Helper:()=>f_,BoxGeometry:()=>zt,BoxHelper:()=>p_,BufferAttribute:()=>Mt,BufferGeometry:()=>et,BufferGeometryLoader:()=>If,ByteType:()=>Eh,Cache:()=>Wi,Camera:()=>rl,CameraHelper:()=>d_,CanvasTexture:()=>Gh,CapsuleGeometry:()=>Ko,CatmullRomCurve3:()=>Cp,CineonToneMapping:()=>yh,CircleGeometry:()=>xp,ClampToEdgeWrapping:()=>Gt,Clock:()=>Kv,Color:()=>Ae,ColorKeyframeTrack:()=>ic,ColorManagement:()=>ot,Compatibility:()=>gg,CompressedArrayTexture:()=>A0,CompressedCubeTexture:()=>R0,CompressedTexture:()=>Jo,CompressedTextureLoader:()=>gv,ConeGeometry:()=>ra,ConstantAlphaFactor:()=>Td,ConstantColorFactor:()=>Ed,Controls:()=>y_,CubeCamera:()=>No,CubeDepthTexture:()=>Vh,CubeReflectionMapping:()=>or,CubeRefractionMapping:()=>Jr,CubeTexture:()=>Vn,CubeTextureLoader:()=>vv,CubicBezierCurve:()=>jh,CubicBezierCurve3:()=>Ip,CubicInterpolant:()=>gf,CullFaceBack:()=>eh,CullFaceFront:()=>ld,CullFaceFrontBack:()=>Am,CullFaceNone:()=>od,Curve:()=>Bi,CurvePath:()=>Lp,CustomBlending:()=>cd,CustomToneMapping:()=>Sh,CylinderGeometry:()=>Nt,Cylindrical:()=>Qv,Data3DTexture:()=>jo,DataArrayTexture:()=>Xo,DataTexture:()=>Mi,DataTextureLoader:()=>_v,DataUtils:()=>Qg,DecrementStencilOp:()=>qm,DecrementWrapStencilOp:()=>Zm,DefaultLoadingManager:()=>Sf,DepthFormat:()=>lr,DepthStencilFormat:()=>rr,DepthTexture:()=>ea,DetachedBindMode:()=>Id,DirectionalLight:()=>nl,DirectionalLightHelper:()=>u_,DiscreteInterpolant:()=>vf,DodecahedronGeometry:()=>wp,DoubleSide:()=>Si,DstAlphaFactor:()=>yd,DstColorFactor:()=>Sd,DynamicCopyUsage:()=>cg,DynamicDrawUsage:()=>ag,DynamicReadUsage:()=>og,EdgesGeometry:()=>Ap,EllipseCurve:()=>$o,EqualCompare:()=>zd,EqualDepth:()=>Zs,EqualStencilFunc:()=>Qm,EquirectangularReflectionMapping:()=>dn,EquirectangularRefractionMapping:()=>pn,Euler:()=>Oi,EventDispatcher:()=>Fi,ExternalTexture:()=>Wh,ExtrudeGeometry:()=>Bp,FileLoader:()=>ur,Float16BufferAttribute:()=>s0,Float32BufferAttribute:()=>De,FloatType:()=>ni,Fog:()=>rp,FogExp2:()=>tp,FramebufferTexture:()=>T0,FrontSide:()=>Sr,Frustum:()=>Qr,FrustumArray:()=>Hh,GLBufferAttribute:()=>Jv,GLSL1:()=>dg,GLSL3:()=>nh,GreaterCompare:()=>Hd,GreaterDepth:()=>Ks,GreaterEqualCompare:()=>Lh,GreaterEqualDepth:()=>Js,GreaterEqualStencilFunc:()=>rg,GreaterStencilFunc:()=>tg,GridHelper:()=>h_,Group:()=>Vt,HTMLTexture:()=>C0,HalfFloatType:()=>Ui,HemisphereLight:()=>tl,HemisphereLightHelper:()=>l_,IcosahedronGeometry:()=>Hp,ImageBitmapLoader:()=>Ev,ImageLoader:()=>Bn,ImageUtils:()=>Zd,IncrementStencilOp:()=>jm,IncrementWrapStencilOp:()=>Ym,InstancedBufferAttribute:()=>Ba,InstancedBufferGeometry:()=>Cf,InstancedInterleavedBuffer:()=>Zv,InstancedMesh:()=>ia,Int16BufferAttribute:()=>a0,Int32BufferAttribute:()=>n0,Int8BufferAttribute:()=>t0,IntType:()=>Oo,InterleavedBuffer:()=>Zo,InterleavedBufferAttribute:()=>Ln,Interpolant:()=>Wa,InterpolateBezier:()=>ah,InterpolateDiscrete:()=>Tn,InterpolateLinear:()=>Io,InterpolateSmooth:()=>Hs,InterpolationSamplingMode:()=>mg,InterpolationSamplingType:()=>fg,InvertStencilOp:()=>Jm,KeepStencilOp:()=>ks,KeyframeTrack:()=>wi,LOD:()=>hp,LatheGeometry:()=>Xn,Layers:()=>qo,LessCompare:()=>Bd,LessDepth:()=>Ys,LessEqualCompare:()=>Ph,LessEqualDepth:()=>Ua,LessEqualStencilFunc:()=>eg,LessStencilFunc:()=>$m,Light:()=>Ar,LightProbe:()=>Tf,LightShadow:()=>il,Line:()=>wr,Line3:()=>r_,LineBasicMaterial:()=>li,LineCurve:()=>qh,LineCurve3:()=>Pp,LineDashedMaterial:()=>pf,LineLoop:()=>mp,LineSegments:()=>ji,LinearFilter:()=>Et,LinearInterpolant:()=>tc,LinearMipMapLinearFilter:()=>Dm,LinearMipMapNearestFilter:()=>Lm,LinearMipmapLinearFilter:()=>Ni,LinearMipmapNearestFilter:()=>fn,LinearSRGBColorSpace:()=>Rn,LinearToneMapping:()=>vh,LinearTransfer:()=>Cn,Loader:()=>fi,LoaderUtils:()=>ch,LoadingManager:()=>ac,LoopOnce:()=>Pd,LoopPingPong:()=>Dd,LoopRepeat:()=>Ld,MOUSE:()=>wm,Material:()=>jt,MaterialBlending:()=>Cm,MaterialLoader:()=>Af,MathUtils:()=>Gn,Matrix2:()=>e_,Matrix3:()=>Qe,Matrix4:()=>Ye,MaxEquation:()=>fd,Mesh:()=>Xe,MeshBasicMaterial:()=>oi,MeshDepthMaterial:()=>Qh,MeshDistanceMaterial:()=>ec,MeshLambertMaterial:()=>Va,MeshMatcapMaterial:()=>df,MeshNormalMaterial:()=>uf,MeshPhongMaterial:()=>hf,MeshPhysicalMaterial:()=>lf,MeshStandardMaterial:()=>qt,MeshToonMaterial:()=>cf,MinEquation:()=>pd,MirroredRepeatWrapping:()=>bn,MixOperation:()=>Rd,MultiplyBlending:()=>ih,MultiplyOperation:()=>zn,NearestFilter:()=>Rt,NearestMipMapLinearFilter:()=>Pm,NearestMipMapNearestFilter:()=>Im,NearestMipmapLinearFilter:()=>Ia,NearestMipmapNearestFilter:()=>bh,NeutralToneMapping:()=>Hn,NeverCompare:()=>Fd,NeverDepth:()=>js,NeverStencilFunc:()=>Km,NoBlending:()=>Yr,NoColorSpace:()=>tr,NoNormalPacking:()=>km,NoToneMapping:()=>Xi,NormalAnimationBlendMode:()=>Go,NormalBlending:()=>Da,NormalGAPacking:()=>Vm,NormalRGPacking:()=>Gm,NotEqualCompare:()=>kd,NotEqualDepth:()=>$s,NotEqualStencilFunc:()=>ig,NumberKeyframeTrack:()=>Qo,Object3D:()=>mt,ObjectLoader:()=>Mv,ObjectSpaceNormalMap:()=>Ud,OctahedronGeometry:()=>Kh,OneFactor:()=>gd,OneMinusConstantAlphaFactor:()=>Ad,OneMinusConstantColorFactor:()=>wd,OneMinusDstAlphaFactor:()=>xd,OneMinusDstColorFactor:()=>Md,OneMinusSrcAlphaFactor:()=>gh,OneMinusSrcColorFactor:()=>_d,OrthographicCamera:()=>al,PCFShadowMap:()=>un,PCFSoftShadowMap:()=>hd,PMREMGenerator:()=>ph,Path:()=>Dn,PerspectiveCamera:()=>kt,Plane:()=>Pi,PlaneGeometry:()=>zi,PlaneHelper:()=>m_,PointLight:()=>bf,PointLightHelper:()=>s_,Points:()=>gp,PointsMaterial:()=>kh,PolarGridHelper:()=>c_,PolyhedronGeometry:()=>Ga,PositionalAudio:()=>Pv,PropertyBinding:()=>vt,PropertyMixer:()=>Nf,QuadraticBezierCurve:()=>Yh,QuadraticBezierCurve3:()=>Zh,Quaternion:()=>Ct,QuaternionKeyframeTrack:()=>el,QuaternionLinearInterpolant:()=>xf,R11_EAC_Format:()=>so,RED_GREEN_RGTC2_Format:()=>wn,RED_RGTC1_Format:()=>Ao,REVISION:()=>Em,RG11_EAC_Format:()=>En,RGBADepthPacking:()=>Bm,RGBAFormat:()=>pi,RGBAIntegerFormat:()=>ko,RGBA_ASTC_10x10_Format:()=>So,RGBA_ASTC_10x5_Format:()=>_o,RGBA_ASTC_10x6_Format:()=>yo,RGBA_ASTC_10x8_Format:()=>xo,RGBA_ASTC_12x10_Format:()=>Mo,RGBA_ASTC_12x12_Format:()=>bo,RGBA_ASTC_4x4_Format:()=>ho,RGBA_ASTC_5x4_Format:()=>co,RGBA_ASTC_5x5_Format:()=>uo,RGBA_ASTC_6x5_Format:()=>po,RGBA_ASTC_6x6_Format:()=>fo,RGBA_ASTC_8x5_Format:()=>mo,RGBA_ASTC_8x6_Format:()=>go,RGBA_ASTC_8x8_Format:()=>vo,RGBA_BPTC_Format:()=>Eo,RGBA_ETC2_EAC_Format:()=>no,RGBA_PVRTC_2BPPV1_Format:()=>io,RGBA_PVRTC_4BPPV1_Format:()=>to,RGBA_S3TC_DXT1_Format:()=>gn,RGBA_S3TC_DXT3_Format:()=>vn,RGBA_S3TC_DXT5_Format:()=>_n,RGBDepthPacking:()=>zm,RGBFormat:()=>Ch,RGBIntegerFormat:()=>Nm,RGB_BPTC_SIGNED_Format:()=>wo,RGB_BPTC_UNSIGNED_Format:()=>To,RGB_ETC1_Format:()=>ro,RGB_ETC2_Format:()=>ao,RGB_PVRTC_2BPPV1_Format:()=>eo,RGB_PVRTC_4BPPV1_Format:()=>Qs,RGB_S3TC_DXT1_Format:()=>mn,RGDepthPacking:()=>Hm,RGFormat:()=>br,RGIntegerFormat:()=>Ho,RawShaderMaterial:()=>$h,Ray:()=>ka,Raycaster:()=>cc,RectAreaLight:()=>wf,RedFormat:()=>zo,RedIntegerFormat:()=>kn,ReinhardToneMapping:()=>_h,RenderObjectRefreshType:()=>vg,RenderTarget:()=>Uh,RenderTarget3D:()=>Xv,RepeatWrapping:()=>Mr,ReplaceStencilOp:()=>Xm,ReverseSubtractEquation:()=>dd,RingGeometry:()=>Xp,SIGNED_R11_EAC_Format:()=>oo,SIGNED_RED_GREEN_RGTC2_Format:()=>Co,SIGNED_RED_RGTC1_Format:()=>Ro,SIGNED_RG11_EAC_Format:()=>lo,SRGBColorSpace:()=>Ut,SRGBTransfer:()=>ft,Scene:()=>Yo,ShaderChunk:()=>rt,ShaderLib:()=>Di,ShaderMaterial:()=>cr,ShadowMaterial:()=>nf,Shape:()=>Wn,ShapeGeometry:()=>qp,ShapePath:()=>__,ShapeUtils:()=>ar,ShortType:()=>wh,Skeleton:()=>up,SkeletonHelper:()=>n_,SkinnedMesh:()=>cp,Source:()=>kg,Sphere:()=>Xt,SphereGeometry:()=>hi,Spherical:()=>$v,SphericalHarmonics3:()=>sc,SplineCurve:()=>Jh,SpotLight:()=>Mf,SpotLightHelper:()=>a_,Sprite:()=>lp,SpriteMaterial:()=>Bh,SrcAlphaFactor:()=>mh,SrcAlphaSaturateFactor:()=>bd,SrcColorFactor:()=>vd,StaticCopyUsage:()=>hg,StaticDrawUsage:()=>Vo,StaticReadUsage:()=>sg,StereoCamera:()=>Tv,StreamCopyUsage:()=>ug,StreamDrawUsage:()=>ng,StreamReadUsage:()=>lg,StringKeyframeTrack:()=>na,SubtractEquation:()=>ud,SubtractiveBlending:()=>th,TOUCH:()=>Tm,TangentSpaceNormalMap:()=>hr,TetrahedronGeometry:()=>Jp,Texture:()=>Bt,TextureLoader:()=>nc,TextureSource:()=>Vi,TextureUtils:()=>E_,Timer:()=>Lf,TimestampQuery:()=>pg,TorusGeometry:()=>Tr,TorusKnotGeometry:()=>Qp,Triangle:()=>xr,TriangleFanDrawMode:()=>Fm,TriangleStripDrawMode:()=>Om,TrianglesDrawMode:()=>Um,TubeGeometry:()=>tf,UVMapping:()=>Uo,Uint16BufferAttribute:()=>Oh,Uint32BufferAttribute:()=>Fh,Uint8BufferAttribute:()=>i0,Uint8ClampedBufferAttribute:()=>r0,Uniform:()=>jv,UniformsGroup:()=>Yv,UniformsLib:()=>Ee,UniformsUtils:()=>of,UnsignedByteType:()=>di,UnsignedInt101111Type:()=>Ah,UnsignedInt248Type:()=>Kr,UnsignedInt5999Type:()=>Th,UnsignedIntType:()=>bi,UnsignedShort4444Type:()=>Fo,UnsignedShort5551Type:()=>Bo,UnsignedShortType:()=>Oa,VSMShadowMap:()=>Ca,Vector2:()=>ie,Vector3:()=>R,Vector4:()=>_t,VectorKeyframeTrack:()=>rc,VideoFrameTexture:()=>w0,VideoTexture:()=>vp,WebGL3DRenderTarget:()=>Wg,WebGLArrayRenderTarget:()=>Vg,WebGLCoordinateSystem:()=>_i,WebGLCubeRenderTarget:()=>sl,WebGLRenderTarget:()=>yi,WebGLRenderer:()=>uc,WebGLUtils:()=>Kf,WebGPUCoordinateSystem:()=>$r,WebXRController:()=>Ws,WireframeGeometry:()=>af,WrapAroundEnding:()=>An,ZeroCurvatureEnding:()=>Xr,ZeroFactor:()=>md,ZeroSlopeEnding:()=>jr,ZeroStencilOp:()=>Wm,createCanvasElement:()=>Vd,error:()=>ke,getConsoleFunction:()=>Sg,log:()=>Pn,setConsoleFunction:()=>xg,warn:()=>xe,warnOnce:()=>nr});var Em="187",wm={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Tm={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},od=0,eh=1,ld=2,Am=3,Rm=0,un=1,hd=2,Ca=3,Sr=0,si=1,Si=2,Yr=0,Da=1,Mn=2,th=3,ih=4,cd=5,Cm=6,Wr=100,ud=101,dd=102,pd=103,fd=104,md=200,gd=201,vd=202,_d=203,mh=204,gh=205,yd=206,xd=207,Sd=208,Md=209,bd=210,Ed=211,wd=212,Td=213,Ad=214,js=0,qs=1,Ys=2,Ua=3,Zs=4,Js=5,Ks=6,$s=7,zn=0,Rd=1,Cd=2,Xi=0,vh=1,_h=2,yh=3,xh=4,Sh=5,Mh=6,Hn=7,rh="attached",Id="detached",Uo=300,or=301,Jr=302,dn=303,pn=304,Mr=1e3,Gt=1001,bn=1002,Rt=1003,bh=1004,Im=1004,Ia=1005,Pm=1005,Et=1006,fn=1007,Lm=1007,Ni=1008,Dm=1008,di=1009,Eh=1010,wh=1011,Oa=1012,Oo=1013,bi=1014,ni=1015,Ui=1016,Fo=1017,Bo=1018,Kr=1020,Th=35902,Ah=35899,Rh=1021,Ch=1022,pi=1023,lr=1026,rr=1027,zo=1028,kn=1029,br=1030,Ho=1031,Nm=1032,ko=1033,mn=33776,gn=33777,vn=33778,_n=33779,Qs=35840,eo=35841,to=35842,io=35843,ro=36196,ao=37492,no=37496,so=37488,oo=37489,En=37490,lo=37491,ho=37808,co=37809,uo=37810,po=37811,fo=37812,mo=37813,go=37814,vo=37815,_o=37816,yo=37817,xo=37818,So=37819,Mo=37820,bo=37821,Eo=36492,wo=36494,To=36495,Ao=36283,Ro=36284,wn=36285,Co=36286,Pd=2200,Ld=2201,Dd=2202,Tn=2300,Io=2301,Hs=2302,ah=2303,Xr=2400,jr=2401,An=2402,Go=2500,Ih=2501,Um=0,Om=1,Fm=2,Nd=3200,Bm=3201,zm=3202,Hm=3203,hr=0,Ud=1,tr="",Ut="srgb",Rn="srgb-linear",Cn="linear",ft="srgb",km="",Gm="rg",Vm="ga",Wm=0,ks=7680,Xm=7681,jm=7682,qm=7683,Ym=34055,Zm=34056,Jm=5386,Km=512,$m=513,Qm=514,eg=515,tg=516,ig=517,rg=518,Od=519,Fd=512,Bd=513,zd=514,Ph=515,Hd=516,kd=517,Lh=518,Dh=519,Vo=35044,ag=35048,ng=35040,sg=35045,og=35049,lg=35041,hg=35046,cg=35050,ug=35042,dg="100",nh="300 es",_i=2e3,$r=2001,pg={COMPUTE:"compute",RENDER:"render"},fg={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},mg={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},gg={TEXTURE_COMPARE:"depthTextureCompare"},vg={NONE:0,SHARED:1,FULL:2};function _g(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}var yg={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Pa(e,t){return new yg[e](t)}function Gd(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function In(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function Vd(){let e=In("canvas");return e.style.display="block",e}var Tc={},Er=null;function xg(e){Er=e}function Sg(){return Er}function Pn(...e){let t="THREE."+e.shift();Er?Er("log",t,...e):console.log(t,...e)}function Wd(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let i=e[1];i&&i.isStackTrace?e[0]+=" "+i.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function xe(...e){e=Wd(e);let t="THREE."+e.shift();if(Er)Er("warn",t,...e);else{let i=e[0];i&&i.isStackTrace?console.warn(i.getError(t)):console.warn(t,...e)}}function ke(...e){e=Wd(e);let t="THREE."+e.shift();if(Er)Er("error",t,...e);else{let i=e[0];i&&i.isStackTrace?console.error(i.getError(t)):console.error(t,...e)}}function nr(...e){let t=e.join(" ");t in Tc||(Tc[t]=!0,xe(...e))}function Mg(e,t,i){return new Promise(function(r,a){function n(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(n,i);break;default:r()}}setTimeout(n,i)})}var bg={[js]:js,[Ys]:Ks,[Zs]:Zs,[Ua]:Js,[qs]:qs,[Ks]:Ys,[$s]:$s,[Js]:Ua},Fi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let a=0,n=r.length;a<n;a++)r[a].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ac=1234567,Zr=Math.PI/180,Fa=180/Math.PI;function Ei(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Jt[e&255]+Jt[e>>8&255]+Jt[e>>16&255]+Jt[e>>24&255]+"-"+Jt[t&255]+Jt[t>>8&255]+"-"+Jt[t>>16&15|64]+Jt[t>>24&255]+"-"+Jt[i&63|128]+Jt[i>>8&255]+"-"+Jt[i>>16&255]+Jt[i>>24&255]+Jt[r&255]+Jt[r>>8&255]+Jt[r>>16&255]+Jt[r>>24&255]).toLowerCase()}function Ze(e,t,i){return Math.max(t,Math.min(i,e))}function Nh(e,t){return(e%t+t)%t}function Eg(e,t,i,r,a){return r+(e-t)*(a-r)/(i-t)}function wg(e,t,i){return e!==t?(i-e)/(t-e):0}function yn(e,t,i){return(1-i)*e+i*t}function Tg(e,t,i,r){return yn(e,t,1-Math.exp(-i*r))}function Ag(e,t=1){return t-Math.abs(Nh(e,t*2)-t)}function Rg(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*(3-2*e))}function Cg(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*e*(e*(e*6-15)+10))}function Ig(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Pg(e,t){return e+Math.random()*(t-e)}function Lg(e){return e*(.5-Math.random())}function Dg(e){e!==void 0&&(Ac=e);let t=Ac+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ng(e){return e*Zr}function Ug(e){return e*Fa}function Og(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Fg(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function Xd(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function Bg(e,t,i,r,a){let n=Math.cos,s=Math.sin,o=n(i/2),l=s(i/2),h=n((t+r)/2),c=s((t+r)/2),u=n((t-r)/2),d=s((t-r)/2),p=n((r-t)/2),g=s((r-t)/2);switch(a){case"XYX":e.set(o*c,l*u,l*d,o*h);break;case"YZY":e.set(l*d,o*c,l*u,o*h);break;case"ZXZ":e.set(l*u,l*d,o*c,o*h);break;case"XZX":e.set(o*c,l*g,l*p,o*h);break;case"YXY":e.set(l*p,o*c,l*g,o*h);break;case"ZYZ":e.set(l*g,l*p,o*c,o*h);break;default:xe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Wo(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function qr(e,t){if(t.constructor===Float32Array)return e;let i=Wo(t);if(i===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(e/i,-1)}function Qt(e,t){if(t.constructor===Float32Array)return e;let i=Wo(t);if(i===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(e*i)}var Gn={DEG2RAD:Zr,RAD2DEG:Fa,generateUUID:Ei,clamp:Ze,euclideanModulo:Nh,mapLinear:Eg,inverseLerp:wg,lerp:yn,damp:Tg,pingpong:Ag,smoothstep:Rg,smootherstep:Cg,randInt:Ig,randFloat:Pg,randFloatSpread:Lg,seededRandom:Dg,degToRad:Ng,radToDeg:Ug,isPowerOfTwo:Og,ceilPowerOfTwo:Fg,floorPowerOfTwo:Xd,setQuaternionFromProperEuler:Bg,normalize:Qt,denormalize:qr},jd=class{constructor(t=0,i=0){this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let i=this.x,r=this.y,a=t.elements;return this.x=a[0]*i+a[3]*r+a[6],this.y=a[1]*i+a[4]*r+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=Ze(this.x,t.x,i.x),this.y=Ze(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=Ze(this.x,t,i),this.y=Ze(this.y,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(Ze(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(Ze(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y;return i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){let r=Math.cos(i),a=Math.sin(i),n=this.x-t.x,s=this.y-t.y;return this.x=n*r-s*a+t.x,this.y=n*a+s*r+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};jd.prototype.isVector2=!0;var ie=jd,Ct=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,a,n,s){let o=i[r+0],l=i[r+1],h=i[r+2],c=i[r+3],u=a[n+0],d=a[n+1],p=a[n+2],g=a[n+3];if(c!==g||o!==u||l!==d||h!==p){let v=o*u+l*d+h*p+c*g;v<0&&(u=-u,d=-d,p=-p,g=-g,v=-v);let f=1-s;if(v<.9995){let m=Math.acos(v),x=Math.sin(m);f=Math.sin(f*m)/x,s=Math.sin(s*m)/x,o=o*f+u*s,l=l*f+d*s,h=h*f+p*s,c=c*f+g*s}else{o=o*f+u*s,l=l*f+d*s,h=h*f+p*s,c=c*f+g*s;let m=1/Math.sqrt(o*o+l*l+h*h+c*c);o*=m,l*=m,h*=m,c*=m}}e[t]=o,e[t+1]=l,e[t+2]=h,e[t+3]=c}static multiplyQuaternionsFlat(e,t,i,r,a,n){let s=i[r],o=i[r+1],l=i[r+2],h=i[r+3],c=a[n],u=a[n+1],d=a[n+2],p=a[n+3];return e[t]=s*p+h*c+o*d-l*u,e[t+1]=o*p+h*u+l*c-s*d,e[t+2]=l*p+h*d+s*u-o*c,e[t+3]=h*p-s*c-o*u-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,a=e._z,n=e._order,s=Math.cos,o=Math.sin,l=s(i/2),h=s(r/2),c=s(a/2),u=o(i/2),d=o(r/2),p=o(a/2);switch(n){case"XYZ":this._x=u*h*c+l*d*p,this._y=l*d*c-u*h*p,this._z=l*h*p+u*d*c,this._w=l*h*c-u*d*p;break;case"YXZ":this._x=u*h*c+l*d*p,this._y=l*d*c-u*h*p,this._z=l*h*p-u*d*c,this._w=l*h*c+u*d*p;break;case"ZXY":this._x=u*h*c-l*d*p,this._y=l*d*c+u*h*p,this._z=l*h*p+u*d*c,this._w=l*h*c-u*d*p;break;case"ZYX":this._x=u*h*c-l*d*p,this._y=l*d*c+u*h*p,this._z=l*h*p-u*d*c,this._w=l*h*c+u*d*p;break;case"YZX":this._x=u*h*c+l*d*p,this._y=l*d*c+u*h*p,this._z=l*h*p-u*d*c,this._w=l*h*c-u*d*p;break;case"XZY":this._x=u*h*c-l*d*p,this._y=l*d*c-u*h*p,this._z=l*h*p+u*d*c,this._w=l*h*c+u*d*p;break;default:xe("Quaternion: .setFromEuler() encountered an unknown order: "+n)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10],u=i+s+c;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-o)*d,this._y=(a-l)*d,this._z=(n-r)*d}else if(i>s&&i>c){let d=2*Math.sqrt(1+i-s-c);this._w=(h-o)/d,this._x=.25*d,this._y=(r+n)/d,this._z=(a+l)/d}else if(s>c){let d=2*Math.sqrt(1+s-i-c);this._w=(a-l)/d,this._x=(r+n)/d,this._y=.25*d,this._z=(o+h)/d}else{let d=2*Math.sqrt(1+c-i-s);this._w=(n-r)/d,this._x=(a+l)/d,this._y=(o+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=t._x,o=t._y,l=t._z,h=t._w;return this._x=i*h+n*s+r*l-a*o,this._y=r*h+n*o+a*s-i*l,this._z=a*h+n*l+i*o-r*s,this._w=n*h-i*s-r*o-a*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=this.dot(e);s<0&&(i=-i,r=-r,a=-a,n=-n,s=-s);let o=1-t;if(s<.9995){let l=Math.acos(s),h=Math.sin(l);o=Math.sin(o*l)/h,t=Math.sin(t*l)/h,this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this._onChangeCallback()}else this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},qd=class{constructor(t=0,i=0,r=0){this.x=t,this.y=i,this.z=r}set(t,i,r){return r===void 0&&(r=this.z),this.x=t,this.y=i,this.z=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(Rc.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(Rc.setFromAxisAngle(t,i))}applyMatrix3(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[3]*r+n[6]*a,this.y=n[1]*i+n[4]*r+n[7]*a,this.z=n[2]*i+n[5]*r+n[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=t.elements,s=1/(n[3]*i+n[7]*r+n[11]*a+n[15]);return this.x=(n[0]*i+n[4]*r+n[8]*a+n[12])*s,this.y=(n[1]*i+n[5]*r+n[9]*a+n[13])*s,this.z=(n[2]*i+n[6]*r+n[10]*a+n[14])*s,this}applyQuaternion(t){let i=this.x,r=this.y,a=this.z,n=t.x,s=t.y,o=t.z,l=t.w,h=2*(s*a-o*r),c=2*(o*i-n*a),u=2*(n*r-s*i);return this.x=i+l*h+s*u-o*c,this.y=r+l*c+o*h-n*u,this.z=a+l*u+n*c-s*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[4]*r+n[8]*a,this.y=n[1]*i+n[5]*r+n[9]*a,this.z=n[2]*i+n[6]*r+n[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=Ze(this.x,t.x,i.x),this.y=Ze(this.y,t.y,i.y),this.z=Ze(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=Ze(this.x,t,i),this.y=Ze(this.y,t,i),this.z=Ze(this.z,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(Ze(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){let r=t.x,a=t.y,n=t.z,s=i.x,o=i.y,l=i.z;return this.x=a*l-n*o,this.y=n*s-r*l,this.z=r*o-a*s,this}projectOnVector(t){let i=t.lengthSq();if(i===0)return this.set(0,0,0);let r=t.dot(this)/i;return this.copy(t).multiplyScalar(r)}projectOnPlane(t){return ml.copy(this).projectOnVector(t),this.sub(ml)}reflect(t){return this.sub(ml.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(Ze(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y,a=this.z-t.z;return i*i+r*r+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,r){let a=Math.sin(i)*t;return this.x=a*Math.sin(r),this.y=Math.cos(i)*t,this.z=a*Math.cos(r),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,r){return this.x=t*Math.sin(i),this.y=r,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){let i=this.setFromMatrixColumn(t,0).length(),r=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=r,this.z=a,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(t),this.y=i,this.z=r*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};qd.prototype.isVector3=!0;var R=qd,ml=new R,Rc=new Ct,Yd=class{constructor(t,i,r,a,n,s,o,l,h){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h)}set(t,i,r,a,n,s,o,l,h){let c=this.elements;return c[0]=t,c[1]=a,c[2]=o,c[3]=i,c[4]=n,c[5]=l,c[6]=r,c[7]=s,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(t,i,r){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[3],l=r[6],h=r[1],c=r[4],u=r[7],d=r[2],p=r[5],g=r[8],v=a[0],f=a[3],m=a[6],x=a[1],S=a[4],_=a[7],E=a[2],A=a[5],y=a[8];return n[0]=s*v+o*x+l*E,n[3]=s*f+o*S+l*A,n[6]=s*m+o*_+l*y,n[1]=h*v+c*x+u*E,n[4]=h*f+c*S+u*A,n[7]=h*m+c*_+u*y,n[2]=d*v+p*x+g*E,n[5]=d*f+p*S+g*A,n[8]=d*m+p*_+g*y,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return i*s*c-i*o*h-r*n*c+r*o*l+a*n*h-a*s*l}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=c*s-o*h,d=o*l-c*n,p=h*n-s*l,g=i*u+r*d+a*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=u*v,t[1]=(a*h-c*r)*v,t[2]=(o*r-a*s)*v,t[3]=d*v,t[4]=(c*i-a*l)*v,t[5]=(a*n-o*i)*v,t[6]=p*v,t[7]=(r*l-h*i)*v,t[8]=(s*i-r*n)*v,this}transpose(){let t,i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,r,a,n,s,o){let l=Math.cos(n),h=Math.sin(n);return this.set(r*l,r*h,-r*(l*s+h*o)+s+t,-a*h,a*l,-a*(-h*s+l*o)+o+i,0,0,1),this}scale(t,i){return nr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(gl.makeScale(t,i)),this}rotate(t){return nr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(gl.makeRotation(-t)),this}translate(t,i){return nr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(gl.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<9;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<9;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Yd.prototype.isMatrix3=!0;var Qe=Yd,gl=new Qe,Cc=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ic=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zg(){let e={enabled:!0,workingColorSpace:Rn,spaces:{},convert:function(a,n,s){return this.enabled===!1||n===s||!n||!s||(this.spaces[n].transfer===ft&&(a.r=sr(a.r),a.g=sr(a.g),a.b=sr(a.b)),this.spaces[n].primaries!==this.spaces[s].primaries&&(a.applyMatrix3(this.spaces[n].toXYZ),a.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===ft&&(a.r=Na(a.r),a.g=Na(a.g),a.b=Na(a.b))),a},workingToColorSpace:function(a,n){return this.convert(a,this.workingColorSpace,n)},colorSpaceToWorking:function(a,n){return this.convert(a,n,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===tr?Cn:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,n=this.workingColorSpace){return a.fromArray(this.spaces[n].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,n,s){return a.copy(this.spaces[s].fromXYZ).multiply(this.spaces[n].toXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Rn]:{primaries:t,whitePoint:r,transfer:Cn,toXYZ:Cc,fromXYZ:Ic,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:t,whitePoint:r,transfer:ft,toXYZ:Cc,fromXYZ:Ic,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),e}var ot=zg();function sr(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Na(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var oa,Zd=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{oa===void 0&&(oa=In("canvas")),oa.width=e.width,oa.height=e.height;let r=oa.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=oa}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=In("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let n=0;n<a.length;n++)a[n]=sr(a[n]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(sr(t[i]/255)*255):t[i]=sr(t[i]);return{data:t,width:e.width,height:e.height}}else return xe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hg=0,Vi=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Hg++}),this.uuid=Ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let n=0,s=r.length;n<s;n++)r[n].isDataTexture?a.push(vl(r[n].image)):a.push(vl(r[n]))}else a=vl(r);i.url=a}return t||(e.images[this.uuid]=i),i}};function vl(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Zd.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(xe("Texture: Unable to serialize Texture."),{})}var kg=class extends Vi{constructor(e=null){nr('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(e),this.isSource=!0}},Gg=0,_l=new R,Bt=class Gs extends Fi{constructor(t=Gs.DEFAULT_IMAGE,i=Gs.DEFAULT_MAPPING,r=Gt,a=Gt,n=Et,s=Ni,o=pi,l=di,h=Gs.DEFAULT_ANISOTROPY,c=tr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gg++}),this.uuid=Ei(),this.name="",this.source=new Vi(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(_l).x}get height(){return this.source.getSize(_l).y}get depth(){return this.source.getSize(_l).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let i in t){let r=t[i];if(r===void 0){xe(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}let a=this[i];if(a===void 0){xe(`Texture.setValues(): property '${i}' does not exist.`);continue}a&&r&&a.isVector2&&r.isVector2||a&&r&&a.isVector3&&r.isVector3||a&&r&&a.isMatrix3&&r.isMatrix3?a.copy(r):this[i]=r}}toJSON(t){let i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(t.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Mr:t.x=t.x-Math.floor(t.x);break;case Gt:t.x=t.x<0?0:1;break;case bn:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Mr:t.y=t.y-Math.floor(t.y);break;case Gt:t.y=t.y<0?0:1;break;case bn:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Uo;Bt.DEFAULT_ANISOTROPY=1;var Jd=class{constructor(t=0,i=0,r=0,a=1){this.x=t,this.y=i,this.z=r,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,r,a){return this.x=t,this.y=i,this.z=r,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=this.w,s=t.elements;return this.x=s[0]*i+s[4]*r+s[8]*a+s[12]*n,this.y=s[1]*i+s[5]*r+s[9]*a+s[13]*n,this.z=s[2]*i+s[6]*r+s[10]*a+s[14]*n,this.w=s[3]*i+s[7]*r+s[11]*a+s[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,r,a,n,s=t.elements,o=s[0],l=s[4],h=s[8],c=s[1],u=s[5],d=s[9],p=s[2],g=s[6],v=s[10];if(Math.abs(l-c)<.01&&Math.abs(h-p)<.01&&Math.abs(d-g)<.01){if(Math.abs(l+c)<.1&&Math.abs(h+p)<.1&&Math.abs(d+g)<.1&&Math.abs(o+u+v-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;let m=(o+1)/2,x=(u+1)/2,S=(v+1)/2,_=(l+c)/4,E=(h+p)/4,A=(d+g)/4;return m>x&&m>S?m<.01?(r=0,a=.707106781,n=.707106781):(r=Math.sqrt(m),a=_/r,n=E/r):x>S?x<.01?(r=.707106781,a=0,n=.707106781):(a=Math.sqrt(x),r=_/a,n=A/a):S<.01?(r=.707106781,a=.707106781,n=0):(n=Math.sqrt(S),r=E/n,a=A/n),this.set(r,a,n,i),this}let f=Math.sqrt((g-d)*(g-d)+(h-p)*(h-p)+(c-l)*(c-l));return Math.abs(f)<.001&&(f=1),this.x=(g-d)/f,this.y=(h-p)/f,this.z=(c-l)/f,this.w=Math.acos((o+u+v-1)/2),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=Ze(this.x,t.x,i.x),this.y=Ze(this.y,t.y,i.y),this.z=Ze(this.z,t.z,i.z),this.w=Ze(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=Ze(this.x,t,i),this.y=Ze(this.y,t,i),this.z=Ze(this.z,t,i),this.w=Ze(this.w,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(Ze(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this.w=t.w+(i.w-t.w)*r,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Jd.prototype.isVector4=!0;var _t=Jd,Uh=class extends Fi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];let r=i.count;for(let a=0;a<r;a++)this.textures[a]=new Bt({width:e,height:t,depth:i.depth}),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Vi(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},yi=class extends Uh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Xo=class extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=Gt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Vg=class extends yi{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new Xo(null,e,t,i),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},jo=class extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=Gt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Wg=class extends yi{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isWebGL3DRenderTarget=!0,this.depth=i,this.texture=new jo(null,e,t,i),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},Kd=class $d{constructor(t,i,r,a,n,s,o,l,h,c,u,d,p,g,v,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h,c,u,d,p,g,v,f)}set(t,i,r,a,n,s,o,l,h,c,u,d,p,g,v,f){let m=this.elements;return m[0]=t,m[4]=i,m[8]=r,m[12]=a,m[1]=n,m[5]=s,m[9]=o,m[13]=l,m[2]=h,m[6]=c,m[10]=u,m[14]=d,m[3]=p,m[7]=g,m[11]=v,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $d().fromArray(this.elements)}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(t){let i=this.elements,r=t.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(t){let i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,r){return this.determinantAffine()===0?(t.set(1,0,0),i.set(0,1,0),r.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(t,i,r){return this.set(t.x,i.x,r.x,0,t.y,i.y,r.y,0,t.z,i.z,r.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let i=this.elements,r=t.elements,a=1/la.setFromMatrixColumn(t,0).length(),n=1/la.setFromMatrixColumn(t,1).length(),s=1/la.setFromMatrixColumn(t,2).length();return i[0]=r[0]*a,i[1]=r[1]*a,i[2]=r[2]*a,i[3]=0,i[4]=r[4]*n,i[5]=r[5]*n,i[6]=r[6]*n,i[7]=0,i[8]=r[8]*s,i[9]=r[9]*s,i[10]=r[10]*s,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){let i=this.elements,r=t.x,a=t.y,n=t.z,s=Math.cos(r),o=Math.sin(r),l=Math.cos(a),h=Math.sin(a),c=Math.cos(n),u=Math.sin(n);if(t.order==="XYZ"){let d=s*c,p=s*u,g=o*c,v=o*u;i[0]=l*c,i[4]=-l*u,i[8]=h,i[1]=p+g*h,i[5]=d-v*h,i[9]=-o*l,i[2]=v-d*h,i[6]=g+p*h,i[10]=s*l}else if(t.order==="YXZ"){let d=l*c,p=l*u,g=h*c,v=h*u;i[0]=d+v*o,i[4]=g*o-p,i[8]=s*h,i[1]=s*u,i[5]=s*c,i[9]=-o,i[2]=p*o-g,i[6]=v+d*o,i[10]=s*l}else if(t.order==="ZXY"){let d=l*c,p=l*u,g=h*c,v=h*u;i[0]=d-v*o,i[4]=-s*u,i[8]=g+p*o,i[1]=p+g*o,i[5]=s*c,i[9]=v-d*o,i[2]=-s*h,i[6]=o,i[10]=s*l}else if(t.order==="ZYX"){let d=s*c,p=s*u,g=o*c,v=o*u;i[0]=l*c,i[4]=g*h-p,i[8]=d*h+v,i[1]=l*u,i[5]=v*h+d,i[9]=p*h-g,i[2]=-h,i[6]=o*l,i[10]=s*l}else if(t.order==="YZX"){let d=s*l,p=s*h,g=o*l,v=o*h;i[0]=l*c,i[4]=v-d*u,i[8]=g*u+p,i[1]=u,i[5]=s*c,i[9]=-o*c,i[2]=-h*c,i[6]=p*u+g,i[10]=d-v*u}else if(t.order==="XZY"){let d=s*l,p=s*h,g=o*l,v=o*h;i[0]=l*c,i[4]=-u,i[8]=h*c,i[1]=d*u+v,i[5]=s*c,i[9]=p*u-g,i[2]=g*u-p,i[6]=o*c,i[10]=v*u+d}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xg,t,jg)}lookAt(t,i,r){let a=this.elements;return gi.subVectors(t,i),gi.lengthSq()===0&&(gi.z=1),gi.normalize(),fr.crossVectors(r,gi),fr.lengthSq()===0&&(Math.abs(r.z)===1?gi.x+=1e-4:gi.z+=1e-4,gi.normalize(),fr.crossVectors(r,gi)),fr.normalize(),Zn.crossVectors(gi,fr),a[0]=fr.x,a[4]=Zn.x,a[8]=gi.x,a[1]=fr.y,a[5]=Zn.y,a[9]=gi.y,a[2]=fr.z,a[6]=Zn.z,a[10]=gi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[4],l=r[8],h=r[12],c=r[1],u=r[5],d=r[9],p=r[13],g=r[2],v=r[6],f=r[10],m=r[14],x=r[3],S=r[7],_=r[11],E=r[15],A=a[0],y=a[4],M=a[8],w=a[12],L=a[1],N=a[5],k=a[9],q=a[13],P=a[2],B=a[6],Y=a[10],H=a[14],he=a[3],J=a[7],Z=a[11],re=a[15];return n[0]=s*A+o*L+l*P+h*he,n[4]=s*y+o*N+l*B+h*J,n[8]=s*M+o*k+l*Y+h*Z,n[12]=s*w+o*q+l*H+h*re,n[1]=c*A+u*L+d*P+p*he,n[5]=c*y+u*N+d*B+p*J,n[9]=c*M+u*k+d*Y+p*Z,n[13]=c*w+u*q+d*H+p*re,n[2]=g*A+v*L+f*P+m*he,n[6]=g*y+v*N+f*B+m*J,n[10]=g*M+v*k+f*Y+m*Z,n[14]=g*w+v*q+f*H+m*re,n[3]=x*A+S*L+_*P+E*he,n[7]=x*y+S*N+_*B+E*J,n[11]=x*M+S*k+_*Y+E*Z,n[15]=x*w+S*q+_*H+E*re,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[12],s=t[1],o=t[5],l=t[9],h=t[13],c=t[2],u=t[6],d=t[10],p=t[14],g=t[3],v=t[7],f=t[11],m=t[15],x=l*p-h*d,S=o*p-h*u,_=o*d-l*u,E=s*p-h*c,A=s*d-l*c,y=s*u-o*c;return i*(v*x-f*S+m*_)-r*(g*x-f*E+m*A)+a*(g*S-v*E+m*y)-n*(g*_-v*A+f*y)}determinantAffine(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10];return i*(s*c-o*h)-r*(n*c-o*l)+a*(n*h-s*l)}transpose(){let t=this.elements,i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,r){let a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=i,a[14]=r),this}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=t[9],d=t[10],p=t[11],g=t[12],v=t[13],f=t[14],m=t[15],x=i*o-r*s,S=i*l-a*s,_=i*h-n*s,E=r*l-a*o,A=r*h-n*o,y=a*h-n*l,M=c*v-u*g,w=c*f-d*g,L=c*m-p*g,N=u*f-d*v,k=u*m-p*v,q=d*m-p*f,P=x*q-S*k+_*N+E*L-A*w+y*M;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/P;return t[0]=(o*q-l*k+h*N)*B,t[1]=(a*k-r*q-n*N)*B,t[2]=(v*y-f*A+m*E)*B,t[3]=(d*A-u*y-p*E)*B,t[4]=(l*L-s*q-h*w)*B,t[5]=(i*q-a*L+n*w)*B,t[6]=(f*_-g*y-m*S)*B,t[7]=(c*y-d*_+p*S)*B,t[8]=(s*k-o*L+h*M)*B,t[9]=(r*L-i*k-n*M)*B,t[10]=(g*A-v*_+m*x)*B,t[11]=(u*_-c*A-p*x)*B,t[12]=(o*w-s*N-l*M)*B,t[13]=(i*N-r*w+a*M)*B,t[14]=(v*S-g*E-f*x)*B,t[15]=(c*E-u*S+d*x)*B,this}scale(t){let i=this.elements,r=t.x,a=t.y,n=t.z;return i[0]*=r,i[4]*=a,i[8]*=n,i[1]*=r,i[5]*=a,i[9]*=n,i[2]*=r,i[6]*=a,i[10]*=n,i[3]*=r,i[7]*=a,i[11]*=n,this}getMaxScaleOnAxis(){let t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,r,a))}makeTranslation(t,i,r){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(t){let i=Math.cos(t),r=Math.sin(t);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){let r=Math.cos(i),a=Math.sin(i),n=1-r,s=t.x,o=t.y,l=t.z,h=n*s,c=n*o;return this.set(h*s+r,h*o-a*l,h*l+a*o,0,h*o+a*l,c*o+r,c*l-a*s,0,h*l-a*o,c*l+a*s,n*l*l+r,0,0,0,0,1),this}makeScale(t,i,r){return this.set(t,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(t,i,r,a,n,s){return this.set(1,r,n,0,t,1,s,0,i,a,1,0,0,0,0,1),this}compose(t,i,r){let a=this.elements,n=i._x,s=i._y,o=i._z,l=i._w,h=n+n,c=s+s,u=o+o,d=n*h,p=n*c,g=n*u,v=s*c,f=s*u,m=o*u,x=l*h,S=l*c,_=l*u,E=r.x,A=r.y,y=r.z;return a[0]=(1-(v+m))*E,a[1]=(p+_)*E,a[2]=(g-S)*E,a[3]=0,a[4]=(p-_)*A,a[5]=(1-(d+m))*A,a[6]=(f+x)*A,a[7]=0,a[8]=(g+S)*y,a[9]=(f-x)*y,a[10]=(1-(d+v))*y,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,i,r){let a=this.elements;t.x=a[12],t.y=a[13],t.z=a[14];let n=this.determinantAffine();if(n===0)return r.set(1,1,1),i.identity(),this;let s=la.set(a[0],a[1],a[2]).length(),o=la.set(a[4],a[5],a[6]).length(),l=la.set(a[8],a[9],a[10]).length();n<0&&(s=-s),Ri.copy(this);let h=1/s,c=1/o,u=1/l;return Ri.elements[0]*=h,Ri.elements[1]*=h,Ri.elements[2]*=h,Ri.elements[4]*=c,Ri.elements[5]*=c,Ri.elements[6]*=c,Ri.elements[8]*=u,Ri.elements[9]*=u,Ri.elements[10]*=u,i.setFromRotationMatrix(Ri),r.x=s,r.y=o,r.z=l,this}makePerspective(t,i,r,a,n,s,o=_i,l=!1){let h=this.elements,c=2*n/(i-t),u=2*n/(r-a),d=(i+t)/(i-t),p=(r+a)/(r-a),g,v;if(l)g=n/(s-n),v=s*n/(s-n);else if(o===_i)g=-(s+n)/(s-n),v=-2*s*n/(s-n);else if(o===$r)g=-s/(s-n),v=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=g,h[14]=v,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,i,r,a,n,s,o=_i,l=!1){let h=this.elements,c=2/(i-t),u=2/(r-a),d=-(i+t)/(i-t),p=-(r+a)/(r-a),g,v;if(l)g=1/(s-n),v=s/(s-n);else if(o===_i)g=-2/(s-n),v=-(s+n)/(s-n);else if(o===$r)g=-1/(s-n),v=-n/(s-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=g,h[14]=v,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<16;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<16;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t[i+9]=r[9],t[i+10]=r[10],t[i+11]=r[11],t[i+12]=r[12],t[i+13]=r[13],t[i+14]=r[14],t[i+15]=r[15],t}};Kd.prototype.isMatrix4=!0;var Ye=Kd,la=new R,Ri=new Ye,Xg=new R(0,0,0),jg=new R(1,1,1),fr=new R,Zn=new R,gi=new R,Pc=new Ye,Lc=new Ct,Oi=class Qd{constructor(t=0,i=0,r=0,a=Qd.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=r,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,r,a=this._order){return this._x=t,this._y=i,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,r=!0){let a=t.elements,n=a[0],s=a[4],o=a[8],l=a[1],h=a[5],c=a[9],u=a[2],d=a[6],p=a[10];switch(i){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,n),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,h)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,h));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,n)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ze(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-c,p),this._y=0);break;default:xe("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,r){return Pc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Pc,i,r)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return Lc.setFromEuler(this),this.setFromQuaternion(Lc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Oi.DEFAULT_ORDER="XYZ";var qo=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},qg=0,Dc=new R,ha=new Ct,Zi=new Ye,Jn=new R,Za=new R,Yg=new R,Zg=new Ct,Nc=new R(1,0,0),Uc=new R(0,1,0),Oc=new R(0,0,1),Fc={type:"added"},Jg={type:"removed"},ca={type:"childadded",child:null},yl={type:"childremoved",child:null},mt=class Vs extends Fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vs.DEFAULT_UP.clone();let t=new R,i=new Oi,r=new Ct,a=new R(1,1,1);function n(){r.setFromEuler(i,!1)}function s(){i.setFromQuaternion(r,void 0,!1)}i._onChange(n),r._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ye},normalMatrix:{value:new Qe}}),this.matrix=new Ye,this.matrixWorld=new Ye,this.matrixAutoUpdate=Vs.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vs.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return ha.setFromAxisAngle(t,i),this.quaternion.multiply(ha),this}rotateOnWorldAxis(t,i){return ha.setFromAxisAngle(t,i),this.quaternion.premultiply(ha),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(Uc,t)}rotateZ(t){return this.rotateOnAxis(Oc,t)}translateOnAxis(t,i){return Dc.copy(t).applyQuaternion(this.quaternion),this.position.add(Dc.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(Uc,t)}translateZ(t){return this.translateOnAxis(Oc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Zi.copy(this.matrixWorld).invert())}lookAt(t,i,r){t.isVector3?Jn.copy(t):Jn.set(t,i,r);let a=this.parent;this.updateWorldMatrix(!0,!1),Za.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zi.lookAt(Za,Jn,this.up):Zi.lookAt(Jn,Za,this.up),this.quaternion.setFromRotationMatrix(Zi),a&&(Zi.extractRotation(a.matrixWorld),ha.setFromRotationMatrix(Zi),this.quaternion.premultiply(ha.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(ke("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Fc),ca.child=t,this.dispatchEvent(ca),ca.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}let i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(Jg),yl.child=t,this.dispatchEvent(yl),yl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Zi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Zi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Zi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Fc),ca.child=t,this.dispatchEvent(ca),ca.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let r=0,a=this.children.length;r<a;r++){let n=this.children[r].getObjectByProperty(t,i);if(n!==void 0)return n}}getObjectsByProperty(t,i,r=[]){this[t]===i&&r.push(this);let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(t,i,r);return r}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Za,t,Yg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Za,Zg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverseVisible(t)}traverseAncestors(t){let i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let i=t.x,r=t.y,a=t.z,n=this.matrix.elements;n[12]+=i-n[0]*i-n[4]*r-n[8]*a,n[13]+=r-n[1]*i-n[5]*r-n[9]*a,n[14]+=a-n[2]*i-n[6]*r-n[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateMatrixWorld(t)}updateWorldMatrix(t,i,r=!1){let a=this.parent;if(t===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||r)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,r=!0),i===!0){let n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].updateWorldMatrix(!1,!0,r)}}toJSON(t){let i=t===void 0||typeof t=="string",r={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(o=>({...o})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(t),a.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){let u=l[h];n(t.shapes,u)}else n(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(n(t.materials,this.material[l]));a.material=o}else a.material=n(t.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];a.animations.push(n(t.animations,l))}}if(i){let o=s(t.geometries),l=s(t.materials),h=s(t.textures),c=s(t.images),u=s(t.shapes),d=s(t.skeletons),p=s(t.animations),g=s(t.nodes);o.length>0&&(r.geometries=o),l.length>0&&(r.materials=l),h.length>0&&(r.textures=h),c.length>0&&(r.images=c),u.length>0&&(r.shapes=u),d.length>0&&(r.skeletons=d),p.length>0&&(r.animations=p),g.length>0&&(r.nodes=g)}return r.object=a,r;function s(o){let l=[];for(let h in o){let c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let r=0;r<t.children.length;r++){let a=t.children[r];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};mt.DEFAULT_UP=new R(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Vt=class extends mt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Kg={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,a=null,n=null,s=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){n=!0;for(let g of e.hand.values()){let v=t.getJointPose(g,i),f=this._getHandJoint(l,g);v!==null&&(f.matrix.fromArray(v.transform.matrix),f.matrix.decompose(f.position,f.quaternion,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=v.radius),f.visible=v!==null}let h=l.joints["index-finger-tip"],c=l.joints["thumb-tip"],u=h.position.distanceTo(c.position),d=.02,p=.005;l.inputState.pinching&&u>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,o.eventsEnabled&&o.dispatchEvent({type:"gripUpdated",data:e,target:this})));s!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(s.matrix.fromArray(r.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,r.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(r.linearVelocity)):s.hasLinearVelocity=!1,r.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(r.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(Kg)))}return s!==null&&(s.visible=r!==null),o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Vt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},ep={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},Kn={h:0,s:0,l:0};function xl(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+(t-e)*6*i:i<1/2?t:i<2/3?e+(t-e)*6*(2/3-i):e}var Ae=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ot.workingColorSpace){return this.r=e,this.g=t,this.b=i,ot.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ot.workingColorSpace){if(e=Nh(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+t):i+t-i*t,n=2*i-a;this.r=xl(n,a,e+1/3),this.g=xl(n,a,e),this.b=xl(n,a,e-1/3)}return ot.colorSpaceToWorking(this,r),this}setStyle(e,t=Ut){function i(a){a!==void 0&&parseFloat(a)<1&&xe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,n=r[1],s=r[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(100,parseFloat(a[1]))/100,Math.min(100,parseFloat(a[2]))/100,Math.min(100,parseFloat(a[3]))/100,t);break;case"hsl":case"hsla":if(a=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(s))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:xe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=r[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(n===6)return this.setHex(parseInt(a,16),t);xe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){let i=ep[e.toLowerCase()];return i!==void 0?this.setHex(i,t):xe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=sr(e.r),this.g=sr(e.g),this.b=sr(e.b),this}copyLinearToSRGB(e){return this.r=Na(e.r),this.g=Na(e.g),this.b=Na(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return ot.workingToColorSpace(Kt.copy(this),e),Math.round(Ze(Kt.r*255,0,255))*65536+Math.round(Ze(Kt.g*255,0,255))*256+Math.round(Ze(Kt.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(Kt.copy(this),t);let i=Kt.r,r=Kt.g,a=Kt.b,n=Math.max(i,r,a),s=Math.min(i,r,a),o,l,h=(s+n)/2;if(s===n)o=0,l=0;else{let c=n-s;switch(l=h<=.5?c/(n+s):c/(2-n-s),n){case i:o=(r-a)/c+(r<a?6:0);break;case r:o=(a-i)/c+2;break;case a:o=(i-r)/c+4;break}o/=6}return e.h=o,e.s=l,e.l=h,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=Ut){ot.workingToColorSpace(Kt.copy(this),e);let t=Kt.r,i=Kt.g,r=Kt.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+t,mr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(mr),e.getHSL(Kn);let i=yn(mr.h,Kn.h,t),r=yn(mr.s,Kn.s,t),a=yn(mr.l,Kn.l,t);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*r,this.g=a[1]*t+a[4]*i+a[7]*r,this.b=a[2]*t+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new Ae;Ae.NAMES=ep;var tp=class ip{constructor(t,i=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ae(t),this.density=i}clone(){return new ip(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},rp=class ap{constructor(t,i=1,r=1e3){this.isFog=!0,this.name="",this.color=new Ae(t),this.near=i,this.far=r}clone(){return new ap(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Yo=class extends mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Oi,this.environmentIntensity=1,this.environmentRotation=new Oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ci=new R,Ji=new R,Sl=new R,Ki=new R,ua=new R,da=new R,Bc=new R,Ml=new R,bl=new R,El=new R,wl=new _t,Tl=new _t,Al=new _t,xr=class Aa{constructor(t=new R,i=new R,r=new R){this.a=t,this.b=i,this.c=r}static getNormal(t,i,r,a){a.subVectors(r,i),Ci.subVectors(t,i),a.cross(Ci);let n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(t,i,r,a,n){Ci.subVectors(a,i),Ji.subVectors(r,i),Sl.subVectors(t,i);let s=Ci.dot(Ci),o=Ci.dot(Ji),l=Ci.dot(Sl),h=Ji.dot(Ji),c=Ji.dot(Sl),u=s*h-o*o;if(u===0)return n.set(0,0,0),null;let d=1/u,p=(h*l-o*c)*d,g=(s*c-o*l)*d;return n.set(1-p-g,g,p)}static containsPoint(t,i,r,a){return this.getBarycoord(t,i,r,a,Ki)===null?!1:Ki.x>=0&&Ki.y>=0&&Ki.x+Ki.y<=1}static getInterpolation(t,i,r,a,n,s,o,l){return this.getBarycoord(t,i,r,a,Ki)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Ki.x),l.addScaledVector(s,Ki.y),l.addScaledVector(o,Ki.z),l)}static getInterpolatedAttribute(t,i,r,a,n,s){return wl.setScalar(0),Tl.setScalar(0),Al.setScalar(0),wl.fromBufferAttribute(t,i),Tl.fromBufferAttribute(t,r),Al.fromBufferAttribute(t,a),s.setScalar(0),s.addScaledVector(wl,n.x),s.addScaledVector(Tl,n.y),s.addScaledVector(Al,n.z),s}static isFrontFacing(t,i,r,a){return Ci.subVectors(r,i),Ji.subVectors(t,i),Ci.cross(Ji).dot(a)<0}set(t,i,r){return this.a.copy(t),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(t,i,r,a){return this.a.copy(t[i]),this.b.copy(t[r]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,i,r,a){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,r),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ci.subVectors(this.c,this.b),Ji.subVectors(this.a,this.b),Ci.cross(Ji).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Aa.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Aa.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,r,a,n){return Aa.getInterpolation(t,this.a,this.b,this.c,i,r,a,n)}containsPoint(t){return Aa.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Aa.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){let r=this.a,a=this.b,n=this.c,s,o;ua.subVectors(a,r),da.subVectors(n,r),Ml.subVectors(t,r);let l=ua.dot(Ml),h=da.dot(Ml);if(l<=0&&h<=0)return i.copy(r);bl.subVectors(t,a);let c=ua.dot(bl),u=da.dot(bl);if(c>=0&&u<=c)return i.copy(a);let d=l*u-c*h;if(d<=0&&l>=0&&c<=0&&l-c>0)return s=l/(l-c),i.copy(r).addScaledVector(ua,s);El.subVectors(t,n);let p=ua.dot(El),g=da.dot(El);if(g>=0&&p<=g)return i.copy(n);let v=p*h-l*g;if(v<=0&&h>=0&&g<=0)return o=h/(h-g),i.copy(r).addScaledVector(da,o);let f=c*g-p*u;if(f<=0&&u-c>=0&&p-g>=0)return Bc.subVectors(n,a),o=(u-c)/(u-c+(p-g)),i.copy(a).addScaledVector(Bc,o);let m=1/(f+v+d);return s=v*m,o=d*m,i.copy(r).addScaledVector(ua,s).addScaledVector(da,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ei=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let n=0,s=a.count;n<s;n++)e.isMesh===!0?e.getVertexPosition(n,Ii):Ii.fromBufferAttribute(a,n),Ii.applyMatrix4(e.matrixWorld),this.expandByPoint(Ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$n.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),$n.copy(i.boundingBox)),$n.applyMatrix4(e.matrixWorld),this.union($n)}let r=e.children;for(let a=0,n=r.length;a<n;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ii),Ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ja),Qn.subVectors(this.max,Ja),pa.subVectors(e.a,Ja),fa.subVectors(e.b,Ja),ma.subVectors(e.c,Ja),gr.subVectors(fa,pa),vr.subVectors(ma,fa),Dr.subVectors(pa,ma);let t=[0,-gr.z,gr.y,0,-vr.z,vr.y,0,-Dr.z,Dr.y,gr.z,0,-gr.x,vr.z,0,-vr.x,Dr.z,0,-Dr.x,-gr.y,gr.x,0,-vr.y,vr.x,0,-Dr.y,Dr.x,0];return!Rl(t,pa,fa,ma,Qn)||(t=[1,0,0,0,1,0,0,0,1],!Rl(t,pa,fa,ma,Qn))?!1:(es.crossVectors(gr,vr),t=[es.x,es.y,es.z],Rl(t,pa,fa,ma,Qn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$i=[new R,new R,new R,new R,new R,new R,new R,new R],Ii=new R,$n=new ei,pa=new R,fa=new R,ma=new R,gr=new R,vr=new R,Dr=new R,Ja=new R,Qn=new R,es=new R,Nr=new R;function Rl(e,t,i,r,a){for(let n=0,s=e.length-3;n<=s;n+=3){Nr.fromArray(e,n);let o=a.x*Math.abs(Nr.x)+a.y*Math.abs(Nr.y)+a.z*Math.abs(Nr.z),l=t.dot(Nr),h=i.dot(Nr),c=r.dot(Nr);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}var ir=$g();function $g(){let e=new ArrayBuffer(4),t=new Float32Array(e),i=new Uint32Array(e),r=new Uint32Array(512),a=new Uint32Array(512);for(let l=0;l<256;++l){let h=l-127;h<-27?(r[l]=0,r[l|256]=32768,a[l]=24,a[l|256]=24):h<-14?(r[l]=1024>>-h-14,r[l|256]=1024>>-h-14|32768,a[l]=-h-1,a[l|256]=-h-1):h<=15?(r[l]=h+15<<10,r[l|256]=h+15<<10|32768,a[l]=13,a[l|256]=13):h<128?(r[l]=31744,r[l|256]=64512,a[l]=24,a[l|256]=24):(r[l]=31744,r[l|256]=64512,a[l]=13,a[l|256]=13)}let n=new Uint32Array(2048),s=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let h=l<<13,c=0;for(;(h&8388608)===0;)h<<=1,c-=8388608;h&=-8388609,c+=947912704,n[l]=h|c}for(let l=1024;l<2048;++l)n[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)s[l]=l<<23;s[31]=1199570944,s[32]=2147483648;for(let l=33;l<63;++l)s[l]=2147483648+(l-32<<23);s[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:i,baseTable:r,shiftTable:a,mantissaTable:n,exponentTable:s,offsetTable:o}}function ui(e){Math.abs(e)>65504&&xe("DataUtils.toHalfFloat(): Value out of range."),e=Ze(e,-65504,65504),ir.floatView[0]=e;let t=ir.uint32View[0],i=t>>23&511;return ir.baseTable[i]+((t&8388607)>>ir.shiftTable[i])}function ln(e){let t=e>>10;return ir.uint32View[0]=ir.mantissaTable[ir.offsetTable[t]+(e&1023)]+ir.exponentTable[t],ir.floatView[0]}var Qg=class{static toHalfFloat(e){return ui(e)}static fromHalfFloat(e){return ln(e)}},Dt=new R,ts=new ie,e0=0,Mt=class extends Fi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:e0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Vo,this.updateRanges=[],this.gpuType=ni,this.version=0,this._normalizationScale=e!==void 0?Wo(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ts.fromBufferAttribute(this,t),ts.applyMatrix3(e),this.setXY(t,ts.x,ts.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),r=this._normalize(r),a=this._normalize(a)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):qr(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Qt(e,this.array)}},t0=class extends Mt{constructor(e,t,i){super(new Int8Array(e),t,i)}},i0=class extends Mt{constructor(e,t,i){super(new Uint8Array(e),t,i)}},r0=class extends Mt{constructor(e,t,i){super(new Uint8ClampedArray(e),t,i)}},a0=class extends Mt{constructor(e,t,i){super(new Int16Array(e),t,i)}},Oh=class extends Mt{constructor(e,t,i){super(new Uint16Array(e),t,i)}},n0=class extends Mt{constructor(e,t,i){super(new Int32Array(e),t,i)}},Fh=class extends Mt{constructor(e,t,i){super(new Uint32Array(e),t,i)}},s0=class extends Mt{constructor(e,t,i){super(new Uint16Array(e),t,i),this.isFloat16BufferAttribute=!0}getX(e){let t=ln(this.array[e*this.itemSize]);return this.normalized&&(t=qr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize]=ui(t),this}getY(e){let t=ln(this.array[e*this.itemSize+1]);return this.normalized&&(t=qr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+1]=ui(t),this}getZ(e){let t=ln(this.array[e*this.itemSize+2]);return this.normalized&&(t=qr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+2]=ui(t),this}getW(e){let t=ln(this.array[e*this.itemSize+3]);return this.normalized&&(t=qr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+3]=ui(t),this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array)),this.array[e+0]=ui(t),this.array[e+1]=ui(i),this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[e+0]=ui(t),this.array[e+1]=ui(i),this.array[e+2]=ui(r),this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),r=Qt(r,this.array),a=Qt(a,this.array)),this.array[e+0]=ui(t),this.array[e+1]=ui(i),this.array[e+2]=ui(r),this.array[e+3]=ui(a),this}},De=class extends Mt{constructor(e,t,i){super(new Float32Array(e),t,i)}},o0=new ei,Ka=new R,Cl=new R,Xt=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):o0.setFromPoints(e).getCenter(i);let r=0;for(let a=0,n=e.length;a<n;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ka.subVectors(e,this.center);let t=Ka.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ka,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ka.copy(e.center).add(Cl)),this.expandByPoint(Ka.copy(e.center).sub(Cl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},l0=0,xi=new Ye,Il=new mt,ga=new R,vi=new ei,$a=new ei,Ht=new R,et=class np extends Fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_g(t)?Fh:Oh)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,r=0){this.groups.push({start:t,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){let i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);let r=this.attributes.normal;if(r!==void 0){let n=new Qe().getNormalMatrix(t);r.applyNormalMatrix(n),r.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return xi.makeRotationFromQuaternion(t),this.applyMatrix4(xi),this}rotateX(t){return xi.makeRotationX(t),this.applyMatrix4(xi),this}rotateY(t){return xi.makeRotationY(t),this.applyMatrix4(xi),this}rotateZ(t){return xi.makeRotationZ(t),this.applyMatrix4(xi),this}translate(t,i,r){return xi.makeTranslation(t,i,r),this.applyMatrix4(xi),this}scale(t,i,r){return xi.makeScale(t,i,r),this.applyMatrix4(xi),this}lookAt(t){return Il.lookAt(t),Il.updateMatrix(),this.applyMatrix4(Il.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ga).negate(),this.translate(ga.x,ga.y,ga.z),this}setFromPoints(t){let i=this.getAttribute("position");if(i===void 0){let r=[];for(let a=0,n=t.length;a<n;a++){let s=t[a];r.push(s.x,s.y,s.z||0)}this.setAttribute("position",new De(r,3))}else{let r=Math.min(t.length,i.count);for(let a=0;a<r;a++){let n=t[a];i.setXYZ(a,n.x,n.y,n.z||0)}t.length>i.count&&xe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ei);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let r=0,a=i.length;r<a;r++){let n=i[r];vi.setFromBufferAttribute(n),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,vi.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,vi.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(vi.min),this.boundingBox.expandByPoint(vi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xt);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let r=this.boundingSphere.center;if(vi.setFromBufferAttribute(t),i)for(let n=0,s=i.length;n<s;n++){let o=i[n];$a.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(vi.min,$a.min),vi.expandByPoint(Ht),Ht.addVectors(vi.max,$a.max),vi.expandByPoint(Ht)):(vi.expandByPoint($a.min),vi.expandByPoint($a.max))}vi.getCenter(r);let a=0;for(let n=0,s=t.count;n<s;n++)Ht.fromBufferAttribute(t,n),a=Math.max(a,r.distanceToSquared(Ht));if(i)for(let n=0,s=i.length;n<s;n++){let o=i[n],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Ht.fromBufferAttribute(o,h),l&&(ga.fromBufferAttribute(t,h),Ht.add(ga)),a=Math.max(a,r.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let r=i.position,a=i.normal,n=i.uv,s=this.getAttribute("tangent");(s===void 0||s.count!==r.count)&&(s=new Mt(new Float32Array(4*r.count),4),this.setAttribute("tangent",s));let o=[],l=[],h=new Uint8Array(r.count);for(let w=0;w<r.count;w++)o[w]=new R,l[w]=new R;let c=new R,u=new R,d=new R,p=new ie,g=new ie,v=new ie,f=new R,m=new R;function x(w,L,N){h[w]=h[L]=h[N]=1,c.fromBufferAttribute(r,w),u.fromBufferAttribute(r,L),d.fromBufferAttribute(r,N),p.fromBufferAttribute(n,w),g.fromBufferAttribute(n,L),v.fromBufferAttribute(n,N),u.sub(c),d.sub(c),g.sub(p),v.sub(p);let k=1/(g.x*v.y-v.x*g.y);isFinite(k)&&(f.copy(u).multiplyScalar(v.y).addScaledVector(d,-g.y).multiplyScalar(k),m.copy(d).multiplyScalar(g.x).addScaledVector(u,-v.x).multiplyScalar(k),o[w].add(f),o[L].add(f),o[N].add(f),l[w].add(m),l[L].add(m),l[N].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let w=0,L=S.length;w<L;++w){let N=S[w],k=N.start,q=N.count;for(let P=k,B=k+q;P<B;P+=3)x(t.getX(P+0),t.getX(P+1),t.getX(P+2))}let _=new R,E=new R,A=new R,y=new R;function M(w){A.fromBufferAttribute(a,w),y.copy(A);let L=o[w];_.copy(L),_.sub(A.multiplyScalar(A.dot(L))).normalize(),E.crossVectors(y,L);let N=E.dot(l[w])<0?-1:1;s.setXYZW(w,_.x,_.y,_.z,N)}for(let w=0,L=r.count;w<L;++w)h[w]&&M(w);this._transformed=!0}computeVertexNormals(){let t=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0||r.count!==i.count)r=new Mt(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let d=0,p=r.count;d<p;d++)r.setXYZ(d,0,0,0);let a=new R,n=new R,s=new R,o=new R,l=new R,h=new R,c=new R,u=new R;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),v=t.getX(d+1),f=t.getX(d+2);a.fromBufferAttribute(i,g),n.fromBufferAttribute(i,v),s.fromBufferAttribute(i,f),c.subVectors(s,n),u.subVectors(a,n),c.cross(u),o.fromBufferAttribute(r,g),l.fromBufferAttribute(r,v),h.fromBufferAttribute(r,f),o.add(c),l.add(c),h.add(c),r.setXYZ(g,o.x,o.y,o.z),r.setXYZ(v,l.x,l.y,l.z),r.setXYZ(f,h.x,h.y,h.z)}else for(let d=0,p=i.count;d<p;d+=3)a.fromBufferAttribute(i,d+0),n.fromBufferAttribute(i,d+1),s.fromBufferAttribute(i,d+2),c.subVectors(s,n),u.subVectors(a,n),c.cross(u),r.setXYZ(d+0,c.x,c.y,c.z),r.setXYZ(d+1,c.x,c.y,c.z),r.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let i=0,r=t.count;i<r;i++)Ht.fromBufferAttribute(t,i),Ht.normalize(),t.setXYZ(i,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function t(o,l){let h=o.array,c=o.itemSize,u=o.normalized,d=new h.constructor(l.length*c),p=0,g=0;for(let v=0,f=l.length;v<f;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*c;for(let m=0;m<c;m++)d[g++]=h[p++]}return new Mt(d,c,u)}if(this.index===null)return xe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let i=new np,r=this.index.array,a=this.attributes;for(let o in a){let l=a[o],h=t(l,r);i.setAttribute(o,h)}let n=this.morphAttributes;for(let o in n){let l=[],h=n[o];for(let c=0,u=h.length;c<u;c++){let d=h[c],p=t(d,r);l.push(p)}i.morphAttributes[o]=l}i.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let o=0,l=s.length;o<l;o++){let h=s[o];i.addGroup(h.start,h.count,h.materialIndex)}return i}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});let r=this.attributes;for(let l in r){let h=r[l];t.data.attributes[l]=h.toJSON(t.data)}let a={},n=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],c=[];for(let u=0,d=h.length;u<d;u++){let p=h[u];c.push(p.toJSON(t.data))}c.length>0&&(a[l]=c,n=!0)}n&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let i={};this.name=t.name;let r=t.index;r!==null&&this.setIndex(r.clone());let a=t.attributes;for(let h in a){let c=a[h];this.setAttribute(h,c.clone(i))}let n=t.morphAttributes;for(let h in n){let c=[],u=n[h];for(let d=0,p=u.length;d<p;d++)c.push(u[d].clone(i));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;let s=t.groups;for(let h=0,c=s.length;h<c;h++){let u=s[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Vo,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,a=this.stride;r<a;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=zc(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=zc(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}};function zc(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=Ei()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+":"+e.byteOffset+":"+e.byteLength}var ri=new R,Ln=class sp{constructor(t,i,r,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=i,this.offset=r,this.normalized=a,this._normalizationScale=t!==void 0?Wo(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let i=0,r=this.data.count;i<r;i++)ri.fromBufferAttribute(this,i),ri.applyMatrix4(t),this.setXYZ(i,ri.x,ri.y,ri.z);return this}applyNormalMatrix(t){for(let i=0,r=this.count;i<r;i++)ri.fromBufferAttribute(this,i),ri.applyNormalMatrix(t),this.setXYZ(i,ri.x,ri.y,ri.z);return this}transformDirection(t){for(let i=0,r=this.count;i<r;i++)ri.fromBufferAttribute(this,i),ri.transformDirection(t),this.setXYZ(i,ri.x,ri.y,ri.z);return this}getComponent(t,i){let r=this.array[t*this.data.stride+this.offset+i];return this.normalized&&(r=this._denormalize(r)),r}setComponent(t,i,r){return this.normalized&&(r=this._normalize(r)),this.data.array[t*this.data.stride+this.offset+i]=r,this}setX(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset]=i,this}setY(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+1]=i,this}setZ(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+2]=i,this}setW(t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[t*this.data.stride+this.offset+3]=i,this}getX(t){let i=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(i=this._denormalize(i)),i}getY(t){let i=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(i=this._denormalize(i)),i}getZ(t){let i=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(i=this._denormalize(i)),i}getW(t){let i=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(i=this._denormalize(i)),i}setXY(t,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r)),this.data.array[t+0]=i,this.data.array[t+1]=r,this}setXYZ(t,i,r,a){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r),a=this._normalize(a)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this}setXYZW(t,i,r,a,n){return t=t*this.data.stride+this.offset,this.normalized&&(i=this._normalize(i),r=this._normalize(r),a=this._normalize(a),n=this._normalize(n)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this.data.array[t+3]=n,this}clone(t){if(t===void 0){Pn("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return new Mt(new this.array.constructor(i),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new sp(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Pn("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:i,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){let i=this._normalizationScale;return i!==void 0?Math.max(t/i,-1):qr(t,this.data.array)}_normalize(t){let i=this._normalizationScale;return i!==void 0?Math.round(t*i):Qt(t,this.data.array)}},Pl=new R,h0=new R,c0=new Qe,Pi=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=Pl.subVectors(i,t).cross(h0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(Pl),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let n=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(n<0||n>1)?null:t.copy(e.start).addScaledVector(r,n)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||c0.getNormalMatrix(e),r=this.coplanarPoint(Pl).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},u0=0,jt=class extends Fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=Da,this.side=Sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mh,this.blendDst=gh,this.blendEquation=Wr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=Ua,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Od,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ks,this.stencilZFail=ks,this.stencilZPass=ks,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){xe(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){xe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){let n=[];for(let s in a){let o=a[s];delete o.metadata,n.push(o)}return n}if(t){let a=r(e.textures),n=r(e.images);a.length>0&&(i.textures=a),n.length>0&&(i.images=n)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ae().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Pi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ie().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ie().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Bh=class extends jt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},va,Qa=new R,_a=new R,ya=new R,xa=new ie,en=new ie,op=new Ye,is=new R,tn=new R,rs=new R,Hc=new ie,Ll=new ie,kc=new ie,lp=class extends mt{constructor(e=new Bh){if(super(),this.isSprite=!0,this.type="Sprite",va===void 0){va=new et;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Zo(t,5);va.setIndex([0,1,2,0,2,3]),va.setAttribute("position",new Ln(i,3,0,!1)),va.setAttribute("uv",new Ln(i,2,3,!1))}this.geometry=va,this.material=e,this.center=new ie(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&ke('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_a.setFromMatrixScale(this.matrixWorld),op.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ya.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_a.multiplyScalar(-ya.z);let i=this.material.rotation,r,a;i!==0&&(a=Math.cos(i),r=Math.sin(i));let n=this.center;as(is.set(-.5,-.5,0),ya,n,_a,r,a),as(tn.set(.5,-.5,0),ya,n,_a,r,a),as(rs.set(.5,.5,0),ya,n,_a,r,a),Hc.set(0,0),Ll.set(1,0),kc.set(1,1);let s=e.ray.intersectTriangle(is,tn,rs,!1,Qa);if(s===null&&(as(tn.set(-.5,.5,0),ya,n,_a,r,a),Ll.set(0,1),s=e.ray.intersectTriangle(is,rs,tn,!1,Qa),s===null))return;let o=e.ray.origin.distanceTo(Qa);o<e.near||o>e.far||t.push({distance:o,point:Qa.clone(),uv:xr.getInterpolation(Qa,is,tn,rs,Hc,Ll,kc,new ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function as(e,t,i,r,a,n){xa.subVectors(e,i).addScalar(.5).multiply(r),a!==void 0?(en.x=n*xa.x-a*xa.y,en.y=a*xa.x+n*xa.y):en.copy(xa),e.copy(t),e.x+=en.x,e.y+=en.y,e.applyMatrix4(op)}var ns=new R,Gc=new R,hp=class extends mt{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let i=0,r=t.length;i<r;i++){let a=t[i];this.addLevel(a.object.clone(),a.distance,a.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,i=0){t=Math.abs(t);let r=this.levels,a;for(a=0;a<r.length&&!(t<r[a].distance);a++);return r.splice(a,0,{distance:t,hysteresis:i,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let i=0;i<t.length;i++)if(t[i].distance===e){let r=t.splice(i,1);return this.remove(r[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let i,r;for(i=1,r=t.length;i<r;i++){let a=t[i].distance;if(t[i].object.visible&&(a-=a*t[i].hysteresis),e<a)break}return t[i-1].object}return null}raycast(e,t){if(this.levels.length>0){ns.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(ns);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){ns.setFromMatrixPosition(e.matrixWorld),Gc.setFromMatrixPosition(this.matrixWorld);let i=ns.distanceTo(Gc)/e.zoom;t[0].object.visible=!0;let r,a;for(r=1,a=t.length;r<a;r++){let n=t[r].distance;if(t[r].object.visible&&(n-=n*t[r].hysteresis),i>=n)t[r-1].object.visible=!1,t[r].object.visible=!0;else break}for(this._currentLevel=r-1;r<a;r++)t[r].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let i=this.levels;for(let r=0,a=i.length;r<a;r++){let n=i[r];t.object.levels.push({object:n.object.uuid,distance:n.distance,hysteresis:n.hysteresis})}return t}},Qi=new R,Dl=new R,ss=new R,os=new R,ka=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qi.copy(this.origin).addScaledVector(this.direction,t),Qi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Dl.copy(e).add(t).multiplyScalar(.5),ss.copy(t).sub(e).normalize(),os.copy(this.origin).sub(Dl);let a=e.distanceTo(t)*.5,n=-this.direction.dot(ss),s=os.dot(this.direction),o=-os.dot(ss),l=os.lengthSq(),h=Math.abs(1-n*n),c,u,d,p;if(h>0)if(c=n*o-s,u=n*s-o,p=a*h,c>=0)if(u>=-p)if(u<=p){let g=1/h;c*=g,u*=g,d=c*(c+n*u+2*s)+u*(n*c+u+2*o)+l}else u=a,c=Math.max(0,-(n*u+s)),d=-c*c+u*(u+2*o)+l;else u=-a,c=Math.max(0,-(n*u+s)),d=-c*c+u*(u+2*o)+l;else u<=-p?(c=Math.max(0,-(-n*a+s)),u=c>0?-a:Math.min(Math.max(-a,-o),a),d=-c*c+u*(u+2*o)+l):u<=p?(c=0,u=Math.min(Math.max(-a,-o),a),d=u*(u+2*o)+l):(c=Math.max(0,-(n*a+s)),u=c>0?a:Math.min(Math.max(-a,-o),a),d=-c*c+u*(u+2*o)+l);else u=n>0?-a:a,c=Math.max(0,-(n*u+s)),d=-c*c+u*(u+2*o)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,c),r&&r.copy(Dl).addScaledVector(ss,u),d}intersectSphere(e,t){if(e.radius<0)return null;Qi.subVectors(e.center,this.origin);let i=Qi.dot(this.direction),r=Qi.dot(Qi)-i*i,a=e.radius*e.radius;if(r>a)return null;let n=Math.sqrt(a-r),s=i-n,o=i+n;return o<0?null:s<0?this.at(o,t):this.at(s,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,a,n,s,o,l=1/this.direction.x,h=1/this.direction.y,c=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),h>=0?(a=(e.min.y-u.y)*h,n=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,n=(e.min.y-u.y)*h),i>n||a>r||((a>i||isNaN(i))&&(i=a),(n<r||isNaN(r))&&(r=n),c>=0?(s=(e.min.z-u.z)*c,o=(e.max.z-u.z)*c):(s=(e.max.z-u.z)*c,o=(e.min.z-u.z)*c),i>o||s>r)||((s>i||i!==i)&&(i=s),(o<r||r!==r)&&(r=o),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Qi)!==null}intersectTriangle(e,t,i,r,a){let n=this.origin,s=this.direction,o=s.x,l=s.y,h=s.z,c=e.x-n.x,u=e.y-n.y,d=e.z-n.z,p=t.x-n.x,g=t.y-n.y,v=t.z-n.z,f=i.x-n.x,m=i.y-n.y,x=i.z-n.z,S=Math.abs(o),_=Math.abs(l),E=Math.abs(h),A,y,M,w,L,N,k,q,P,B,Y,H;if(S>=_&&S>=E?(M=o,N=c,P=p,H=f,o>=0?(A=l,y=h,w=u,L=d,k=g,q=v,B=m,Y=x):(A=h,y=l,w=d,L=u,k=v,q=g,B=x,Y=m)):_>=E?(M=l,N=u,P=g,H=m,l>=0?(A=h,y=o,w=d,L=c,k=v,q=p,B=x,Y=f):(A=o,y=h,w=c,L=d,k=p,q=v,B=f,Y=x)):(M=h,N=d,P=v,H=x,h>=0?(A=o,y=l,w=c,L=u,k=p,q=g,B=f,Y=m):(A=l,y=o,w=u,L=c,k=g,q=p,B=m,Y=f)),M===0)return null;let he=A/M,J=y/M,Z=1/M,re=w-he*N,Ie=L-J*N,ee=k-he*P,ne=q-J*P,we=B-he*H,Pe=Y-J*H,Oe=we*ne-Pe*ee,fe=re*Pe-Ie*we,Ge=ee*Ie-ne*re;if(r){if(Oe<0||fe<0||Ge<0)return null}else if((Oe<0||fe<0||Ge<0)&&(Oe>0||fe>0||Ge>0))return null;let tt=Oe+fe+Ge;if(tt===0)return null;let Le=Z*(Oe*N+fe*P+Ge*H);return(tt>0?Le<0:Le>0)?null:this.at(Le/tt,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},oi=class extends jt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.combine=zn,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Vc=new Ye,Ur=new ka,ls=new Xt,Wc=new R,hs=new R,cs=new R,us=new R,Nl=new R,ds=new R,Xc=new R,ps=new R,Xe=class extends mt{constructor(e=new et,t=new oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,n=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let s=this.morphTargetInfluences;if(a&&s){ds.set(0,0,0);for(let o=0,l=a.length;o<l;o++){let h=s[o],c=a[o];h!==0&&(Nl.fromBufferAttribute(c,e),n?ds.addScaledVector(Nl,h):ds.addScaledVector(Nl.sub(t),h))}t.add(ds)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ls.copy(i.boundingSphere),ls.applyMatrix4(a),Ur.copy(e.ray).recast(e.near),!(ls.containsPoint(Ur.origin)===!1&&(Ur.intersectSphere(ls,Wc)===null||Ur.origin.distanceToSquared(Wc)>(e.far-e.near)**2))&&(Vc.copy(a).invert(),Ur.copy(e.ray).applyMatrix4(Vc),!(i.boundingBox!==null&&Ur.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ur)))}_computeIntersections(e,t,i){let r,a=this.geometry,n=this.material,s=a.index,o=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,c=a.attributes.normal,u=a.groups,d=a.drawRange;if(s!==null)if(Array.isArray(n))for(let p=0,g=u.length;p<g;p++){let v=u[p],f=n[v.materialIndex],m=Math.max(v.start,d.start),x=Math.min(s.count,Math.min(v.start+v.count,d.start+d.count));for(let S=m,_=x;S<_;S+=3){let E=s.getX(S),A=s.getX(S+1),y=s.getX(S+2);r=fs(this,f,e,i,l,h,c,E,A,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=v.materialIndex,t.push(r))}}else{let p=Math.max(0,d.start),g=Math.min(s.count,d.start+d.count);for(let v=p,f=g;v<f;v+=3){let m=s.getX(v),x=s.getX(v+1),S=s.getX(v+2);r=fs(this,n,e,i,l,h,c,m,x,S),r&&(r.faceIndex=Math.floor(v/3),t.push(r))}}else if(o!==void 0)if(Array.isArray(n))for(let p=0,g=u.length;p<g;p++){let v=u[p],f=n[v.materialIndex],m=Math.max(v.start,d.start),x=Math.min(o.count,Math.min(v.start+v.count,d.start+d.count));for(let S=m,_=x;S<_;S+=3){let E=S,A=S+1,y=S+2;r=fs(this,f,e,i,l,h,c,E,A,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=v.materialIndex,t.push(r))}}else{let p=Math.max(0,d.start),g=Math.min(o.count,d.start+d.count);for(let v=p,f=g;v<f;v+=3){let m=v,x=v+1,S=v+2;r=fs(this,n,e,i,l,h,c,m,x,S),r&&(r.faceIndex=Math.floor(v/3),t.push(r))}}}};function d0(e,t,i,r,a,n,s,o){let l;if(t.side===si?l=r.intersectTriangle(s,n,a,!0,o):l=r.intersectTriangle(a,n,s,t.side===Sr,o),l===null)return null;ps.copy(o),ps.applyMatrix4(e.matrixWorld);let h=i.ray.origin.distanceTo(ps);return h<i.near||h>i.far?null:{distance:h,point:ps.clone(),object:e}}function fs(e,t,i,r,a,n,s,o,l,h){e.getVertexPosition(o,hs),e.getVertexPosition(l,cs),e.getVertexPosition(h,us);let c=d0(e,t,i,r,hs,cs,us,Xc);if(c){let u=new R;xr.getBarycoord(Xc,hs,cs,us,u),a&&(c.uv=xr.getInterpolatedAttribute(a,o,l,h,u,new ie)),n&&(c.uv1=xr.getInterpolatedAttribute(n,o,l,h,u,new ie)),s&&(c.normal=xr.getInterpolatedAttribute(s,o,l,h,u,new R),c.normal.dot(r.direction)>0&&c.normal.multiplyScalar(-1));let d={a:o,b:l,c:h,normal:new R,materialIndex:0};xr.getNormal(hs,cs,us,d.normal),c.face=d,c.barycoord=u}return c}var rn=new _t,jc=new _t,qc=new _t,p0=new _t,Yc=new Ye,ms=new R,Ul=new Xt,Zc=new Ye,Ol=new ka,cp=class extends Xe{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=rh,this.bindMatrix=new Ye,this.bindMatrixInverse=new Ye,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ei),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,ms),this.boundingBox.expandByPoint(ms)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Xt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,ms),this.boundingSphere.expandByPoint(ms)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ul.copy(this.boundingSphere),Ul.applyMatrix4(r),e.ray.intersectsSphere(Ul)!==!1&&(Zc.copy(r).invert(),Ol.copy(e.ray).applyMatrix4(Zc),!(this.boundingBox!==null&&Ol.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ol)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new _t,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);let a=1/e.manhattanLength();a!==1/0?e.multiplyScalar(a):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===rh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Id?this.bindMatrixInverse.copy(this.bindMatrix).invert():xe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,r=this.geometry;jc.fromBufferAttribute(r.attributes.skinIndex,e),qc.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(rn.copy(t),t.set(0,0,0,0)):(rn.set(t.x,t.y,t.z,1),t.set(0,0,0)),rn.applyMatrix4(this.bindMatrix);for(let a=0;a<4;a++){let n=qc.getComponent(a);if(n!==0){let s=jc.getComponent(a);Yc.multiplyMatrices(i.bones[s].matrixWorld,i.boneInverses[s]),t.addScaledVector(p0.copy(rn).applyMatrix4(Yc),n)}}return t.isVector4&&(t.w=rn.w),t.applyMatrix4(this.bindMatrixInverse)}},zh=class extends mt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Mi=class extends Bt{constructor(e=null,t=1,i=1,r,a,n,s,o,l=Rt,h=Rt,c,u){super(null,n,s,o,l,h,r,a,c,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Jc=new Ye,f0=new Ye,up=class dp{constructor(t=[],i=[]){this.uuid=Ei(),this.bones=t.slice(0),this.boneInverses=i,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let t=this.bones,i=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),i.length===0)this.calculateInverses();else if(t.length!==i.length){xe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let r=0,a=this.bones.length;r<a;r++)this.boneInverses.push(new Ye)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,i=this.bones.length;t<i;t++){let r=new Ye;this.bones[t]&&r.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(r)}}pose(){for(let t=0,i=this.bones.length;t<i;t++){let r=this.bones[t];r&&r.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,i=this.bones.length;t<i;t++){let r=this.bones[t];r&&(r.parent&&r.parent.isBone?(r.matrix.copy(r.parent.matrixWorld).invert(),r.matrix.multiply(r.matrixWorld)):r.matrix.copy(r.matrixWorld),r.matrix.decompose(r.position,r.quaternion,r.scale))}}update(){let t=this.bones,i=this.boneInverses,r=this.boneMatrices,a=this.boneTexture;for(let n=0,s=t.length;n<s;n++){let o=t[n]?t[n].matrixWorld:f0;Jc.multiplyMatrices(o,i[n]),Jc.toArray(r,n*16)}a!==null&&(a.needsUpdate=!0)}clone(){return new dp(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let i=new Float32Array(t*t*4);i.set(this.boneMatrices);let r=new Mi(i,t,t,pi,ni);return r.needsUpdate=!0,this.boneMatrices=i,this.boneTexture=r,this}getBoneByName(t){for(let i=0,r=this.bones.length;i<r;i++){let a=this.bones[i];if(a.name===t)return a}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,i){this.uuid=t.uuid;for(let r=0,a=t.bones.length;r<a;r++){let n=t.bones[r],s=i[n];s===void 0&&(xe("Skeleton: No bone found with UUID:",n),s=new zh),this.bones.push(s),this.boneInverses.push(new Ye().fromArray(t.boneInverses[r]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let i=this.bones,r=this.boneInverses;for(let a=0,n=i.length;a<n;a++){let s=i[a];t.bones.push(s.uuid);let o=r[a];t.boneInverses.push(o.toArray())}return t}},Ba=class extends Mt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Sa=new Ye,Kc=new Ye,gs=[],$c=new ei,m0=new Ye,an=new Xe,nn=new Xt,ia=class extends Xe{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ba(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,m0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ei),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sa),$c.copy(e.boundingBox).applyMatrix4(Sa),this.boundingBox.union($c)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Xt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Sa),nn.copy(e.boundingSphere).applyMatrix4(Sa),this.boundingSphere.union(nn)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,a=i.length+1,n=e*a+1;for(let s=0;s<i.length;s++)i[s]=r[n+s]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(an.geometry=this.geometry,an.material=this.material,an.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nn.copy(this.boundingSphere),nn.applyMatrix4(i),e.ray.intersectsSphere(nn)!==!1))for(let a=0;a<r;a++){this.getMatrixAt(a,Sa),Kc.multiplyMatrices(i,Sa),an.matrixWorld=Kc,an.raycast(e,gs);for(let n=0,s=gs.length;n<s;n++){let o=gs[n];o.instanceId=a,o.object=this,t.push(o)}gs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ba(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Mi(new Float32Array(r*this.count),r,this.count,zo,ni));let a=this.morphTexture.source.data.data,n=0;for(let l=0;l<i.length;l++)n+=i[l];let s=this.geometry.morphTargetsRelative?1:1-n,o=r*e;return a[o]=s,a.set(i,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Or=new Xt,g0=new ie(.5,.5),vs=new R,Qr=class{constructor(e=new Pi,t=new Pi,i=new Pi,r=new Pi,a=new Pi,n=new Pi){this.planes=[e,t,i,r,a,n]}set(e,t,i,r,a,n){let s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(i),s[3].copy(r),s[4].copy(a),s[5].copy(n),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_i,i=!1){let r=this.planes,a=e.elements,n=a[0],s=a[1],o=a[2],l=a[3],h=a[4],c=a[5],u=a[6],d=a[7],p=a[8],g=a[9],v=a[10],f=a[11],m=a[12],x=a[13],S=a[14],_=a[15];if(r[0].setComponents(l-n,d-h,f-p,_-m).normalize(),r[1].setComponents(l+n,d+h,f+p,_+m).normalize(),r[2].setComponents(l+s,d+c,f+g,_+x).normalize(),r[3].setComponents(l-s,d-c,f-g,_-x).normalize(),i)r[4].setComponents(o,u,v,S).normalize(),r[5].setComponents(l-o,d-u,f-v,_-S).normalize();else if(r[4].setComponents(l-o,d-u,f-v,_-S).normalize(),t===_i)r[5].setComponents(l+o,d+u,f+v,_+S).normalize();else if(t===$r)r[5].setComponents(o,u,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Or.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Or.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Or)}intersectsSprite(e){Or.center.set(0,0,0);let t=g0.distanceTo(e.center);return Or.radius=.7071067811865476+t,Or.applyMatrix4(e.matrixWorld),this.intersectsSphere(Or)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(vs.x=r.normal.x>0?e.max.x:e.min.x,vs.y=r.normal.y>0?e.max.y:e.min.y,vs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(vs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Qc=new Ye,Hh=class pp{constructor(){this.coordinateSystem=_i,this._frustums=[],this._count=0}setFromArrayCamera(t){let i=t.cameras,r=this._frustums;for(let a=0;a<i.length;a++){let n=i[a];Qc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),r[a]===void 0&&(r[a]=new Qr),r[a].setFromProjectionMatrix(Qc,n.coordinateSystem,n.reversedDepth)}return this._count=i.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsObject(t))return!0;return!1}intersectsSprite(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSphere(t))return!0;return!1}intersectsBox(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsBox(t))return!0;return!1}containsPoint(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let i=this._frustums,r=t._frustums;for(let a=0;a<t._count;a++)i[a]===void 0&&(i[a]=new Qr),i[a].copy(r[a]);return this._count=t._count,this}clone(){return new pp().copy(this)}};function Fl(e,t){return e-t}function v0(e,t){return e.z-t.z}function _0(e,t){return t.z-e.z}var y0=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,r){let a=this.pool,n=this.list;this.index>=a.length&&a.push({start:-1,count:-1,z:-1,index:-1});let s=a[this.index];n.push(s),this.index++,s.start=e,s.count=t,s.z=i,s.index=r}reset(){this.list.length=0,this.index=0}},ci=new Ye,x0=new Ae(1,1,1),S0=new Qr,M0=new Hh,_s=new ei,Fr=new Xt,Bl=new R,eu=new R,tu=new R,b0=new R,zl=new y0,$t=new Xe,ys=[];function E0(e,t,i=0){let r=t.itemSize;if(e.isInterleavedBufferAttribute||e.array.constructor!==t.array.constructor){let a=e.count;for(let n=0;n<a;n++)for(let s=0;s<r;s++)t.setComponent(n+i,s,e.getComponent(n,s))}else t.array.set(e.array,i*r);t.needsUpdate=!0}function Hi(e,t){if(e.constructor!==t.constructor){let i=Math.min(e.length,t.length);for(let r=0;r<i;r++)t[r]=e[r]}else{let i=Math.min(e.length,t.length);t.set(new e.constructor(e.buffer,0,i))}}var fp=class extends Xe{constructor(e,t,i=t*2,r){super(new et,r),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=i,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._mergedDrawCounts=new Int32Array(e),this._mergedDrawStarts=new Int32Array(e),this._mergedDrawInstanceCounts=new Int32Array(e),this._mergedDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._previousMatricesTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),i=new Mi(t,e,e,pi,ni);this._matricesTexture=i}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),i=new Mi(t,e,e,kn,bi);this._indirectTexture=i}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),i=new Mi(t,e,e,pi,ni);i.colorSpace=ot.workingColorSpace,this._colorsTexture=i}_initializeGeometry(e){let t=this.geometry,i=this._maxVertexCount,r=this._maxIndexCount;if(this._geometryInitialized===!1){for(let a in e.attributes){let n=e.getAttribute(a),{array:s,itemSize:o,normalized:l}=n,h=new s.constructor(i*o),c=new Mt(h,o,l);t.setAttribute(a,c)}if(e.getIndex()!==null){let a=i>65535?new Uint32Array(r):new Uint16Array(r);t.setIndex(new Mt(a,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let i in t.attributes){if(!e.hasAttribute(i))throw new Error(`THREE.BatchedMesh: Added geometry missing "${i}". All geometries must have consistent attributes.`);let r=e.getAttribute(i),a=t.getAttribute(i);if(r.itemSize!==a.itemSize||r.normalized!==a.normalized)throw new Error(`THREE.BatchedMesh: Added geometry attribute "${i}" has an inconsistent itemSize or normalized value.`)}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ei);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let i=0,r=t.length;i<r;i++){if(t[i].active===!1)continue;let a=t[i].geometryIndex;this.getMatrixAt(i,ci),this.getBoundingBoxAt(a,_s).applyMatrix4(ci),e.union(_s)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xt);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let i=0,r=t.length;i<r;i++){if(t[i].active===!1)continue;let a=t[i].geometryIndex;this.getMatrixAt(i,ci),this.getBoundingSphereAt(a,Fr).applyMatrix4(ci),e.union(Fr)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let t={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Fl),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=t):(i=this._instanceInfo.length,this._instanceInfo.push(t));let r=this._matricesTexture;ci.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;let a=this._colorsTexture;return a&&(x0.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,i=-1){this._initializeGeometry(e),this._validateGeometry(e);let r={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},a=this._geometryInfo;r.vertexStart=this._nextVertexStart,r.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let n=e.getIndex();if(n!==null&&(r.indexStart=this._nextIndexStart,r.reservedIndexCount=i===-1?n.count:i),r.indexStart!==-1&&r.indexStart+r.reservedIndexCount>this._maxIndexCount||r.vertexStart+r.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let s;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Fl),s=this._availableGeometryIds.shift(),a[s]=r):(s=this._geometryCount,this._geometryCount++,a.push(r)),this.setGeometryAt(s,e),this._nextIndexStart=r.indexStart+r.reservedIndexCount,this._nextVertexStart=r.vertexStart+r.reservedVertexCount,s}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let i=this.geometry,r=i.getIndex()!==null,a=i.getIndex(),n=t.getIndex(),s=this._geometryInfo[e];if(r&&n.count>s.reservedIndexCount||t.attributes.position.count>s.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let o=s.vertexStart,l=s.reservedVertexCount;s.vertexCount=t.getAttribute("position").count;for(let h in i.attributes){let c=t.getAttribute(h),u=i.getAttribute(h);E0(c,u,o);let d=c.itemSize;for(let p=c.count,g=l;p<g;p++){let v=o+p;for(let f=0;f<d;f++)u.setComponent(v,f,0)}u.needsUpdate=!0,u.addUpdateRange(o*d,l*d)}if(r){let h=s.indexStart,c=s.reservedIndexCount;s.indexCount=t.getIndex().count;for(let u=0;u<n.count;u++)a.setX(h+u,o+n.getX(u));for(let u=n.count,d=c;u<d;u++)a.setX(h+u,o);a.needsUpdate=!0,a.addUpdateRange(h,s.reservedIndexCount)}return s.start=r?s.indexStart:s.vertexStart,s.count=r?s.indexCount:s.vertexCount,s.boundingBox=null,t.boundingBox!==null&&(s.boundingBox=t.boundingBox.clone()),s.boundingSphere=null,t.boundingSphere!==null&&(s.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let i=this._instanceInfo;for(let r=0,a=i.length;r<a;r++)i[r].active&&i[r].geometryIndex===e&&this.deleteInstance(r);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,i=this._geometryInfo,r=i.map((n,s)=>s).sort((n,s)=>i[n].vertexStart-i[s].vertexStart),a=this.geometry;for(let n=0,s=i.length;n<s;n++){let o=r[n],l=i[o];if(l.active!==!1){if(a.index!==null){if(l.indexStart!==t){let{indexStart:h,vertexStart:c,reservedIndexCount:u}=l,d=a.index,p=d.array,g=e-c;for(let v=h;v<h+u;v++)p[v]=p[v]+g;d.array.copyWithin(t,h,h+u),d.addUpdateRange(t,u),d.needsUpdate=!0,l.indexStart=t}t+=l.reservedIndexCount}if(l.vertexStart!==e){let{vertexStart:h,reservedVertexCount:c}=l,u=a.attributes;for(let d in u){let p=u[d],{array:g,itemSize:v}=p;g.copyWithin(e*v,h*v,(h+c)*v),p.addUpdateRange(e*v,c*v),p.needsUpdate=!0}l.vertexStart=e}e+=l.reservedVertexCount,l.start=a.index?l.indexStart:l.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let i=this.geometry,r=this._geometryInfo[e];if(r.boundingBox===null){let a=new ei,n=i.index,s=i.attributes.position;for(let o=r.start,l=r.start+r.count;o<l;o++){let h=o;n&&(h=n.getX(h)),a.expandByPoint(Bl.fromBufferAttribute(s,h))}r.boundingBox=a}return t.copy(r.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let i=this.geometry,r=this._geometryInfo[e];if(r.boundingSphere===null){let a=new Xt;this.getBoundingBoxAt(e,_s),_s.getCenter(a.center);let n=i.index,s=i.attributes.position,o=0;for(let l=r.start,h=r.start+r.count;l<h;l++){let c=l;n&&(c=n.getX(c)),Bl.fromBufferAttribute(s,c),o=Math.max(o,a.center.distanceToSquared(Bl))}a.radius=Math.sqrt(o),r.boundingSphere=a}return t.copy(r.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let i=this._matricesTexture,r=this._matricesTexture.image.data;return t.toArray(r,e*16),i.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let i=this._geometryInfo[e];return t.vertexStart=i.vertexStart,t.vertexCount=i.vertexCount,t.reservedVertexCount=i.reservedVertexCount,t.indexStart=i.indexStart,t.indexCount=i.indexCount,t.reservedIndexCount=i.reservedIndexCount,t.start=i.start,t.count=i.count,t}setInstanceCount(e){let t=this._availableInstanceIds,i=this._instanceInfo;for(t.sort(Fl);t[t.length-1]===i.length-1;)i.pop(),t.pop();if(e<i.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let r=new Int32Array(e),a=new Int32Array(e);Hi(this._multiDrawCounts,r),Hi(this._multiDrawStarts,a),this._multiDrawCounts=r,this._multiDrawStarts=a;let n=new Int32Array(e),s=new Int32Array(e),o=new Int32Array(e);Hi(this._mergedDrawCounts,n),Hi(this._mergedDrawStarts,s),Hi(this._mergedDrawInstanceCounts,o),this._mergedDrawCounts=n,this._mergedDrawStarts=s,this._mergedDrawInstanceCounts=o,this._maxInstanceCount=e;let l=this._indirectTexture,h=this._matricesTexture,c=this._colorsTexture;l.dispose(),this._initIndirectTexture(),Hi(l.image.data,this._indirectTexture.image.data),h.dispose(),this._initMatricesTexture(),Hi(h.image.data,this._matricesTexture.image.data),c&&(c.dispose(),this._initColorsTexture(),Hi(c.image.data,this._colorsTexture.image.data)),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}setGeometrySize(e,t){let i=[...this._geometryInfo].filter(n=>n.active);if(Math.max(...i.map(n=>n.vertexStart+n.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...i.map(n=>n.indexStart+n.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new et,this._initializeGeometry(r));let a=this.geometry;r.index&&Hi(r.index.array,a.index.array);for(let n in r.attributes)Hi(r.attributes[n].array,a.attributes[n].array);this._visibilityChanged=!0}raycast(e,t){let i=this._instanceInfo,r=this._geometryInfo,a=this.matrixWorld,n=this.geometry;$t.material=this.material,$t.geometry.index=n.index,$t.geometry.attributes=n.attributes,$t.geometry.boundingBox===null&&($t.geometry.boundingBox=new ei),$t.geometry.boundingSphere===null&&($t.geometry.boundingSphere=new Xt);for(let s=0,o=i.length;s<o;s++){if(!i[s].visible||!i[s].active)continue;let l=i[s].geometryIndex,h=r[l];$t.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(s,$t.matrixWorld).premultiply(a),this.getBoundingBoxAt(l,$t.geometry.boundingBox),this.getBoundingSphereAt(l,$t.geometry.boundingSphere),$t.raycast(e,ys);for(let c=0,u=ys.length;c<u;c++){let d=ys[c];d.object=this,d.batchId=s,t.push(d)}ys.length=0}$t.material=null,$t.geometry.index=null,$t.geometry.attributes={},$t.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._mergedDrawCounts=e._mergedDrawCounts.slice(),this._mergedDrawStarts=e._mergedDrawStarts.slice(),this._mergedDrawInstanceCounts=e._mergedDrawInstanceCounts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),e._colorsTexture!==null?(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()):this._colorsTexture=null,this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}_updateDrawParameters(e,t,i,r="multiDraw"){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let a=t.getIndex(),n=a===null?1:a.array.BYTES_PER_ELEMENT,s=1;i.wireframe&&(s=2,n=t.attributes.position.count>65535?4:2);let o=this._instanceInfo,l=this._multiDrawStarts,h=this._multiDrawCounts,c=this._mergedDrawStarts,u=this._mergedDrawCounts,d=this._mergedDrawInstanceCounts,p=this._geometryInfo,g=this.perObjectFrustumCulled,v=this._indirectTexture,f=v.image.data,m=e.isArrayCamera?M0:S0;g&&(e.isArrayCamera?m.setFromArrayCamera(e):(ci.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(ci,e.coordinateSystem,e.reversedDepth)));let x=0,S=0;if(this.sortObjects){ci.copy(this.matrixWorld).invert(),eu.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ci),tu.set(0,0,-1).transformDirection(e.matrixWorld).transformDirection(ci);for(let A=0,y=o.length;A<y;A++)if(o[A].visible&&o[A].active){let M=o[A].geometryIndex;this.getMatrixAt(A,ci),this.getBoundingSphereAt(M,Fr).applyMatrix4(ci);let w=!1;if(g&&(w=!m.intersectsSphere(Fr)),!w){let L=p[M],N=b0.subVectors(Fr.center,eu).dot(tu);zl.push(L.start,L.count,N,A)}}let _=zl.list,E=this.customSort;E===null?_.sort(i.transparent?_0:v0):E.call(this,_,e);for(let A=0,y=_.length;A<y;A++){let M=_[A],w=M.start*n*s,L=M.count*s;r==="merged"?S>0&&c[S-1]===w&&u[S-1]===L?d[S-1]++:(c[S]=w,u[S]=L,d[S]=1,S++):(l[x]=w,h[x]=L),f[x]=M.index,x++}zl.reset()}else for(let _=0,E=o.length;_<E;_++)if(o[_].visible&&o[_].active){let A=o[_].geometryIndex,y=!1;if(g&&(this.getMatrixAt(_,ci),this.getBoundingSphereAt(A,Fr).applyMatrix4(ci),y=!m.intersectsSphere(Fr)),!y){let M=p[A],w=M.start*n*s,L=M.count*s;r==="merged"?S>0&&c[S-1]===w&&u[S-1]===L?d[S-1]++:(c[S]=w,u[S]=L,d[S]=1,S++):(l[x]=w,h[x]=L),f[x]=_,x++}}v.needsUpdate=!0,this._multiDrawCount=x,this._mergedDrawCount=S,this._multiDrawBytesPerElement=n,this._visibilityChanged=!1}onBeforeRender(e,t,i,r,a){e.isWebGPURenderer===!0?(this._visibilityChanged||this.perObjectFrustumCulled||this.sortObjects)&&(this._indirectTexture.needsUpdate=!0):this._updateDrawParameters(i,r,a)}onBeforeShadow(e,t,i,r,a,n){e.isWebGPURenderer!==!0&&this._updateDrawParameters(r,a,n)}},li=class extends jt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Po=new R,Lo=new R,iu=new Ye,sn=new ka,xs=new Xt,Hl=new R,ru=new R,wr=class extends mt{constructor(e=new et,t=new li){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,a=t.count;r<a;r++)Po.fromBufferAttribute(t,r-1),Lo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Po.distanceTo(Lo);e.setAttribute("lineDistance",new De(i,1))}else xe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,n=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),xs.copy(i.boundingSphere),xs.applyMatrix4(r),xs.radius+=a,e.ray.intersectsSphere(xs)===!1)return;iu.copy(r).invert(),sn.copy(e.ray).applyMatrix4(iu);let s=a/((this.scale.x+this.scale.y+this.scale.z)/3),o=s*s,l=this.isLineSegments?2:1,h=i.index,c=i.attributes.position;if(h!==null){let u=Math.max(0,n.start),d=Math.min(h.count,n.start+n.count);for(let p=u,g=d-1;p<g;p+=l){let v=h.getX(p),f=h.getX(p+1),m=Ss(this,e,sn,o,v,f,p);m&&t.push(m)}if(this.isLineLoop){let p=h.getX(d-1),g=h.getX(u),v=Ss(this,e,sn,o,p,g,d-1);v&&t.push(v)}}else{let u=Math.max(0,n.start),d=Math.min(c.count,n.start+n.count);for(let p=u,g=d-1;p<g;p+=l){let v=Ss(this,e,sn,o,p,p+1,p);v&&t.push(v)}if(this.isLineLoop){let p=Ss(this,e,sn,o,d-1,u,d-1);p&&t.push(p)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}};function Ss(e,t,i,r,a,n,s){let o=e.geometry.attributes.position;if(Po.fromBufferAttribute(o,a),Lo.fromBufferAttribute(o,n),i.distanceSqToSegment(Po,Lo,Hl,ru)>r)return;Hl.applyMatrix4(e.matrixWorld);let l=t.ray.origin.distanceTo(Hl);if(!(l<t.near||l>t.far))return{distance:l,point:ru.clone().applyMatrix4(e.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:e}}var au=new R,nu=new R,ji=class extends wr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,a=t.count;r<a;r+=2)au.fromBufferAttribute(t,r),nu.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+au.distanceTo(nu);e.setAttribute("lineDistance",new De(i,1))}else xe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},mp=class extends wr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},kh=class extends jt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},su=new Ye,sh=new ka,Ms=new Xt,bs=new R,gp=class extends mt{constructor(e=new et,t=new kh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,n=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ms.copy(i.boundingSphere),Ms.applyMatrix4(r),Ms.radius+=a,e.ray.intersectsSphere(Ms)===!1)return;su.copy(r).invert(),sh.copy(e.ray).applyMatrix4(su);let s=a/((this.scale.x+this.scale.y+this.scale.z)/3),o=s*s,l=i.index,h=i.attributes.position;if(l!==null){let c=Math.max(0,n.start),u=Math.min(l.count,n.start+n.count);for(let d=c,p=u;d<p;d++){let g=l.getX(d);bs.fromBufferAttribute(h,g),ou(bs,g,o,r,e,t,this)}}else{let c=Math.max(0,n.start),u=Math.min(h.count,n.start+n.count);for(let d=c,p=u;d<p;d++)bs.fromBufferAttribute(h,d),ou(bs,d,o,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}};function ou(e,t,i,r,a,n,s){let o=sh.distanceSqToPoint(e);if(o<i){let l=new R;sh.closestPointToPoint(e,l),l.applyMatrix4(r);let h=a.ray.origin.distanceTo(l);if(h<a.near||h>a.far)return;n.push({distance:h,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:s})}}var vp=class extends Bt{constructor(e,t,i,r,a=Et,n=Et,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let h=this;function c(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c))}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;!("requestVideoFrameCallback"in e)&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}},w0=class extends vp{constructor(e,t,i,r,a,n,s,o){super({},e,t,i,r,a,n,s,o),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}},T0=class extends Bt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Rt,this.minFilter=Rt,this.generateMipmaps=!1,this.needsUpdate=!0}copy(e){return super.copy(e),this.source=new Vi(Object.assign({},e.image)),this}},Jo=class extends Bt{constructor(e=[],t,i,r,a,n,s,o,l,h,c,u){super(null,n,s,o,l,h,r,a,c,u),this.isCompressedTexture=!0,this.image={width:t,height:i},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},A0=class extends Jo{constructor(e,t,i,r,a,n){super(e,t,i,a,n),this.isCompressedArrayTexture=!0,this.image.depth=r,this.wrapR=Gt,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},R0=class extends Jo{constructor(e,t,i){super(void 0,e[0].width,e[0].height,t,i,or),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}},Vn=class extends Bt{constructor(e=[],t=or,i,r,a,n,s,o,l,h){super(e,t,i,r,a,n,s,o,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Gh=class extends Bt{constructor(e,t,i,r,a,n,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},C0=class extends Bt{constructor(e,t,i,r,a,n,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;let h=e?e.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){let e=this.image?this.image.parentNode:null;e!==null&&"onpaint"in e&&(e.onpaint=null),super.dispose()}},ea=class extends Bt{constructor(e,t,i=bi,r,a,n,s=Rt,o=Rt,l,h=lr,c=1){if(h!==lr&&h!==rr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:c};super(u,r,a,n,s,o,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Vh=class extends ea{constructor(e,t=bi,i=or,r,a,n=Rt,s=Rt,o,l=lr){let h={width:e,height:e,depth:1},c=[h,h,h,h,h,h];super(e,e,t,i,r,a,n,s,o,l),this.image=c,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Wh=class extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},zt=class _p extends et{constructor(t=1,i=1,r=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:r,widthSegments:a,heightSegments:n,depthSegments:s};let o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);let l=[],h=[],c=[],u=[],d=0,p=0;g("z","y","x",-1,-1,r,i,t,s,n,0),g("z","y","x",1,-1,r,i,-t,s,n,1),g("x","z","y",1,1,t,r,i,a,s,2),g("x","z","y",1,-1,t,r,-i,a,s,3),g("x","y","z",1,-1,t,i,r,a,n,4),g("x","y","z",-1,-1,t,i,-r,a,n,5),this.setIndex(l),this.setAttribute("position",new De(h,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(u,2));function g(v,f,m,x,S,_,E,A,y,M,w){let L=_/y,N=E/M,k=_/2,q=E/2,P=A/2,B=y+1,Y=M+1,H=0,he=0,J=new R;for(let Z=0;Z<Y;Z++){let re=Z*N-q;for(let Ie=0;Ie<B;Ie++){let ee=Ie*L-k;J[v]=ee*x,J[f]=re*S,J[m]=P,h.push(J.x,J.y,J.z),J[v]=0,J[f]=0,J[m]=A>0?1:-1,c.push(J.x,J.y,J.z),u.push(Ie/y),u.push(1-Z/M),H+=1}}for(let Z=0;Z<M;Z++)for(let re=0;re<y;re++){let Ie=d+re+B*Z,ee=d+re+B*(Z+1),ne=d+(re+1)+B*(Z+1),we=d+(re+1)+B*Z;l.push(Ie,ee,we),l.push(ee,ne,we),he+=6}o.addGroup(p,he,w),p+=he,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _p(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ko=class yp extends et{constructor(t=1,i=1,r=4,a=8,n=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:i,capSegments:r,radialSegments:a,heightSegments:n},i=Math.max(0,i),r=Math.max(1,Math.floor(r)),a=Math.max(3,Math.floor(a)),n=Math.max(1,Math.floor(n));let s=[],o=[],l=[],h=[],c=i/2,u=Math.PI/2*t,d=i,p=2*u+d,g=r*2+n,v=a+1,f=new R,m=new R;for(let x=0;x<=g;x++){let S=0,_=0,E=0,A=0;if(x<=r){let w=x/r,L=w*Math.PI/2;_=-c-t*Math.cos(L),E=t*Math.sin(L),A=-t*Math.cos(L),S=w*u}else if(x<=r+n){let w=(x-r)/n;_=-c+w*i,E=t,A=0,S=u+w*d}else{let w=(x-r-n)/r,L=w*Math.PI/2;_=c+t*Math.sin(L),E=t*Math.cos(L),A=t*Math.sin(L),S=u+d+w*u}let y=Math.max(0,Math.min(1,S/p)),M=0;x===0?M=.5/a:x===g&&(M=-.5/a);for(let w=0;w<=a;w++){let L=w/a,N=L*Math.PI*2,k=Math.sin(N),q=Math.cos(N);m.x=-E*q,m.y=_,m.z=E*k,o.push(m.x,m.y,m.z),f.set(-E*q,A,E*k),f.normalize(),l.push(f.x,f.y,f.z),h.push(L+M,y)}if(x>0){let w=(x-1)*v;for(let L=0;L<a;L++){let N=w+L,k=w+L+1,q=x*v+L,P=x*v+L+1;s.push(N,k,q),s.push(k,P,q)}}}this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yp(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},xp=class Sp extends et{constructor(t=1,i=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:r,thetaLength:a},i=Math.max(3,i);let n=[],s=[],o=[],l=[],h=new R,c=new ie;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=i;u++,d+=3){let p=r+u/i*a;h.x=t*Math.cos(p),h.y=t*Math.sin(p),s.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(s[d]/t+1)/2,c.y=(s[d+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=i;u++)n.push(u,u+1,0);this.setIndex(n),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(o,3)),this.setAttribute("uv",new De(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sp(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Nt=class Mp extends et{constructor(t=1,i=1,r=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:i,height:r,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};let h=this;a=Math.floor(a),n=Math.floor(n);let c=[],u=[],d=[],p=[],g=0,v=[],f=r/2,m=0;x(),s===!1&&(t>0&&S(!0),i>0&&S(!1)),this.setIndex(c),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(d,3)),this.setAttribute("uv",new De(p,2));function x(){let _=new R,E=new R,A=0,y=(i-t)/r;for(let M=0;M<=n;M++){let w=[],L=M/n,N=L*(i-t)+t;for(let k=0;k<=a;k++){let q=k/a,P=q*l+o,B=Math.sin(P),Y=Math.cos(P);E.x=N*B,E.y=-L*r+f,E.z=N*Y,u.push(E.x,E.y,E.z),_.set(B,y,Y).normalize(),d.push(_.x,_.y,_.z),p.push(q,1-L),w.push(g++)}v.push(w)}for(let M=0;M<a;M++)for(let w=0;w<n;w++){let L=v[w][M],N=v[w+1][M],k=v[w+1][M+1],q=v[w][M+1];(t>0||w!==0)&&(c.push(L,N,q),A+=3),(i>0||w!==n-1)&&(c.push(N,k,q),A+=3)}h.addGroup(m,A,0),m+=A}function S(_){let E=g,A=new ie,y=new R,M=0,w=_===!0?t:i,L=_===!0?1:-1;for(let k=1;k<=a;k++)u.push(0,f*L,0),d.push(0,L,0),p.push(.5,.5),g++;let N=g;for(let k=0;k<=a;k++){let q=k/a*l+o,P=Math.cos(q),B=Math.sin(q);y.x=w*B,y.y=f*L,y.z=w*P,u.push(y.x,y.y,y.z),d.push(0,L,0),A.x=P*.5+.5,A.y=B*.5*L+.5,p.push(A.x,A.y),g++}for(let k=0;k<a;k++){let q=E+k,P=N+k;_===!0?c.push(P,P+1,q):c.push(P+1,P,q),M+=3}h.addGroup(m,M,_===!0?1:2),m+=M}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mp(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ra=class bp extends Nt{constructor(t=1,i=1,r=32,a=1,n=!1,s=0,o=Math.PI*2){super(0,t,i,r,a,n,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:i,radialSegments:r,heightSegments:a,openEnded:n,thetaStart:s,thetaLength:o}}static fromJSON(t){return new bp(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ga=class Ep extends et{constructor(t=[],i=[],r=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:i,radius:r,detail:a};let n=[],s=[];o(a),h(r),c(),this.setAttribute("position",new De(n,3)),this.setAttribute("normal",new De(n.slice(),3)),this.setAttribute("uv",new De(s,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let S=new R,_=new R,E=new R;for(let A=0;A<i.length;A+=3)p(i[A+0],S),p(i[A+1],_),p(i[A+2],E),l(S,_,E,x)}function l(x,S,_,E){let A=E+1,y=[];for(let M=0;M<=A;M++){y[M]=[];let w=x.clone().lerp(_,M/A),L=S.clone().lerp(_,M/A),N=A-M;for(let k=0;k<=N;k++)k===0&&M===A?y[M][k]=w:y[M][k]=w.clone().lerp(L,k/N)}for(let M=0;M<A;M++)for(let w=0;w<2*(A-M)-1;w++){let L=Math.floor(w/2);w%2===0?(d(y[M][L+1]),d(y[M+1][L]),d(y[M][L])):(d(y[M][L+1]),d(y[M+1][L+1]),d(y[M+1][L]))}}function h(x){let S=new R;for(let _=0;_<n.length;_+=3)S.x=n[_+0],S.y=n[_+1],S.z=n[_+2],S.normalize().multiplyScalar(x),n[_+0]=S.x,n[_+1]=S.y,n[_+2]=S.z}function c(){let x=new R;for(let S=0;S<n.length;S+=3){x.x=n[S+0],x.y=n[S+1],x.z=n[S+2];let _=f(x)/2/Math.PI+.5,E=m(x)/Math.PI+.5;s.push(_,1-E)}g(),u()}function u(){for(let x=0;x<s.length;x+=6){let S=s[x+0],_=s[x+2],E=s[x+4],A=Math.max(S,_,E),y=Math.min(S,_,E);A>.9&&y<.1&&(S<.2&&(s[x+0]+=1),_<.2&&(s[x+2]+=1),E<.2&&(s[x+4]+=1))}}function d(x){n.push(x.x,x.y,x.z)}function p(x,S){let _=x*3;S.x=t[_+0],S.y=t[_+1],S.z=t[_+2]}function g(){let x=new R,S=new R,_=new R,E=new R,A=new ie,y=new ie,M=new ie;for(let w=0,L=0;w<n.length;w+=9,L+=6){x.set(n[w+0],n[w+1],n[w+2]),S.set(n[w+3],n[w+4],n[w+5]),_.set(n[w+6],n[w+7],n[w+8]),A.set(s[L+0],s[L+1]),y.set(s[L+2],s[L+3]),M.set(s[L+4],s[L+5]),E.copy(x).add(S).add(_).divideScalar(3);let N=f(E);v(A,L+0,x,N),v(y,L+2,S,N),v(M,L+4,_,N)}}function v(x,S,_,E){E<0&&x.x===1&&(s[S]=x.x-1),_.x===0&&_.z===0&&(s[S]=E/2/Math.PI+.5)}function f(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ep(t.vertices,t.indices,t.radius,t.detail)}},wp=class Tp extends Ga{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=1/r,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-a,-r,0,-a,r,0,a,-r,0,a,r,-a,-r,0,-a,r,0,a,-r,0,a,r,0,-r,0,-a,r,0,-a,-r,0,a,r,0,a],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,s,t,i),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new Tp(t.radius,t.detail)}},Es=new R,ws=new R,kl=new R,Ts=new xr,Ap=class extends et{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),r=Math.cos(Zr*t),a=e.getIndex(),n=e.getAttribute("position"),s=a?a.count:n.count,o=[0,0,0],l=["a","b","c"],h=new Array(3),c=new Map,u=[];for(let d=0;d<s;d+=3){a?(o[0]=a.getX(d),o[1]=a.getX(d+1),o[2]=a.getX(d+2)):(o[0]=d,o[1]=d+1,o[2]=d+2);let{a:p,b:g,c:v}=Ts;if(p.fromBufferAttribute(n,o[0]),g.fromBufferAttribute(n,o[1]),v.fromBufferAttribute(n,o[2]),Ts.getNormal(kl),h[0]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,h[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,h[2]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let f=0;f<3;f++){let m=(f+1)%3,x=h[f],S=h[m],_=Ts[l[f]],E=Ts[l[m]],A=`${x}_${S}`,y=`${S}_${x}`,M=c.get(y);M?(kl.dot(M.normal)<=r&&(u.push(_.x,_.y,_.z),u.push(E.x,E.y,E.z)),c.set(y,null)):c.has(A)||c.set(A,{index0:o[f],index1:o[m],normal:kl.clone()})}}for(let d of c.values())if(d){let{index0:p,index1:g}=d;Es.fromBufferAttribute(n,p),ws.fromBufferAttribute(n,g),u.push(Es.x,Es.y,Es.z),u.push(ws.x,ws.y,ws.z)}this.setAttribute("position",new De(u,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Bi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){xe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),a=0;t.push(0);for(let n=1;n<=e;n++)i=this.getPoint(n/e),a+=i.distanceTo(r),t.push(a),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,a=i.length,n;t?n=t:n=e*i[a-1];let s=0,o=a-1,l;for(;s<=o;)if(r=Math.floor(s+(o-s)/2),l=i[r]-n,l<0)s=r+1;else if(l>0)o=r-1;else{o=r;break}if(r=o,i[r]===n)return r/(a-1);let h=i[r],c=i[r+1]-h,u=(n-h)/c;return(r+u)/(a-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),n=this.getPoint(r),s=t||(a.isVector2?new ie:new R);return s.copy(n).sub(a).normalize(),s}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new R,r=[],a=[],n=[],s=new R,o=new Ye;for(let d=0;d<=e;d++){let p=d/e;r[d]=this.getTangentAt(p,new R)}a[0]=new R,n[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(r[0].x),c=Math.abs(r[0].y),u=Math.abs(r[0].z);h<=l&&(l=h,i.set(1,0,0)),c<=l&&(l=c,i.set(0,1,0)),u<=l&&i.set(0,0,1),s.crossVectors(r[0],i).normalize(),a[0].crossVectors(r[0],s),n[0].crossVectors(r[0],a[0]);for(let d=1;d<=e;d++){if(a[d]=a[d-1].clone(),n[d]=n[d-1].clone(),s.crossVectors(r[d-1],r[d]),s.length()>Number.EPSILON){s.normalize();let p=Math.acos(Ze(r[d-1].dot(r[d]),-1,1));a[d].applyMatrix4(o.makeRotationAxis(s,p))}n[d].crossVectors(r[d],a[d])}if(t===!0){let d=Math.acos(Ze(a[0].dot(a[e]),-1,1));d/=e,r[0].dot(s.crossVectors(a[0],a[e]))>0&&(d=-d);for(let p=1;p<=e;p++)a[p].applyMatrix4(o.makeRotationAxis(r[p],d*p)),n[p].crossVectors(r[p],a[p])}return{tangents:r,normals:a,binormals:n}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},$o=class extends Bi{constructor(e=0,t=0,i=1,r=1,a=0,n=Math.PI*2,s=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=a,this.aEndAngle=n,this.aClockwise=s,this.aRotation=o}getPoint(e,t=new ie){let i=t,r=Math.PI*2,a=this.aEndAngle-this.aStartAngle,n=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=r;for(;a>r;)a-=r;a<Number.EPSILON&&(n?a=0:a=r),this.aClockwise===!0&&!n&&(a===r?a=-r:a=a-r);let s=this.aStartAngle+e*a,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(this.aRotation!==0){let h=Math.cos(this.aRotation),c=Math.sin(this.aRotation),u=o-this.aX,d=l-this.aY;o=u*h-d*c+this.aX,l=u*c+d*h+this.aY}return i.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Rp=class extends $o{constructor(e,t,i,r,a,n){super(e,t,i,i,r,a,n),this.isArcCurve=!0,this.type="ArcCurve"}};function Xh(){let e=0,t=0,i=0,r=0;function a(n,s,o,l){e=n,t=o,i=-3*n+3*s-2*o-l,r=2*n-2*s+o+l}return{initCatmullRom:function(n,s,o,l,h){a(s,o,h*(o-n),h*(l-s))},initNonuniformCatmullRom:function(n,s,o,l,h,c,u){let d=(s-n)/h-(o-n)/(h+c)+(o-s)/c,p=(o-s)/c-(l-s)/(c+u)+(l-o)/u;d*=c,p*=c,a(s,o,d,p)},calc:function(n){let s=n*n,o=s*n;return e+t*n+i*s+r*o}}}var lu=new R,hu=new R,Gl=new Xh,Vl=new Xh,Wl=new Xh,Cp=class extends Bi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new R){let i=t,r=this.points,a=r.length,n=(a-(this.closed?0:1))*e,s=Math.floor(n),o=n-s;this.closed?s+=s>0?0:(Math.floor(Math.abs(s)/a)+1)*a:o===0&&s===a-1&&(s=a-2,o=1);let l,h;this.closed||s>0?l=r[(s-1)%a]:(hu.subVectors(r[0],r[1]).add(r[0]),l=hu);let c=r[s%a],u=r[(s+1)%a];if(this.closed||s+2<a?h=r[(s+2)%a]:(lu.subVectors(r[a-1],r[a-2]).add(r[a-1]),h=lu),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(c),d),g=Math.pow(c.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(h),d);g<1e-4&&(g=1),p<1e-4&&(p=g),v<1e-4&&(v=g),Gl.initNonuniformCatmullRom(l.x,c.x,u.x,h.x,p,g,v),Vl.initNonuniformCatmullRom(l.y,c.y,u.y,h.y,p,g,v),Wl.initNonuniformCatmullRom(l.z,c.z,u.z,h.z,p,g,v)}else this.curveType==="catmullrom"&&(Gl.initCatmullRom(l.x,c.x,u.x,h.x,this.tension),Vl.initCatmullRom(l.y,c.y,u.y,h.y,this.tension),Wl.initCatmullRom(l.z,c.z,u.z,h.z,this.tension));return i.set(Gl.calc(o),Vl.calc(o),Wl.calc(o)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function cu(e,t,i,r,a){let n=(r-t)*.5,s=(a-i)*.5,o=e*e,l=e*o;return(2*i-2*r+n+s)*l+(-3*i+3*r-2*n-s)*o+n*e+i}function I0(e,t){let i=1-e;return i*i*t}function P0(e,t){return 2*(1-e)*e*t}function L0(e,t){return e*e*t}function xn(e,t,i,r){return I0(e,t)+P0(e,i)+L0(e,r)}function D0(e,t){let i=1-e;return i*i*i*t}function N0(e,t){let i=1-e;return 3*i*i*e*t}function U0(e,t){return 3*(1-e)*e*e*t}function O0(e,t){return e*e*e*t}function Sn(e,t,i,r,a){return D0(e,t)+N0(e,i)+U0(e,r)+O0(e,a)}var jh=class extends Bi{constructor(e=new ie,t=new ie,i=new ie,r=new ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new ie){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(Sn(e,r.x,a.x,n.x,s.x),Sn(e,r.y,a.y,n.y,s.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ip=class extends Bi{constructor(e=new R,t=new R,i=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new R){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(Sn(e,r.x,a.x,n.x,s.x),Sn(e,r.y,a.y,n.y,s.y),Sn(e,r.z,a.z,n.z,s.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qh=class extends Bi{constructor(e=new ie,t=new ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ie){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pp=class extends Bi{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yh=class extends Bi{constructor(e=new ie,t=new ie,i=new ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ie){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(xn(e,r.x,a.x,n.x),xn(e,r.y,a.y,n.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zh=class extends Bi{constructor(e=new R,t=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new R){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(xn(e,r.x,a.x,n.x),xn(e,r.y,a.y,n.y),xn(e,r.z,a.z,n.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jh=class extends Bi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ie){let i=t,r=this.points,a=(r.length-1)*e,n=Math.floor(a),s=a-n,o=r[n===0?n:n-1],l=r[n],h=r[n>r.length-2?r.length-1:n+1],c=r[n>r.length-3?r.length-1:n+2];return i.set(cu(s,o.x,l.x,h.x,c.x),cu(s,o.y,l.y,h.y,c.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new ie().fromArray(r))}return this}},Do=Object.freeze({__proto__:null,ArcCurve:Rp,CatmullRomCurve3:Cp,CubicBezierCurve:jh,CubicBezierCurve3:Ip,EllipseCurve:$o,LineCurve:qh,LineCurve3:Pp,QuadraticBezierCurve:Yh,QuadraticBezierCurve3:Zh,SplineCurve:Jh}),Lp=class extends Bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Do[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),r=this.getCurveLengths(),a=0;for(;a<r.length;){if(r[a]>=i){let n=r[a]-i,s=this.curves[a],o=s.getLength(),l=o===0?0:1-n/o;return s.getPointAt(l,t)}a++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let r=0,a=this.curves;r<a.length;r++){let n=a[r],s=n.isEllipseCurve?e*2:n.isLineCurve||n.isLineCurve3?1:n.isSplineCurve?e*n.points.length:e,o=n.getPoints(s);for(let l=0;l<o.length;l++){let h=o[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(new Do[r.type]().fromJSON(r))}return this.cacheLengths=null,this}},Dn=class extends Lp{constructor(e){super(),this.type="Path",this.currentPoint=new ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new qh(this.currentPoint.clone(),new ie(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){let a=new Yh(this.currentPoint.clone(),new ie(e,t),new ie(i,r));return this.curves.push(a),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,a,n){let s=new jh(this.currentPoint.clone(),new ie(e,t),new ie(i,r),new ie(a,n));return this.curves.push(s),this.currentPoint.set(a,n),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Jh(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,a,n){let s=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+s,t+o,i,r,a,n),this}absarc(e,t,i,r,a,n){return this.absellipse(e,t,i,i,r,a,n),this}ellipse(e,t,i,r,a,n,s,o){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,r,a,n,s,o),this}absellipse(e,t,i,r,a,n,s,o){let l=new $o(e,t,i,r,a,n,s,o);if(this.curves.length>0){let c=l.getPoint(0);c.equals(this.currentPoint)||this.lineTo(c.x,c.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Wn=class extends Dn{constructor(e){super(e),this.uuid=Ei(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(new Dn().fromJSON(r))}return this}};function F0(e,t,i=2){let r=t&&t.length,a=r?t[0]*i:e.length,n=Dp(e,0,a,i,!0),s=[];if(!n||n.next===n.prev)return s;let o,l,h;if(r&&(n=G0(e,t,n,i)),e.length>80*i){o=e[0],l=e[1];let c=o,u=l;for(let d=i;d<a;d+=i){let p=e[d],g=e[d+1];p<o&&(o=p),g<l&&(l=g),p>c&&(c=p),g>u&&(u=g)}h=Math.max(c-o,u-l),h=h!==0?32767/h:0}return Nn(n,s,i,o,l,h,0),s}function Dp(e,t,i,r,a){let n;if(a===Q0(e,t,i,r)>0)for(let s=t;s<i;s+=r)n=uu(s/r|0,e[s],e[s+1],n);else for(let s=i-r;s>=t;s-=r)n=uu(s/r|0,e[s],e[s+1],n);return n&&za(n,n.next)&&(On(n),n=n.next),n}function ta(e,t){if(!e)return e;t||(t=e);let i=e,r;do if(r=!1,!i.steiner&&(za(i,i.next)||bt(i.prev,i,i.next)===0)){if(On(i),i=t=i.prev,i===i.next)break;r=!0}else i=i.next;while(r||i!==t);return t}function Nn(e,t,i,r,a,n,s){if(!e)return;!s&&n&&q0(e,r,a,n);let o=e;for(;e.prev!==e.next;){let l=e.prev,h=e.next;if(n?z0(e,r,a,n):B0(e)){t.push(l.i,e.i,h.i),On(e),e=h.next,o=h.next;continue}if(e=h,e===o){s?s===1?(e=H0(ta(e),t),Nn(e,t,i,r,a,n,2)):s===2&&k0(e,t,i,r,a,n):Nn(ta(e),t,i,r,a,n,1);break}}}function B0(e){let t=e.prev,i=e,r=e.next;if(bt(t,i,r)>=0)return!1;let a=t.x,n=i.x,s=r.x,o=t.y,l=i.y,h=r.y,c=Math.min(a,n,s),u=Math.min(o,l,h),d=Math.max(a,n,s),p=Math.max(o,l,h),g=r.next;for(;g!==t;){if(g.x>=c&&g.x<=d&&g.y>=u&&g.y<=p&&hn(a,o,n,l,s,h,g.x,g.y)&&bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function z0(e,t,i,r){let a=e.prev,n=e,s=e.next;if(bt(a,n,s)>=0)return!1;let o=a.x,l=n.x,h=s.x,c=a.y,u=n.y,d=s.y,p=Math.min(o,l,h),g=Math.min(c,u,d),v=Math.max(o,l,h),f=Math.max(c,u,d),m=oh(p,g,t,i,r),x=oh(v,f,t,i,r),S=e.prevZ,_=e.nextZ;for(;S&&S.z>=m&&_&&_.z<=x;){if(S.x>=p&&S.x<=v&&S.y>=g&&S.y<=f&&S!==a&&S!==s&&hn(o,c,l,u,h,d,S.x,S.y)&&bt(S.prev,S,S.next)>=0||(S=S.prevZ,_.x>=p&&_.x<=v&&_.y>=g&&_.y<=f&&_!==a&&_!==s&&hn(o,c,l,u,h,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;S&&S.z>=m;){if(S.x>=p&&S.x<=v&&S.y>=g&&S.y<=f&&S!==a&&S!==s&&hn(o,c,l,u,h,d,S.x,S.y)&&bt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;_&&_.z<=x;){if(_.x>=p&&_.x<=v&&_.y>=g&&_.y<=f&&_!==a&&_!==s&&hn(o,c,l,u,h,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function H0(e,t){let i=e;do{let r=i.prev,a=i.next.next;!za(r,a)&&Up(r,i,i.next,a)&&Un(r,a)&&Un(a,r)&&(t.push(r.i,i.i,a.i),On(i),On(i.next),i=e=a),i=i.next}while(i!==e);return ta(i)}function k0(e,t,i,r,a,n){let s=e;do{let o=s.next.next;for(;o!==s.prev;){if(s.i!==o.i&&J0(s,o)){let l=Op(s,o);s=ta(s,s.next),l=ta(l,l.next),Nn(s,t,i,r,a,n,0),Nn(l,t,i,r,a,n,0);return}o=o.next}s=s.next}while(s!==e)}function G0(e,t,i,r){let a=[];for(let n=0,s=t.length;n<s;n++){let o=t[n]*r,l=n<s-1?t[n+1]*r:e.length,h=Dp(e,o,l,r,!1);h===h.next&&(h.steiner=!0),a.push(Z0(h))}a.sort(V0);for(let n=0;n<a.length;n++)i=W0(a[n],i);return i}function V0(e,t){let i=e.x-t.x;if(i===0&&(i=e.y-t.y,i===0)){let r=(e.next.y-e.y)/(e.next.x-e.x),a=(t.next.y-t.y)/(t.next.x-t.x);i=r-a}return i}function W0(e,t){let i=X0(e,t);if(!i)return t;let r=Op(i,e);return ta(r,r.next),ta(i,i.next)}function X0(e,t){let i=t,r=e.x,a=e.y,n=-1/0,s;if(za(e,i))return i;do{if(za(e,i.next))return i.next;if(a<=i.y&&a>=i.next.y&&i.next.y!==i.y){let u=i.x+(a-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(u<=r&&u>n&&(n=u,s=i.x<i.next.x?i:i.next,u===r))return s}i=i.next}while(i!==t);if(!s)return null;let o=s,l=s.x,h=s.y,c=1/0;i=s;do{if(r>=i.x&&i.x>=l&&r!==i.x&&Np(a<h?r:n,a,l,h,a<h?n:r,a,i.x,i.y)){let u=Math.abs(a-i.y)/(r-i.x);Un(i,e)&&(u<c||u===c&&(i.x>s.x||i.x===s.x&&j0(s,i)))&&(s=i,c=u)}i=i.next}while(i!==o);return s}function j0(e,t){return bt(e.prev,e,t.prev)<0&&bt(t.next,e,e.next)<0}function q0(e,t,i,r){let a=e;do a.z===0&&(a.z=oh(a.x,a.y,t,i,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==e);a.prevZ.nextZ=null,a.prevZ=null,Y0(a)}function Y0(e){let t,i=1;do{let r=e,a;e=null;let n=null;for(t=0;r;){t++;let s=r,o=0;for(let h=0;h<i&&(o++,s=s.nextZ,!!s);h++);let l=i;for(;o>0||l>0&&s;)o!==0&&(l===0||!s||r.z<=s.z)?(a=r,r=r.nextZ,o--):(a=s,s=s.nextZ,l--),n?n.nextZ=a:e=a,a.prevZ=n,n=a;r=s}n.nextZ=null,i*=2}while(t>1);return e}function oh(e,t,i,r,a){return e=(e-i)*a|0,t=(t-r)*a|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Z0(e){let t=e,i=e;do(t.x<i.x||t.x===i.x&&t.y<i.y)&&(i=t),t=t.next;while(t!==e);return i}function Np(e,t,i,r,a,n,s,o){return(a-s)*(t-o)>=(e-s)*(n-o)&&(e-s)*(r-o)>=(i-s)*(t-o)&&(i-s)*(n-o)>=(a-s)*(r-o)}function hn(e,t,i,r,a,n,s,o){return!(e===s&&t===o)&&Np(e,t,i,r,a,n,s,o)}function J0(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!K0(e,t)&&(Un(e,t)&&Un(t,e)&&$0(e,t)&&(bt(e.prev,e,t.prev)||bt(e,t.prev,t))||za(e,t)&&bt(e.prev,e,e.next)>0&&bt(t.prev,t,t.next)>0)}function bt(e,t,i){return(t.y-e.y)*(i.x-t.x)-(t.x-e.x)*(i.y-t.y)}function za(e,t){return e.x===t.x&&e.y===t.y}function Up(e,t,i,r){let a=Rs(bt(e,t,i)),n=Rs(bt(e,t,r)),s=Rs(bt(i,r,e)),o=Rs(bt(i,r,t));return!!(a!==n&&s!==o||a===0&&As(e,i,t)||n===0&&As(e,r,t)||s===0&&As(i,e,r)||o===0&&As(i,t,r))}function As(e,t,i){return t.x<=Math.max(e.x,i.x)&&t.x>=Math.min(e.x,i.x)&&t.y<=Math.max(e.y,i.y)&&t.y>=Math.min(e.y,i.y)}function Rs(e){return e>0?1:e<0?-1:0}function K0(e,t){let i=e;do{if(i.i!==e.i&&i.next.i!==e.i&&i.i!==t.i&&i.next.i!==t.i&&Up(i,i.next,e,t))return!0;i=i.next}while(i!==e);return!1}function Un(e,t){return bt(e.prev,e,e.next)<0?bt(e,t,e.next)>=0&&bt(e,e.prev,t)>=0:bt(e,t,e.prev)<0||bt(e,e.next,t)<0}function $0(e,t){let i=e,r=!1,a=(e.x+t.x)/2,n=(e.y+t.y)/2;do i.y>n!=i.next.y>n&&i.next.y!==i.y&&a<(i.next.x-i.x)*(n-i.y)/(i.next.y-i.y)+i.x&&(r=!r),i=i.next;while(i!==e);return r}function Op(e,t){let i=lh(e.i,e.x,e.y),r=lh(t.i,t.x,t.y),a=e.next,n=t.prev;return e.next=t,t.prev=e,i.next=a,a.prev=i,r.next=i,i.prev=r,n.next=r,r.prev=n,r}function uu(e,t,i,r){let a=lh(e,t,i);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function On(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function lh(e,t,i){return{i:e,x:t,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Q0(e,t,i,r){let a=0;for(let n=t,s=i-r;n<i;n+=r)a+=(e[s]-e[n])*(e[n+1]+e[s+1]),s=n;return a}var ev=class{static triangulate(e,t,i=2){return F0(e,t,i)}},ar=class Fp{static area(t){let i=t.length,r=0;for(let a=i-1,n=0;n<i;a=n++)r+=t[a].x*t[n].y-t[n].x*t[a].y;return r*.5}static isClockWise(t){return Fp.area(t)<0}static triangulateShape(t,i){let r=[],a=[],n=[];du(t),pu(r,t);let s=t.length;i.forEach(du);for(let l=0;l<i.length;l++)a.push(s),s+=i[l].length,pu(r,i[l]);let o=ev.triangulate(r,a);for(let l=0;l<o.length;l+=3)n.push(o.slice(l,l+3));return n}};function du(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function pu(e,t){for(let i=0;i<t.length;i++)e.push(t[i].x),e.push(t[i].y)}var Bp=class zp extends et{constructor(t=new Wn([new ie(.5,.5),new ie(-.5,.5),new ie(-.5,-.5),new ie(.5,-.5)]),i={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:i},t=Array.isArray(t)?t:[t];let r=this,a=[],n=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];s(h)}this.setAttribute("position",new De(a,3)),this.setAttribute("uv",new De(n,2)),this.computeVertexNormals();function s(o){let l=[],h=i.curveSegments!==void 0?i.curveSegments:12,c=i.steps!==void 0?i.steps:1,u=i.depth!==void 0?i.depth:1,d=i.bevelEnabled!==void 0?i.bevelEnabled:!0,p=i.bevelThickness!==void 0?i.bevelThickness:.2,g=i.bevelSize!==void 0?i.bevelSize:p-.1,v=i.bevelOffset!==void 0?i.bevelOffset:0,f=i.bevelSegments!==void 0?i.bevelSegments:3,m=i.extrudePath,x=i.UVGenerator!==void 0?i.UVGenerator:tv,S,_=!1,E,A,y,M;if(m){S=m.getSpacedPoints(c),_=!0,d=!1;let oe=m.isCatmullRomCurve3?m.closed:!1;E=m.computeFrenetFrames(c,oe),A=new R,y=new R,M=new R}d||(f=0,p=0,g=0,v=0);let w=o.extractPoints(h),L=w.shape,N=w.holes;if(!ar.isClockWise(L)){L=L.reverse();for(let oe=0,ge=N.length;oe<ge;oe++){let ue=N[oe];ar.isClockWise(ue)&&(N[oe]=ue.reverse())}}function k(oe){let ge=10000000000000001e-36,ue=oe[0];for(let Ce=1;Ce<=oe.length;Ce++){let Re=Ce%oe.length,Fe=oe[Re],He=Fe.x-ue.x,Je=Fe.y-ue.y,it=He*He+Je*Je,at=Math.max(Math.abs(Fe.x),Math.abs(Fe.y),Math.abs(ue.x),Math.abs(ue.y)),O=ge*at*at;if(it<=O){oe.splice(Re,1),Ce--;continue}ue=Fe}}k(L),N.forEach(k);let q=N.length,P=L;for(let oe=0;oe<q;oe++){let ge=N[oe];L=L.concat(ge)}function B(oe,ge,ue){return ge||ke("ExtrudeGeometry: vec does not exist"),oe.clone().addScaledVector(ge,ue)}let Y=L.length;function H(oe,ge,ue){let Ce,Re,Fe,He=oe.x-ge.x,Je=oe.y-ge.y,it=ue.x-oe.x,at=ue.y-oe.y,O=He*He+Je*Je,ht=He*at-Je*it;if(Math.abs(ht)>Number.EPSILON){let Ve=Math.sqrt(O),dt=Math.sqrt(it*it+at*at),de=ge.x-Je/Ve,nt=ge.y+He/Ve,ze=ue.x-at/dt,qe=ue.y+it/dt,xt=((ze-de)*at-(qe-nt)*it)/(He*at-Je*it);Ce=de+He*xt-oe.x,Re=nt+Je*xt-oe.y;let I=Ce*Ce+Re*Re;if(I<=2)return new ie(Ce,Re);Fe=Math.sqrt(I/2)}else{let Ve=!1;He>Number.EPSILON?it>Number.EPSILON&&(Ve=!0):He<-Number.EPSILON?it<-Number.EPSILON&&(Ve=!0):Math.sign(Je)===Math.sign(at)&&(Ve=!0),Ve?(Ce=-Je,Re=He,Fe=Math.sqrt(O)):(Ce=He,Re=Je,Fe=Math.sqrt(O/2))}return new ie(Ce/Fe,Re/Fe)}let he=[];for(let oe=0,ge=P.length,ue=ge-1,Ce=oe+1;oe<ge;oe++,ue++,Ce++)ue===ge&&(ue=0),Ce===ge&&(Ce=0),he[oe]=H(P[oe],P[ue],P[Ce]);let J=[],Z,re=he.concat();for(let oe=0,ge=q;oe<ge;oe++){let ue=N[oe];Z=[];for(let Ce=0,Re=ue.length,Fe=Re-1,He=Ce+1;Ce<Re;Ce++,Fe++,He++)Fe===Re&&(Fe=0),He===Re&&(He=0),Z[Ce]=H(ue[Ce],ue[Fe],ue[He]);J.push(Z),re=re.concat(Z)}let Ie;if(f===0)Ie=ar.triangulateShape(P,N);else{let oe=[],ge=[];for(let ue=0;ue<f;ue++){let Ce=ue/f,Re=p*Math.cos(Ce*Math.PI/2),Fe=g*Math.sin(Ce*Math.PI/2)+v;for(let He=0,Je=P.length;He<Je;He++){let it=B(P[He],he[He],Fe);fe(it.x,it.y,-Re),Ce===0&&oe.push(it)}for(let He=0,Je=q;He<Je;He++){let it=N[He];Z=J[He];let at=[];for(let O=0,ht=it.length;O<ht;O++){let Ve=B(it[O],Z[O],Fe);fe(Ve.x,Ve.y,-Re),Ce===0&&at.push(Ve)}Ce===0&&ge.push(at)}}Ie=ar.triangulateShape(oe,ge)}let ee=Ie.length,ne=g+v;for(let oe=0;oe<Y;oe++){let ge=d?B(L[oe],re[oe],ne):L[oe];_?(y.copy(E.normals[0]).multiplyScalar(ge.x),A.copy(E.binormals[0]).multiplyScalar(ge.y),M.copy(S[0]).add(y).add(A),fe(M.x,M.y,M.z)):fe(ge.x,ge.y,0)}for(let oe=1;oe<=c;oe++)for(let ge=0;ge<Y;ge++){let ue=d?B(L[ge],re[ge],ne):L[ge];_?(y.copy(E.normals[oe]).multiplyScalar(ue.x),A.copy(E.binormals[oe]).multiplyScalar(ue.y),M.copy(S[oe]).add(y).add(A),fe(M.x,M.y,M.z)):fe(ue.x,ue.y,u/c*oe)}for(let oe=f-1;oe>=0;oe--){let ge=oe/f,ue=p*Math.cos(ge*Math.PI/2),Ce=g*Math.sin(ge*Math.PI/2)+v;for(let Re=0,Fe=P.length;Re<Fe;Re++){let He=B(P[Re],he[Re],Ce);fe(He.x,He.y,u+ue)}for(let Re=0,Fe=N.length;Re<Fe;Re++){let He=N[Re];Z=J[Re];for(let Je=0,it=He.length;Je<it;Je++){let at=B(He[Je],Z[Je],Ce);_?fe(at.x,at.y+S[c-1].y,S[c-1].x+ue):fe(at.x,at.y,u+ue)}}}we(),Pe();function we(){let oe=a.length/3;if(d){let ge=0,ue=Y*ge;for(let Ce=0;Ce<ee;Ce++){let Re=Ie[Ce];Ge(Re[2]+ue,Re[1]+ue,Re[0]+ue)}ge=c+f*2,ue=Y*ge;for(let Ce=0;Ce<ee;Ce++){let Re=Ie[Ce];Ge(Re[0]+ue,Re[1]+ue,Re[2]+ue)}}else{for(let ge=0;ge<ee;ge++){let ue=Ie[ge];Ge(ue[2],ue[1],ue[0])}for(let ge=0;ge<ee;ge++){let ue=Ie[ge];Ge(ue[0]+Y*c,ue[1]+Y*c,ue[2]+Y*c)}}r.addGroup(oe,a.length/3-oe,0)}function Pe(){let oe=a.length/3,ge=0;Oe(P,ge),ge+=P.length;for(let ue=0,Ce=N.length;ue<Ce;ue++){let Re=N[ue];Oe(Re,ge),ge+=Re.length}r.addGroup(oe,a.length/3-oe,1)}function Oe(oe,ge){let ue=oe.length;for(;--ue>=0;){let Ce=ue,Re=ue-1;Re<0&&(Re=oe.length-1);for(let Fe=0,He=c+f*2;Fe<He;Fe++){let Je=Y*Fe,it=Y*(Fe+1),at=ge+Ce+Je,O=ge+Re+Je,ht=ge+Re+it,Ve=ge+Ce+it;tt(at,O,ht,Ve)}}}function fe(oe,ge,ue){l.push(oe),l.push(ge),l.push(ue)}function Ge(oe,ge,ue){Le(oe),Le(ge),Le(ue);let Ce=a.length/3,Re=x.generateTopUV(r,a,Ce-3,Ce-2,Ce-1);lt(Re[0]),lt(Re[1]),lt(Re[2])}function tt(oe,ge,ue,Ce){Le(oe),Le(ge),Le(Ce),Le(ge),Le(ue),Le(Ce);let Re=a.length/3,Fe=x.generateSideWallUV(r,a,Re-6,Re-3,Re-2,Re-1);lt(Fe[0]),lt(Fe[1]),lt(Fe[3]),lt(Fe[1]),lt(Fe[2]),lt(Fe[3])}function Le(oe){a.push(l[oe*3+0]),a.push(l[oe*3+1]),a.push(l[oe*3+2])}function lt(oe){n.push(oe.x),n.push(oe.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes,r=this.parameters.options;return iv(i,r,t)}static fromJSON(t,i){let r=[];for(let n=0,s=t.shapes.length;n<s;n++){let o=i[t.shapes[n]];r.push(o)}let a=t.options.extrudePath;return a!==void 0&&(t.options.extrudePath=new Do[a.type]().fromJSON(a)),new zp(r,t.options)}},tv={generateTopUV:function(e,t,i,r,a){let n=t[i*3],s=t[i*3+1],o=t[r*3],l=t[r*3+1],h=t[a*3],c=t[a*3+1];return[new ie(n,s),new ie(o,l),new ie(h,c)]},generateSideWallUV:function(e,t,i,r,a,n){let s=t[i*3],o=t[i*3+1],l=t[i*3+2],h=t[r*3],c=t[r*3+1],u=t[r*3+2],d=t[a*3],p=t[a*3+1],g=t[a*3+2],v=t[n*3],f=t[n*3+1],m=t[n*3+2];return Math.abs(o-c)<Math.abs(s-h)?[new ie(s,1-l),new ie(h,1-u),new ie(d,1-g),new ie(v,1-m)]:[new ie(o,1-l),new ie(c,1-u),new ie(p,1-g),new ie(f,1-m)]}};function iv(e,t,i){if(i.shapes=[],Array.isArray(e))for(let r=0,a=e.length;r<a;r++){let n=e[r];i.shapes.push(n.uuid)}else i.shapes.push(e.uuid);return i.options=Object.assign({},t),t.extrudePath!==void 0&&(i.options.extrudePath=t.extrudePath.toJSON()),i}var Hp=class kp extends Ga{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=[-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,n,t,i),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new kp(t.radius,t.detail)}},Xn=class Gp extends et{constructor(t=[new ie(0,-.5),new ie(.5,0),new ie(0,.5)],i=12,r=0,a=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:i,phiStart:r,phiLength:a},i=Math.floor(i),a=Ze(a,0,Math.PI*2);let n=[],s=[],o=[],l=[],h=[],c=1/i,u=new R,d=new ie,p=new R,g=new R,v=new R,f=0,m=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:f=t[x+1].x-t[x].x,m=t[x+1].y-t[x].y,p.x=m*1,p.y=-f,p.z=m*0,v.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:v.normalize(),l.push(v.x,v.y,v.z);break;default:f=t[x+1].x-t[x].x,m=t[x+1].y-t[x].y,p.x=m*1,p.y=-f,p.z=m*0,g.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),l.push(p.x,p.y,p.z),v.copy(g)}for(let x=0;x<=i;x++){let S=r+x*c*a,_=Math.sin(S),E=Math.cos(S);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*_,u.y=t[A].y,u.z=t[A].x*E,s.push(u.x,u.y,u.z),d.x=x/i,d.y=A/(t.length-1),o.push(d.x,d.y);let y=l[3*A+0]*_,M=l[3*A+1],w=l[3*A+0]*E;h.push(y,M,w)}}for(let x=0;x<i;x++)for(let S=0;S<t.length-1;S++){let _=S+x*t.length,E=_,A=_+t.length,y=_+t.length+1,M=_+1;n.push(E,A,M),n.push(y,M,A)}this.setIndex(n),this.setAttribute("position",new De(s,3)),this.setAttribute("uv",new De(o,2)),this.setAttribute("normal",new De(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gp(t.points,t.segments,t.phiStart,t.phiLength)}},Kh=class Vp extends Ga{constructor(t=1,i=0){let r=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(r,a,t,i),this.type="OctahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new Vp(t.radius,t.detail)}},zi=class Wp extends et{constructor(t=1,i=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:r,heightSegments:a};let n=t/2,s=i/2,o=Math.floor(r),l=Math.floor(a),h=o+1,c=l+1,u=t/o,d=i/l,p=[],g=[],v=[],f=[];for(let m=0;m<c;m++){let x=m*d-s;for(let S=0;S<h;S++){let _=S*u-n;g.push(_,-x,0),v.push(0,0,1),f.push(S/o),f.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<o;x++){let S=x+h*m,_=x+h*(m+1),E=x+1+h*(m+1),A=x+1+h*m;p.push(S,_,A),p.push(_,E,A)}this.setIndex(p),this.setAttribute("position",new De(g,3)),this.setAttribute("normal",new De(v,3)),this.setAttribute("uv",new De(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wp(t.width,t.height,t.widthSegments,t.heightSegments)}},Xp=class jp extends et{constructor(t=.5,i=1,r=32,a=1,n=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:i,thetaSegments:r,phiSegments:a,thetaStart:n,thetaLength:s},r=Math.max(3,r),a=Math.max(1,a);let o=[],l=[],h=[],c=[],u=t,d=(i-t)/a,p=new R,g=new ie;for(let v=0;v<=a;v++){for(let f=0;f<=r;f++){let m=n+f/r*s;p.x=u*Math.cos(m),p.y=u*Math.sin(m),l.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/i+1)/2,g.y=(p.y/i+1)/2,c.push(g.x,g.y)}u+=d}for(let v=0;v<a;v++){let f=v*(r+1);for(let m=0;m<r;m++){let x=m+f,S=x,_=x+r+1,E=x+r+2,A=x+1;o.push(S,_,A),o.push(_,E,A)}}this.setIndex(o),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jp(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},qp=class Yp extends et{constructor(t=new Wn([new ie(0,.5),new ie(-.5,-.5),new ie(.5,-.5)]),i=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:i};let r=[],a=[],n=[],s=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let c=0;c<t.length;c++)h(t[c]),this.addGroup(o,l,c),o+=l,l=0;this.setIndex(r),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(n,3)),this.setAttribute("uv",new De(s,2));function h(c){let u=a.length/3,d=c.extractPoints(i),p=d.shape,g=d.holes;ar.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,m=g.length;f<m;f++){let x=g[f];ar.isClockWise(x)===!0&&(g[f]=x.reverse())}let v=ar.triangulateShape(p,g);for(let f=0,m=g.length;f<m;f++){let x=g[f];p=p.concat(x)}for(let f=0,m=p.length;f<m;f++){let x=p[f];a.push(x.x,x.y,0),n.push(0,0,1),s.push(x.x,x.y)}for(let f=0,m=v.length;f<m;f++){let x=v[f],S=x[0]+u,_=x[1]+u,E=x[2]+u;r.push(S,_,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes;return rv(i,t)}static fromJSON(t,i){let r=[];for(let a=0,n=t.shapes.length;a<n;a++){let s=i[t.shapes[a]];r.push(s)}return new Yp(r,t.curveSegments)}};function rv(e,t){if(t.shapes=[],Array.isArray(e))for(let i=0,r=e.length;i<r;i++){let a=e[i];t.shapes.push(a.uuid)}else t.shapes.push(e.uuid);return t}var hi=class Zp extends et{constructor(t=1,i=32,r=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:i,heightSegments:r,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},i=Math.max(3,Math.floor(i)),r=Math.max(2,Math.floor(r));let l=Math.min(s+o,Math.PI),h=0,c=[],u=new R,d=new R,p=[],g=[],v=[],f=[];for(let m=0;m<=r;m++){let x=[],S=m/r,_=s+S*o,E=t*Math.cos(_),A=Math.sqrt(t*t-E*E),y=0;m===0&&s===0?y=.5/i:m===r&&l===Math.PI&&(y=-.5/i);for(let M=0;M<=i;M++){let w=M/i,L=a+w*n;u.x=-A*Math.cos(L),u.y=E,u.z=A*Math.sin(L),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),f.push(w+y,1-S),x.push(h++)}c.push(x)}for(let m=0;m<r;m++)for(let x=0;x<i;x++){let S=c[m][x+1],_=c[m][x],E=c[m+1][x],A=c[m+1][x+1];(m!==0||s>0)&&p.push(S,_,A),(m!==r-1||l<Math.PI)&&p.push(_,E,A)}this.setIndex(p),this.setAttribute("position",new De(g,3)),this.setAttribute("normal",new De(v,3)),this.setAttribute("uv",new De(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zp(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Jp=class Kp extends Ga{constructor(t=1,i=0){let r=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],a=[2,1,0,0,3,2,1,3,0,2,3,1];super(r,a,t,i),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new Kp(t.radius,t.detail)}},Tr=class $p extends et{constructor(t=1,i=.4,r=12,a=48,n=Math.PI*2,s=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:i,radialSegments:r,tubularSegments:a,arc:n,thetaStart:s,thetaLength:o},r=Math.floor(r),a=Math.floor(a);let l=[],h=[],c=[],u=[],d=new R,p=new R,g=new R;for(let v=0;v<=r;v++){let f=s+v/r*o;for(let m=0;m<=a;m++){let x=m/a*n;p.x=(t+i*Math.cos(f))*Math.cos(x),p.y=(t+i*Math.cos(f))*Math.sin(x),p.z=i*Math.sin(f),h.push(p.x,p.y,p.z),d.x=t*Math.cos(x),d.y=t*Math.sin(x),g.subVectors(p,d).normalize(),c.push(g.x,g.y,g.z),u.push(m/a),u.push(v/r)}}for(let v=1;v<=r;v++)for(let f=1;f<=a;f++){let m=(a+1)*v+f-1,x=(a+1)*(v-1)+f-1,S=(a+1)*(v-1)+f,_=(a+1)*v+f;l.push(m,x,_),l.push(x,S,_)}this.setIndex(l),this.setAttribute("position",new De(h,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $p(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},Qp=class ef extends et{constructor(t=1,i=.4,r=64,a=8,n=2,s=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:i,tubularSegments:r,radialSegments:a,p:n,q:s},r=Math.floor(r),a=Math.floor(a);let o=[],l=[],h=[],c=[],u=new R,d=new R,p=new R,g=new R,v=new R,f=new R,m=new R;for(let S=0;S<=r;++S){let _=S/r*n*Math.PI*2;x(_,n,s,t,p),x(_+.01,n,s,t,g),f.subVectors(g,p),m.addVectors(g,p),v.crossVectors(f,m),m.crossVectors(v,f),v.normalize(),m.normalize();for(let E=0;E<=a;++E){let A=E/a*Math.PI*2,y=-i*Math.cos(A),M=i*Math.sin(A);u.x=p.x+(y*m.x+M*v.x),u.y=p.y+(y*m.y+M*v.y),u.z=p.z+(y*m.z+M*v.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),h.push(d.x,d.y,d.z),c.push(S/r),c.push(E/a)}}for(let S=1;S<=r;S++)for(let _=1;_<=a;_++){let E=(a+1)*(S-1)+(_-1),A=(a+1)*S+(_-1),y=(a+1)*S+_,M=(a+1)*(S-1)+_;o.push(E,A,M),o.push(A,y,M)}this.setIndex(o),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(c,2));function x(S,_,E,A,y){let M=Math.cos(S),w=Math.sin(S),L=E/_*S,N=Math.cos(L);y.x=A*(2+N)*.5*M,y.y=A*(2+N)*w*.5,y.z=A*Math.sin(L)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ef(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},tf=class rf extends et{constructor(t=new Zh(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),i=64,r=1,a=8,n=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:i,radius:r,radialSegments:a,closed:n};let s=t.computeFrenetFrames(i,n);this.tangents=s.tangents,this.normals=s.normals,this.binormals=s.binormals;let o=new R,l=new R,h=new ie,c=new R,u=[],d=[],p=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(d,3)),this.setAttribute("uv",new De(p,2));function v(){for(let S=0;S<i;S++)f(S);f(n===!1?i:0),x(),m()}function f(S){c=t.getPointAt(S/i,c);let _=s.normals[S],E=s.binormals[S];for(let A=0;A<=a;A++){let y=A/a*Math.PI*2,M=Math.sin(y),w=-Math.cos(y);l.x=w*_.x+M*E.x,l.y=w*_.y+M*E.y,l.z=w*_.z+M*E.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=c.x+r*l.x,o.y=c.y+r*l.y,o.z=c.z+r*l.z,u.push(o.x,o.y,o.z)}}function m(){for(let S=1;S<=i;S++)for(let _=1;_<=a;_++){let E=(a+1)*(S-1)+(_-1),A=(a+1)*S+(_-1),y=(a+1)*S+_,M=(a+1)*(S-1)+_;g.push(E,A,M),g.push(A,y,M)}}function x(){for(let S=0;S<=i;S++)for(let _=0;_<=a;_++)h.x=S/i,h.y=_/a,p.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new rf(new Do[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},af=class extends et{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,r=new R,a=new R;if(e.index!==null){let n=e.attributes.position,s=e.index,o=e.groups;o.length===0&&(o=[{start:0,count:s.count,materialIndex:0}]);for(let l=0,h=o.length;l<h;++l){let c=o[l],u=c.start,d=c.count;for(let p=u,g=u+d;p<g;p+=3)for(let v=0;v<3;v++){let f=s.getX(p+v),m=s.getX(p+(v+1)%3);r.fromBufferAttribute(n,f),a.fromBufferAttribute(n,m),fu(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}}else{let n=e.attributes.position;for(let s=0,o=n.count/3;s<o;s++)for(let l=0;l<3;l++){let h=3*s+l,c=3*s+(l+1)%3;r.fromBufferAttribute(n,h),a.fromBufferAttribute(n,c),fu(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}this.setAttribute("position",new De(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function fu(e,t,i){let r=`${e.x},${e.y},${e.z}-${t.x},${t.y},${t.z}`,a=`${t.x},${t.y},${t.z}-${e.x},${e.y},${e.z}`;return i.has(r)===!0||i.has(a)===!0?!1:(i.add(r),i.add(a),!0)}var mu=Object.freeze({__proto__:null,BoxGeometry:zt,CapsuleGeometry:Ko,CircleGeometry:xp,ConeGeometry:ra,CylinderGeometry:Nt,DodecahedronGeometry:wp,EdgesGeometry:Ap,ExtrudeGeometry:Bp,IcosahedronGeometry:Hp,LatheGeometry:Xn,OctahedronGeometry:Kh,PlaneGeometry:zi,PolyhedronGeometry:Ga,RingGeometry:Xp,ShapeGeometry:qp,SphereGeometry:hi,TetrahedronGeometry:Jp,TorusGeometry:Tr,TorusKnotGeometry:Qp,TubeGeometry:tf,WireframeGeometry:af}),nf=class extends jt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ae(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function Ha(e){let t={};for(let i in e){t[i]={};for(let r in e[i]){let a=e[i][r];if(gu(a))a.isRenderTargetTexture?(xe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][r]=null):t[i][r]=a.clone();else if(Array.isArray(a))if(gu(a[0])){let n=[];for(let s=0,o=a.length;s<o;s++)n[s]=a[s].clone();t[i][r]=n}else t[i][r]=a.slice();else t[i][r]=a}}return t}function ai(e){let t={};for(let i=0;i<e.length;i++){let r=Ha(e[i]);for(let a in r)t[a]=r[a]}return t}function gu(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function av(e){let t=[];for(let i=0;i<e.length;i++)t.push(e[i].clone());return t}function sf(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ot.workingColorSpace}var of={clone:Ha,merge:ai},nv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,cr=class extends jt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nv,this.fragmentShader=sv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ha(e.uniforms),this.uniformsGroups=av(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Ae().setHex(r.value);break;case"v2":this.uniforms[i].value=new ie().fromArray(r.value);break;case"v3":this.uniforms[i].value=new R().fromArray(r.value);break;case"v4":this.uniforms[i].value=new _t().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Qe().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Ye().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},$h=class extends cr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},qt=class extends jt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},lf=class extends qt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ie(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return nr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){nr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},hf=class extends jt{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ae(16777215),this.specular=new Ae(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.combine=zn,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},cf=class extends jt{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Ae(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},uf=class extends jt{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},Va=class extends jt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oi,this.combine=zn,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Qh=class extends jt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ec=class extends jt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},df=class extends jt{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Ae(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hr,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}},pf=class extends li{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Li(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function La(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function ff(e){function t(a,n){return e[a]-e[n]}let i=e.length,r=new Array(i);for(let a=0;a!==i;++a)r[a]=a;return r.sort(t),r}function hh(e,t,i){let r=e.length,a=new e.constructor(r);for(let n=0,s=0;s!==r;++n){let o=i[n]*t;for(let l=0;l!==t;++l)a[s++]=e[o+l]}return a}function mf(e,t,i,r){let a=1,n=e[0];for(;n!==void 0&&n[r]===void 0;)n=e[a++];if(n===void 0)return;let s=n[r];if(s!==void 0)if(Array.isArray(s))do s=n[r],s!==void 0&&(t.push(n.time),i.push(...s)),n=e[a++];while(n!==void 0);else if(s.toArray!==void 0)do s=n[r],s!==void 0&&(t.push(n.time),s.toArray(i,i.length)),n=e[a++];while(n!==void 0);else do s=n[r],s!==void 0&&(t.push(n.time),i.push(s)),n=e[a++];while(n!==void 0)}function ov(e,t,i,r,a=30){let n=e.clone();n.name=t;let s=[];for(let l=0;l<n.tracks.length;++l){let h=n.tracks[l],c=h.getValueSize(),u=[],d=[];for(let p=0;p<h.times.length;++p){let g=h.times[p]*a;if(!(g<i||g>=r)){u.push(h.times[p]);for(let v=0;v<c;++v)d.push(h.values[p*c+v])}}u.length!==0&&(h.times=Li(u,h.times.constructor),h.values=Li(d,h.values.constructor),s.push(h))}n.tracks=s;let o=1/0;for(let l=0;l<n.tracks.length;++l)o>n.tracks[l].times[0]&&(o=n.tracks[l].times[0]);for(let l=0;l<n.tracks.length;++l)n.tracks[l].shift(-1*o);return n.resetDuration(),n}function lv(e,t=0,i=e,r=30){r<=0&&(r=30);let a=i.tracks.length,n=t/r;for(let s=0;s<a;++s){let o=i.tracks[s],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;let h=e.tracks.find(function(m){return m.name===o.name&&m.ValueTypeName===l});if(h===void 0)continue;let c=0,u=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(c=u/3);let d=0,p=h.getValueSize();h.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=p/3);let g=o.times.length-1,v;if(n<=o.times[0]){let m=c,x=u-c;v=o.values.slice(m,x)}else if(n>=o.times[g]){let m=g*u+c,x=m+u-c;v=o.values.slice(m,x)}else{let m=o.createInterpolant();m.evaluate(n),v=m.resultBuffer.slice()}l==="quaternion"&&new Ct().fromArray(v).normalize().conjugate().toArray(v);let f=h.times.length;for(let m=0;m<f;++m){let x=m*p+d;if(l==="quaternion")Ct.multiplyQuaternionsFlat(h.values,x,v,0,h.values,x);else{let S=p-d*2;for(let _=0;_<S;++_)h.values[x+_]-=v[_]}}}return e.blendMode=Ih,e}var hv=class{static convertArray(e,t){return Li(e,t)}static isTypedArray(e){return Gd(e)}static hasTangents(e){return La(e)}static getKeyframeOrder(e){return ff(e)}static sortedArray(e,t,i){return hh(e,t,i)}static flattenJSON(e,t,i,r){mf(e,t,i,r)}static subclip(e,t,i,r,a=30){return ov(e,t,i,r,a)}static makeClipAdditive(e,t=0,i=e,r=30){return lv(e,t,i,r)}},Wa=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],a=t[i-1];e:{t:{let n;i:{r:if(!(e<r)){for(let s=i+2;;){if(r===void 0){if(e<a)break r;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===s)break;if(a=r,r=t[++i],e<r)break t}n=t.length;break i}if(!(e>=a)){let s=t[1];e<s&&(i=2,a=s);for(let o=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===o)break;if(r=a,a=t[--i-1],e>=a)break t}n=i,i=0;break i}break e}for(;i<n;){let s=i+n>>>1;e<t[s]?n=s:i=s+1}if(r=t[i],a=t[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,r)}return this.interpolate_(i,a,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,a=e*r;for(let n=0;n!==r;++n)t[n]=i[a+n];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},gf=class extends Wa{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xr,endingEnd:Xr}}intervalChanged_(e,t,i){let r=this.parameterPositions,a=e-2,n=e+1,s=r[a],o=r[n];if(s===void 0)switch(this.getSettings_().endingStart){case jr:a=e,s=2*t-i;break;case An:a=r.length-2,s=t+r[a]-r[a+1];break;default:a=e,s=i}if(o===void 0)switch(this.getSettings_().endingEnd){case jr:n=e,o=2*i-t;break;case An:n=1,o=i+r[1]-r[0];break;default:n=e-1,o=t}let l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-s),this._weightNext=l/(o-i),this._offsetPrev=a*h,this._offsetNext=n*h}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this._offsetPrev,c=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(i-t)/(r-t),g=p*p,v=g*p,f=-u*v+2*u*g-u*p,m=(1+u)*v+(-1.5-2*u)*g+(-.5+u)*p+1,x=(-1-d)*v+(1.5+d)*g+.5*p,S=d*v-d*g;for(let _=0;_!==s;++_)a[_]=f*n[h+_]+m*n[l+_]+x*n[o+_]+S*n[c+_];return a}},tc=class extends Wa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=(i-t)/(r-t),c=1-h;for(let u=0;u!==s;++u)a[u]=n[l+u]*c+n[o+u]*h;return a}},vf=class extends Wa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},_f=class extends Wa{interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this.inTangents,c=this.outTangents;if(!h||!c){let p=(i-t)/(r-t),g=1-p;for(let v=0;v!==s;++v)a[v]=n[l+v]*g+n[o+v]*p;return a}let u=s*2,d=e-1;for(let p=0;p!==s;++p){let g=n[l+p],v=n[o+p],f=d*u+p*2,m=c[f],x=c[f+1],S=e*u+p*2,_=h[S],E=h[S+1],A=uv(i,t,m,_,r);a[p]=yf(A,g,x,E,v)}return a}};function yf(e,t,i,r,a){let n=1-e;return n*n*n*t+3*n*n*e*i+3*n*e*e*r+e*e*e*a}function cv(e,t,i,r,a){let n=1-e;return 3*n*n*(i-t)+6*n*e*(r-i)+3*e*e*(a-r)}function uv(e,t,i,r,a){let n=(e-t)/(a-t);for(let s=0;s<8;s++){let o=yf(n,t,i,r,a)-e;if(Math.abs(o)<1e-10)break;let l=cv(n,t,i,r,a);if(Math.abs(l)<1e-10)break;n=Math.max(0,Math.min(1,n-o/l))}return n}var wi=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Li(t,this.TimeBufferType),this.values=Li(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Li(e.times,Array),values:Li(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),La(e.settings)&&(i.settings={inTangents:Li(e.settings.inTangents,Array),outTangents:Li(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new vf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new tc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new gf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new _f(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Tn:t=this.InterpolantFactoryMethodDiscrete;break;case Io:t=this.InterpolantFactoryMethodLinear;break;case Hs:t=this.InterpolantFactoryMethodSmooth;break;case ah:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return xe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Tn;case this.InterpolantFactoryMethodLinear:return Io;case this.InterpolantFactoryMethodSmooth:return Hs;case this.InterpolantFactoryMethodBezier:return ah}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e;La(this.settings)&&(vu(this.settings.inTangents,e),vu(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;La(this.settings)&&(_u(this.settings.inTangents,e),_u(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,a=0,n=r-1;for(;a!==r&&i[a]<e;)++a;for(;n!==-1&&i[n]>t;)--n;if(++n,a!==0||n!==r){a>=n&&(n=Math.max(n,1),a=n-1);let s=this.getValueSize();this.times=i.slice(a,n),this.values=this.values.slice(a*s,n*s)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,a=i.length;a===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let n=null;for(let s=0;s!==a;s++){let o=i[s];if(typeof o=="number"&&isNaN(o)){ke("KeyframeTrack: Time is not a valid number.",this,s,o),e=!1;break}if(n!==null&&n>o){ke("KeyframeTrack: Out of order keys.",this,s,o,n),e=!1;break}n=o}if(r!==void 0&&Gd(r))for(let s=0,o=r.length;s!==o;++s){let l=r[s];if(isNaN(l)){ke("KeyframeTrack: Value is not a valid number.",this,s,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===Hs,a=e.length-1,n=1;for(let s=1;s<a;++s){let o=!1,l=e[s],h=e[s+1];if(l!==h&&(s!==1||l!==e[0]))if(r)o=!0;else{let c=s*i,u=c-i,d=c+i;for(let p=0;p!==i;++p){let g=t[c+p];if(g!==t[u+p]||g!==t[d+p]){o=!0;break}}}if(o){if(s!==n){e[n]=e[s];let c=s*i,u=n*i;for(let d=0;d!==i;++d)t[u+d]=t[c+d]}++n}}if(a>0){e[n]=e[a];for(let s=a*i,o=n*i,l=0;l!==i;++l)t[o+l]=t[s+l];++n}return n!==e.length?(this.times=e.slice(0,n),this.values=t.slice(0,n*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,La(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function vu(e,t){for(let i=0,r=e.length;i!==r;i+=2)e[i]+=t}function _u(e,t){for(let i=0,r=e.length;i!==r;i+=2)e[i]*=t}wi.prototype.ValueTypeName="";wi.prototype.TimeBufferType=Float32Array;wi.prototype.ValueBufferType=Float32Array;wi.prototype.DefaultInterpolation=Io;var aa=class extends wi{constructor(e,t,i){super(e,t,i)}};aa.prototype.ValueTypeName="bool";aa.prototype.ValueBufferType=Array;aa.prototype.DefaultInterpolation=Tn;aa.prototype.InterpolantFactoryMethodLinear=void 0;aa.prototype.InterpolantFactoryMethodSmooth=void 0;var ic=class extends wi{constructor(e,t,i,r){super(e,t,i,r)}};ic.prototype.ValueTypeName="color";var Qo=class extends wi{constructor(e,t,i,r){super(e,t,i,r)}};Qo.prototype.ValueTypeName="number";var xf=class extends Wa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=(i-t)/(r-t),l=e*s;for(let h=l+s;l!==h;l+=4)Ct.slerpFlat(a,0,n,l-s,n,l,o);return a}},el=class extends wi{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new xf(this.times,this.values,this.getValueSize(),e)}};el.prototype.ValueTypeName="quaternion";el.prototype.InterpolantFactoryMethodSmooth=void 0;var na=class extends wi{constructor(e,t,i){super(e,t,i)}};na.prototype.ValueTypeName="string";na.prototype.ValueBufferType=Array;na.prototype.DefaultInterpolation=Tn;na.prototype.InterpolantFactoryMethodLinear=void 0;na.prototype.InterpolantFactoryMethodSmooth=void 0;var rc=class extends wi{constructor(e,t,i,r){super(e,t,i,r)}};rc.prototype.ValueTypeName="vector";var Fn=class{constructor(e="",t=-1,i=[],r=Go){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=Ei(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,r=1/(e.fps||1);for(let n=0,s=i.length;n!==s;++n)t.push(pv(i[n]).scale(r));let a=new this(e.name,e.duration,t,e.blendMode);return a.uuid=e.uuid,a.userData=JSON.parse(e.userData||"{}"),a}static toJSON(e){let t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let a=0,n=i.length;a!==n;++a)t.push(wi.toJSON(i[a]));return r}static CreateFromMorphTargetSequence(e,t,i,r){let a=t.length,n=[];for(let s=0;s<a;s++){let o=[],l=[];o.push((s+a-1)%a,s,(s+1)%a),l.push(0,1,0);let h=ff(o);o=hh(o,1,h),l=hh(l,1,h),!r&&o[0]===0&&(o.push(a),l.push(l[0])),n.push(new Qo(".morphTargetInfluences["+t[s].name+"]",o,l).scale(1/i))}return new this(e,-1,n)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let r={},a=/^([\w-]*?)([\d]+)$/;for(let s=0,o=e.length;s<o;s++){let l=e[s],h=l.name.match(a);if(h&&h.length>1){let c=h[1],u=r[c];u||(r[c]=u=[]),u.push(l)}}let n=[];for(let s in r)n.push(this.CreateFromMorphTargetSequence(s,r[s],t,i));return n}resetDuration(){let e=this.tracks,t=0;for(let i=0,r=e.length;i!==r;++i){let a=this.tracks[i];t=Math.max(t,a.times[a.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function dv(e){switch(e.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qo;case"vector":case"vector2":case"vector3":case"vector4":return rc;case"color":return ic;case"quaternion":return el;case"bool":case"boolean":return aa;case"string":return na}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+e)}function pv(e){if(e.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=dv(e.type);if(e.times===void 0){let r=[],a=[];mf(e.keys,r,a,"value"),e.times=r,e.values=a}let i;return t.parse!==void 0?i=t.parse(e):i=new t(e.name,e.times,e.values,e.interpolation),La(e.settings)&&(i.settings={inTangents:Li(e.settings.inTangents,Float32Array),outTangents:Li(e.settings.outTangents,Float32Array)}),i}var Wi={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(yu(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!yu(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function yu(e){try{let t=e.slice(e.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var ac=class{constructor(e,t,i){let r=this,a=!1,n=0,s=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){s++,a===!1&&r.onStart!==void 0&&r.onStart(h,n,s),a=!0},this.itemEnd=function(h){n++,r.onProgress!==void 0&&r.onProgress(h,n,s),n===s&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),o?o(h):h},this.setURLModifier=function(h){return o=h,this},this.addHandler=function(h,c){return l.push(h,c),this},this.removeHandler=function(h){let c=l.indexOf(h);return c!==-1&&l.splice(c,2),this},this.getHandler=function(h){for(let c=0,u=l.length;c<u;c+=2){let d=l[c],p=l[c+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Sf=new ac,fi=class{constructor(e){this.manager=e!==void 0?e:Sf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,a){i.load(e,r,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};fi.DEFAULT_MATERIAL_NAME="__DEFAULT";var er={},fv=class extends Error{constructor(e,t){super(e),this.response=t}},ur=class extends fi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=Wi.get(`file:${e}`);if(a!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(a),this.manager.itemEnd(e)},0);return}if(er[e]!==void 0){er[e].push({onLoad:t,onProgress:i,onError:r});return}er[e]=[],er[e].push({onLoad:t,onProgress:i,onError:r});let n=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),s=this.mimeType,o=this.responseType;fetch(n).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&xe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=er[e],c=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0,g=0,v=new ReadableStream({start(f){m();function m(){c.read().then(({done:x,value:S})=>{if(x)f.close();else{g+=S.byteLength;let _=new ProgressEvent("progress",{lengthComputable:p,loaded:g,total:d});for(let E=0,A=h.length;E<A;E++){let y=h[E];y.onProgress&&y.onProgress(_)}f.enqueue(S),m()}},x=>{f.error(x)})}}});return new Response(v)}else throw new fv(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,s));case"json":return l.json();default:if(s==="")return l.text();{let h=/charset="?([^;"\s]*)"?/i.exec(s),c=h&&h[1]?h[1].toLowerCase():void 0,u=new TextDecoder(c);return l.arrayBuffer().then(d=>u.decode(d))}}}).then(l=>{Wi.add(`file:${e}`,l);let h=er[e];delete er[e];for(let c=0,u=h.length;c<u;c++){let d=h[c];d.onLoad&&d.onLoad(l)}}).catch(l=>{let h=er[e];if(h===void 0)throw this.manager.itemError(e),l;delete er[e];for(let c=0,u=h.length;c<u;c++){let d=h[c];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},mv=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new ur(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setPath(this.path),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials),n.load(e,function(s){try{t(a.parse(JSON.parse(s)))}catch(o){r?r(o):ke(o),a.manager.itemError(e)}},i,r)}parse(e){let t=[];for(let i=0;i<e.length;i++){let r=Fn.parse(e[i]);t.push(r)}return t}},gv=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=[],s=new Jo,o=new ur(this.manager);o.setPriority(this.priority),o.setCache(this.cache),o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(a.withCredentials);let l=0;function h(c){o.load(e[c],function(u){let d=a.parse(u,!0);n[c]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},l+=1,l===6&&(d.mipmapCount===1&&(s.minFilter=Et),s.image=n,s.format=d.format,s.needsUpdate=!0,t&&t(s))},i,r)}if(Array.isArray(e))for(let c=0,u=e.length;c<u;++c)h(c);else o.load(e,function(c){let u=a.parse(c,!0);if(u.isCubemap){let d=u.mipmaps.length/u.mipmapCount;for(let p=0;p<d;p++){n[p]={mipmaps:[]};for(let g=0;g<u.mipmapCount;g++)n[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+g]),n[p].format=u.format,n[p].width=u.width,n[p].height=u.height}s.image=n}else s.image.width=u.width,s.image.height=u.height,s.mipmaps=u.mipmaps;u.mipmapCount===1&&(s.minFilter=Et),s.format=u.format,s.needsUpdate=!0,t&&t(s)},i,r);return s}},Ma=new WeakMap,Bn=class extends fi{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,n=Wi.get(`image:${e}`);if(n!==void 0){if(n.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(n),a.manager.itemEnd(e)},0);else{let c=Ma.get(n);c===void 0&&(c=[],Ma.set(n,c)),c.push({onLoad:t,onError:r})}return n}let s=In("img");function o(){h(),t&&t(this);let c=Ma.get(this)||[];for(let u=0;u<c.length;u++){let d=c[u];d.onLoad&&d.onLoad(this)}Ma.delete(this),a.manager.itemEnd(e)}function l(c){h(),r&&r(c),Wi.remove(`image:${e}`);let u=Ma.get(this)||[];for(let d=0;d<u.length;d++){let p=u[d];p.onError&&p.onError(c)}Ma.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){s.removeEventListener("load",o,!1),s.removeEventListener("error",l,!1)}return s.addEventListener("load",o,!1),s.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(s.crossOrigin=this.crossOrigin),Wi.add(`image:${e}`,s),a.manager.itemStart(e),s.fetchPriority=this.priority,s.src=e,s}},vv=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=new Vn;a.colorSpace=Ut;let n=new Bn(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setCrossOrigin(this.crossOrigin),n.setPath(this.path);let s=0;function o(l){n.load(e[l],function(h){a.images[l]=h,s++,s===6&&(a.needsUpdate=!0,t&&t(a))},void 0,r)}for(let l=0;l<e.length;++l)o(l);return a}},_v=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new Mi,s=new ur(this.manager);return s.setPriority(this.priority),s.setCache(this.cache),s.setResponseType("arraybuffer"),s.setRequestHeader(this.requestHeader),s.setPath(this.path),s.setWithCredentials(a.withCredentials),s.load(e,function(o){let l;try{l=a.parse(o)}catch(h){r!==void 0?r(h):ke(h);return}a._applyTexData(n,l),t&&t(n,l)},i,r),n}createDataTexture(e){let t=new Mi;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:Gt,e.wrapT=t.wrapT!==void 0?t.wrapT:Gt,e.magFilter=t.magFilter!==void 0?t.magFilter:Et,e.minFilter=t.minFilter!==void 0?t.minFilter:Et,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Ni),t.mipmapCount===1&&(e.minFilter=Et),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},nc=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=new Bt,n=new Bn(this.manager);return n.setPriority(this.priority),n.setCache(this.cache),n.setCrossOrigin(this.crossOrigin),n.setPath(this.path),n.load(e,function(s){a.image=s,a.needsUpdate=!0,t!==void 0&&t(a)},i,r),a}},Ar=class extends mt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},tl=class extends Ar{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Xl=new Ye,xu=new R,Su=new R,il=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ie(512,512),this.mapType=di,this.map=null,this.mapPass=null,this.matrix=new Ye,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qr,this._frameExtents=new ie(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;xu.setFromMatrixPosition(e.matrixWorld),t.position.copy(xu),Su.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Su),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,r){Xl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Xl,e.coordinateSystem,e.reversedDepth);let a=this._frameExtents,n=r?r.z/a.x:1,s=r?r.w/a.y:1,o=r?r.x/a.x:0,l=r?r.y/a.y:0;e.coordinateSystem===$r||e.reversedDepth?t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,1,0,0,0,0,1):t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,.5,.5,0,0,0,1),t.multiply(Xl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Cs=new R,Is=new Ct,ki=new R,rl=class extends mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ye,this.projectionMatrix=new Ye,this.projectionMatrixInverse=new Ye,this.coordinateSystem=_i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cs,Is,ki),ki.x===1&&ki.y===1&&ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cs,Is,ki.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Cs,Is,ki),ki.x===1&&ki.y===1&&ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cs,Is,ki.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},_r=new R,Mu=new ie,bu=new ie,kt=class extends rl{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){_r.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_r.x,_r.y).multiplyScalar(-e/_r.z),_r.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_r.x,_r.y).multiplyScalar(-e/_r.z)}getViewSize(e,t){return this.getViewBounds(e,Mu,bu),t.subVectors(bu,Mu)}setViewOffset(e,t,i,r,a,n){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Zr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,a=-.5*r,n=this.view;if(this.view!==null&&this.view.enabled){let o=n.fullWidth,l=n.fullHeight;a+=n.offsetX*r/o,t-=n.offsetY*i/l,r*=n.width/o,i*=n.height/l}let s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},yv=class extends il{constructor(){super(new kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=Fa*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||t.far;(i!==t.fov||r!==t.aspect||a!==t.far)&&(t.fov=i,t.aspect=r,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Mf=class extends Ar{constructor(e,t,i=0,r=Math.PI/3,a=0,n=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.distance=i,this.angle=r,this.penumbra=a,this.decay=n,this.map=null,this.shadow=new yv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},xv=class extends il{constructor(){super(new kt(90,1,.5,500)),this.isPointLightShadow=!0}},bf=class extends Ar{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new xv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},al=class extends rl{constructor(e=-1,t=1,i=1,r=-1,a=.1,n=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=a,this.far=n,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,a,n){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,a=i-e,n=i+e,s=r+t,o=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,n=a+l*this.view.width,s-=h*this.view.offsetY,o=s-h*this.view.height}this.projectionMatrix.makeOrthographic(a,n,s,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Sv=class extends il{constructor(){super(new al(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},nl=class extends Ar{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.shadow=new Sv}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ef=class extends Ar{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}},wf=class extends Ar{constructor(e,t,i=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=i,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}},sc=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new R)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let i=e.x,r=e.y,a=e.z,n=this.coefficients;return t.copy(n[0]).multiplyScalar(.282095),t.addScaledVector(n[1],.488603*r),t.addScaledVector(n[2],.488603*a),t.addScaledVector(n[3],.488603*i),t.addScaledVector(n[4],1.092548*(i*r)),t.addScaledVector(n[5],1.092548*(r*a)),t.addScaledVector(n[6],.315392*(3*a*a-1)),t.addScaledVector(n[7],1.092548*(i*a)),t.addScaledVector(n[8],.546274*(i*i-r*r)),t}getIrradianceAt(e,t){let i=e.x,r=e.y,a=e.z,n=this.coefficients;return t.copy(n[0]).multiplyScalar(.886227),t.addScaledVector(n[1],2*.511664*r),t.addScaledVector(n[2],2*.511664*a),t.addScaledVector(n[3],2*.511664*i),t.addScaledVector(n[4],2*.429043*i*r),t.addScaledVector(n[5],2*.429043*r*a),t.addScaledVector(n[6],.743125*a*a-.247708),t.addScaledVector(n[7],2*.429043*i*a),t.addScaledVector(n[8],.429043*(i*i-r*r)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let i=0;i<9;i++)this.coefficients[i].addScaledVector(e.coefficients[i],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let i=0;i<9;i++)this.coefficients[i].lerp(e.coefficients[i],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let i=this.coefficients;for(let r=0;r<9;r++)i[r].fromArray(e,t+r*3);return this}toArray(e=[],t=0){let i=this.coefficients;for(let r=0;r<9;r++)i[r].toArray(e,t+r*3);return e}static getBasisAt(e,t){let i=e.x,r=e.y,a=e.z;t[0]=.282095,t[1]=.488603*r,t[2]=.488603*a,t[3]=.488603*i,t[4]=1.092548*i*r,t[5]=1.092548*r*a,t[6]=.315392*(3*a*a-1),t[7]=1.092548*i*a,t[8]=.546274*(i*i-r*r)}},Tf=class extends Ar{constructor(e=new sc,t=1){super(void 0,t),this.isLightProbe=!0,this.type="LightProbe",this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}},Eu={},Af=class Rf extends fi{constructor(t){super(t),this.textures={}}load(t,i,r,a){let n=this,s=new ur(n.manager);s.setPriority(n.priority),s.setCache(n.cache),s.setPath(n.path),s.setRequestHeader(n.requestHeader),s.setWithCredentials(n.withCredentials),s.load(t,function(o){try{i(n.parse(JSON.parse(o)))}catch(l){a?a(l):ke(l),n.manager.itemError(t)}},r,a)}parse(t){let i=this.createMaterialFromType(t.type);return i.fromJSON(t,this.textures),i}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return Rf.createMaterialFromType(t)}static createMaterialFromType(t){let i={ShadowMaterial:nf,SpriteMaterial:Bh,RawShaderMaterial:$h,ShaderMaterial:cr,PointsMaterial:kh,MeshPhysicalMaterial:lf,MeshStandardMaterial:qt,MeshPhongMaterial:hf,MeshToonMaterial:cf,MeshNormalMaterial:uf,MeshLambertMaterial:Va,MeshDepthMaterial:Qh,MeshDistanceMaterial:ec,MeshBasicMaterial:oi,MeshMatcapMaterial:df,LineDashedMaterial:pf,LineBasicMaterial:li,Material:jt,...Eu}[t],r;return i===void 0?(nr(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),r=new jt):r=new i,r}static registerMaterial(t,i){Eu[t]=i}},ch=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Cf=class extends et{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},If=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new ur(a.manager);n.setPriority(a.priority),n.setCache(a.cache),n.setPath(a.path),n.setRequestHeader(a.requestHeader),n.setWithCredentials(a.withCredentials),n.load(e,function(s){try{t(a.parse(JSON.parse(s)))}catch(o){r?r(o):ke(o),a.manager.itemError(e)}},i,r)}parse(e){let t={},i={};function r(u,d){if(t[d]!==void 0)return t[d];let p=u.interleavedBuffers[d],g=a(u,p.buffer),v=Pa(p.type,g),f=new Zo(v,p.stride);return f.uuid=p.uuid,p.usage!==void 0&&f.setUsage(p.usage),t[d]=f,f}function a(u,d){if(i[d]!==void 0)return i[d];let p=u.arrayBuffers[d],g=new Uint32Array(p).buffer;return i[d]=g,g}let n=e.isInstancedBufferGeometry?new Cf:new et,s=e.data.index;if(s!==void 0){let u=Pa(s.type,s.array);n.setIndex(new Mt(u,1))}let o=e.data.attributes;for(let u in o){let d=o[u],p;if(d.isInterleavedBufferAttribute){let g=r(e.data,d.data);p=new Ln(g,d.itemSize,d.offset,d.normalized)}else{let g=Pa(d.type,d.array),v=d.isInstancedBufferAttribute?Ba:Mt;p=new v(g,d.itemSize,d.normalized)}d.name!==void 0&&(p.name=d.name),d.usage!==void 0&&p.setUsage(d.usage),d.gpuType!==void 0&&(p.gpuType=d.gpuType),n.setAttribute(u,p)}let l=e.data.morphAttributes;if(l)for(let u in l){let d=l[u],p=[];for(let g=0,v=d.length;g<v;g++){let f=d[g],m;if(f.isInterleavedBufferAttribute){let x=r(e.data,f.data);m=new Ln(x,f.itemSize,f.offset,f.normalized)}else{let x=Pa(f.type,f.array);m=new Mt(x,f.itemSize,f.normalized)}f.name!==void 0&&(m.name=f.name),f.usage!==void 0&&m.setUsage(f.usage),f.gpuType!==void 0&&(m.gpuType=f.gpuType),p.push(m)}n.morphAttributes[u]=p}e.data.morphTargetsRelative&&(n.morphTargetsRelative=!0);let h=e.data.groups||e.data.drawcalls||e.data.offsets;if(h!==void 0)for(let u=0,d=h.length;u!==d;++u){let p=h[u];n.addGroup(p.start,p.count,p.materialIndex)}let c=e.data.boundingSphere;return c!==void 0&&(n.boundingSphere=new Xt().fromJSON(c)),e.name&&(n.name=e.name),e.userData&&(n.userData=e.userData),n}},jl={},Mv=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=this.path===""?ch.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||n;let s=new ur(this.manager);s.setPriority(this.priority),s.setCache(this.cache),s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(o){let l=null;try{l=JSON.parse(o)}catch(c){r!==void 0&&r(c),ke("ObjectLoader: Can't parse "+e+".",c.message);return}let h=l.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){r!==void 0&&r(new Error("THREE.ObjectLoader: Can't load "+e)),ke("ObjectLoader: Can't load "+e);return}a.parse(l,t)},i,r)}async loadAsync(e,t){let i=this,r=this.path===""?ch.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||r;let a=new ur(this.manager);a.setPriority(this.priority),a.setCache(this.cache),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials);let n=await a.loadAsync(e,t),s;try{s=JSON.parse(n)}catch(l){throw new Error("THREE.ObjectLoader: Can't parse "+e+". "+l.message)}let o=s.metadata;if(o===void 0||o.type===void 0||o.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await i.parseAsync(s)}parse(e,t){let i=this.parseAnimations(e.animations),r=this.parseShapes(e.shapes),a=this.parseGeometries(e.geometries,r),n=this.parseImages(e.images,function(){t!==void 0&&t(l)}),s=this.parseTextures(e.textures,n),o=this.parseMaterials(e.materials,s),l=this.parseObject(e.object,a,o,s,i),h=this.parseSkeletons(e.skeletons,l);if(this.bindSkeletons(l,h),this.bindLightTargets(l),t!==void 0){let c=!1;for(let u in n)if(n[u].data instanceof HTMLImageElement){c=!0;break}c===!1&&t(l)}return l}async parseAsync(e){let t=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),a=await this.parseImagesAsync(e.images),n=this.parseTextures(e.textures,a),s=this.parseMaterials(e.materials,n),o=this.parseObject(e.object,r,s,n,t),l=this.parseSkeletons(e.skeletons,o);return this.bindSkeletons(o,l),this.bindLightTargets(o),o}static registerGeometry(e,t){jl[e]=t}parseShapes(e){let t={};if(e!==void 0)for(let i=0,r=e.length;i<r;i++){let a=new Wn().fromJSON(e[i]);t[a.uuid]=a}return t}parseSkeletons(e,t){let i={},r={};if(t.traverse(function(a){a.isBone&&(r[a.uuid]=a)}),e!==void 0)for(let a=0,n=e.length;a<n;a++){let s=new up().fromJSON(e[a],r);i[s.uuid]=s}return i}parseGeometries(e,t){let i={};if(e!==void 0){let r=new If;for(let a=0,n=e.length;a<n;a++){let s,o=e[a];switch(o.type){case"BufferGeometry":case"InstancedBufferGeometry":s=r.parse(o);break;default:o.type in mu?s=mu[o.type].fromJSON(o,t):o.type in jl?s=jl[o.type].fromJSON(o,t):xe(`ObjectLoader: Unknown geometry type "${o.type}". Use .registerGeometry() before starting the deserialization process.`)}s.uuid=o.uuid,o.name!==void 0&&(s.name=o.name),o.userData!==void 0&&(s.userData=o.userData),i[o.uuid]=s}}return i}parseMaterials(e,t){let i={},r={};if(e!==void 0){let a=new Af;a.setTextures(t);for(let n=0,s=e.length;n<s;n++){let o=e[n];i[o.uuid]===void 0&&(i[o.uuid]=a.parse(o)),r[o.uuid]=i[o.uuid]}}return r}parseAnimations(e){let t={};if(e!==void 0)for(let i=0;i<e.length;i++){let r=e[i],a=Fn.parse(r);t[a.uuid]=a}return t}parseImages(e,t){let i=this,r={},a;function n(o){return o=i.manager.resolveURL(o),i.manager.itemStart(o),a.load(o,function(){i.manager.itemEnd(o)},void 0,function(){i.manager.itemError(o),i.manager.itemEnd(o)})}function s(o){if(typeof o=="string"){let l=o,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(l)?l:i.resourcePath+l;return n(h)}else return o.data?{data:Pa(o.type,o.data),width:o.width,height:o.height}:null}if(e!==void 0&&e.length>0){let o=new ac(t);a=new Bn(o),a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin);for(let l=0,h=e.length;l<h;l++){let c=e[l],u=c.url;if(Array.isArray(u)){let d=[];for(let p=0,g=u.length;p<g;p++){let v=u[p],f=s(v);f!==null&&(f instanceof HTMLImageElement?d.push(f):d.push(new Mi(f.data,f.width,f.height)))}r[c.uuid]=new Vi(d)}else{let d=s(c.url);r[c.uuid]=new Vi(d)}}}return r}async parseImagesAsync(e){let t=this,i={},r;async function a(n){if(typeof n=="string"){let s=n,o=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(s)?s:t.resourcePath+s;return await r.loadAsync(o)}else return n.data?{data:Pa(n.type,n.data),width:n.width,height:n.height}:null}if(e!==void 0&&e.length>0){r=new Bn(this.manager),r.setPriority(this.priority),r.setCache(this.cache),r.setCrossOrigin(this.crossOrigin);for(let n=0,s=e.length;n<s;n++){let o=e[n],l=o.url;if(Array.isArray(l)){let h=[];for(let c=0,u=l.length;c<u;c++){let d=l[c],p=await a(d);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Mi(p.data,p.width,p.height)))}i[o.uuid]=new Vi(h)}else{let h=await a(o.url);i[o.uuid]=new Vi(h)}}}return i}parseTextures(e,t){function i(a,n){return typeof a=="number"?a:(xe("ObjectLoader.parseTexture: Constant should be in numeric form.",a),n[a])}let r={};if(e!==void 0)for(let a=0,n=e.length;a<n;a++){let s=e[a];s.image===void 0&&xe('ObjectLoader: No "image" specified for',s.uuid),t[s.image]===void 0&&xe("ObjectLoader: Undefined image",s.image);let o=t[s.image],l=o.data,h;Array.isArray(l)?(h=new Vn,l.length===6&&(h.needsUpdate=!0)):(l&&l.data?h=new Mi:h=new Bt,l&&(h.needsUpdate=!0)),h.source=o,h.uuid=s.uuid,s.name!==void 0&&(h.name=s.name),s.mapping!==void 0&&(h.mapping=i(s.mapping,bv)),s.channel!==void 0&&(h.channel=s.channel),s.offset!==void 0&&h.offset.fromArray(s.offset),s.repeat!==void 0&&h.repeat.fromArray(s.repeat),s.center!==void 0&&h.center.fromArray(s.center),s.rotation!==void 0&&(h.rotation=s.rotation),s.wrap!==void 0&&(h.wrapS=i(s.wrap[0],wu),h.wrapT=i(s.wrap[1],wu)),s.format!==void 0&&(h.format=s.format),s.internalFormat!==void 0&&(h.internalFormat=s.internalFormat),s.type!==void 0&&(h.type=s.type),s.colorSpace!==void 0&&(h.colorSpace=s.colorSpace),s.minFilter!==void 0&&(h.minFilter=i(s.minFilter,Tu)),s.magFilter!==void 0&&(h.magFilter=i(s.magFilter,Tu)),s.anisotropy!==void 0&&(h.anisotropy=s.anisotropy),s.flipY!==void 0&&(h.flipY=s.flipY),s.generateMipmaps!==void 0&&(h.generateMipmaps=s.generateMipmaps),s.mipmapsAutoUpdate!==void 0&&(h.mipmapsAutoUpdate=s.mipmapsAutoUpdate),s.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=s.premultiplyAlpha),s.unpackAlignment!==void 0&&(h.unpackAlignment=s.unpackAlignment),s.compareFunction!==void 0&&(h.compareFunction=s.compareFunction),s.normalized!==void 0&&(h.normalized=s.normalized),s.userData!==void 0&&(h.userData=s.userData),r[s.uuid]=h}return r}parseObject(e,t,i,r,a){let n;function s(u){return t[u]===void 0&&xe("ObjectLoader: Undefined geometry",u),t[u]}function o(u){if(u!==void 0){if(Array.isArray(u)){let d=[];for(let p=0,g=u.length;p<g;p++){let v=u[p];i[v]===void 0&&xe("ObjectLoader: Undefined material",v),d.push(i[v])}return d}return i[u]===void 0&&xe("ObjectLoader: Undefined material",u),i[u]}}function l(u){return r[u]===void 0&&xe("ObjectLoader: Undefined texture",u),r[u]}let h,c;switch(e.type){case"Scene":n=new Yo,e.background!==void 0&&(Number.isInteger(e.background)?n.background=new Ae(e.background):n.background=l(e.background)),e.environment!==void 0&&(n.environment=l(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?n.fog=new rp(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(n.fog=new tp(e.fog.color,e.fog.density)),e.fog.name!==""&&(n.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(n.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(n.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&n.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(n.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&n.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":n=new kt(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(n.focus=e.focus),e.zoom!==void 0&&(n.zoom=e.zoom),e.filmGauge!==void 0&&(n.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(n.filmOffset=e.filmOffset),e.view!==void 0&&(n.view=Object.assign({},e.view));break;case"OrthographicCamera":n=new al(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(n.zoom=e.zoom),e.view!==void 0&&(n.view=Object.assign({},e.view));break;case"AmbientLight":n=new Ef(e.color,e.intensity);break;case"DirectionalLight":n=new nl(e.color,e.intensity),n.target=e.target||"";break;case"PointLight":n=new bf(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":n=new wf(e.color,e.intensity,e.width,e.height);break;case"SpotLight":n=new Mf(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),n.target=e.target||"",e.map!==void 0&&(n.map=l(e.map));break;case"HemisphereLight":n=new tl(e.color,e.groundColor,e.intensity);break;case"LightProbe":let u=new sc().fromArray(e.sh);n=new Tf(u,e.intensity);break;case"SkinnedMesh":h=s(e.geometry),c=o(e.material),n=new cp(h,c),e.bindMode!==void 0&&(n.bindMode=e.bindMode),e.bindMatrix!==void 0&&n.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(n.skeleton=e.skeleton);break;case"Mesh":h=s(e.geometry),c=o(e.material),n=new Xe(h,c);break;case"InstancedMesh":h=s(e.geometry),c=o(e.material);let d=e.count,p=e.instanceMatrix,g=e.instanceColor;n=new ia(h,c,d),n.instanceMatrix=new Ba(new Float32Array(p.array),16),g!==void 0&&(n.instanceColor=new Ba(new Float32Array(g.array),g.itemSize));break;case"BatchedMesh":h=s(e.geometry),c=o(e.material),n=new fp(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,c),n.geometry=h,n.perObjectFrustumCulled=e.perObjectFrustumCulled,n.sortObjects=e.sortObjects,n._drawRanges=e.drawRanges,n._reservedRanges=e.reservedRanges,n._geometryInfo=e.geometryInfo.map(v=>{let f=null,m=null;return v.boundingBox!==void 0&&(f=new ei().fromJSON(v.boundingBox)),v.boundingSphere!==void 0&&(m=new Xt().fromJSON(v.boundingSphere)),{...v,boundingBox:f,boundingSphere:m}}),n._instanceInfo=e.instanceInfo,n._availableInstanceIds=e.availableInstanceIds,n._availableGeometryIds=e.availableGeometryIds,n._nextIndexStart=e.nextIndexStart,n._nextVertexStart=e.nextVertexStart,n._geometryCount=e.geometryCount,n._maxInstanceCount=e.maxInstanceCount,n._maxVertexCount=e.maxVertexCount,n._maxIndexCount=e.maxIndexCount,n._geometryInitialized=e.geometryInitialized,n._matricesTexture=l(e.matricesTexture.uuid),n._indirectTexture=l(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(n._colorsTexture=l(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(n.boundingSphere=new Xt().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(n.boundingBox=new ei().fromJSON(e.boundingBox));break;case"LOD":n=new hp;break;case"Line":n=new wr(s(e.geometry),o(e.material));break;case"LineLoop":n=new mp(s(e.geometry),o(e.material));break;case"LineSegments":n=new ji(s(e.geometry),o(e.material));break;case"PointCloud":case"Points":n=new gp(s(e.geometry),o(e.material));break;case"Sprite":n=new lp(o(e.material)),e.center!==void 0&&n.center.fromArray(e.center);break;case"Group":n=new Vt;break;case"Bone":n=new zh;break;default:n=new mt}if(n.uuid=e.uuid,e.name!==void 0&&(n.name=e.name),e.pivot!==void 0&&(n.pivot=new R().fromArray(e.pivot)),e.matrix!==void 0?(n.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(n.matrixAutoUpdate=e.matrixAutoUpdate),n.matrixAutoUpdate&&(n.matrix.decompose(n.position,n.quaternion,n.scale),n.pivot!==null&&n.position.copy(n.pivot).applyMatrix4(n.matrix).sub(n.pivot))):(e.position!==void 0&&n.position.fromArray(e.position),e.rotation!==void 0&&n.rotation.fromArray(e.rotation),e.quaternion!==void 0&&n.quaternion.fromArray(e.quaternion),e.scale!==void 0&&n.scale.fromArray(e.scale)),e.up!==void 0&&n.up.fromArray(e.up),e.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),e.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=e.morphTargetInfluences.slice()),e.castShadow!==void 0&&(n.castShadow=e.castShadow),e.receiveShadow!==void 0&&(n.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(n.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(n.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(n.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(n.shadow.radius=e.shadow.radius),e.shadow.blurSamples!==void 0&&(n.shadow.blurSamples=e.shadow.blurSamples),e.shadow.focus!==void 0&&(n.shadow.focus=e.shadow.focus),e.shadow.aspect!==void 0&&(n.shadow.aspect=e.shadow.aspect),e.shadow.mapSize!==void 0&&n.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.mapType!==void 0&&(n.shadow.mapType=e.shadow.mapType),e.shadow.camera!==void 0&&(n.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(n.visible=e.visible),e.frustumCulled!==void 0&&(n.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(n.renderOrder=e.renderOrder),e.static!==void 0&&(n.static=e.static),e.userData!==void 0&&(n.userData=e.userData),e.layers!==void 0&&(n.layers.mask=e.layers),e.children!==void 0){let u=e.children;for(let d=0;d<u.length;d++)n.add(this.parseObject(u[d],t,i,r,a))}if(e.animations!==void 0){let u=e.animations;for(let d=0;d<u.length;d++){let p=u[d];n.animations.push(a[p])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(n.autoUpdate=e.autoUpdate);let u=e.levels;for(let d=0;d<u.length;d++){let p=u[d],g=n.getObjectByProperty("uuid",p.object);g!==void 0&&n.addLevel(g,p.distance,p.hysteresis)}}return n}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(i){if(i.isSkinnedMesh===!0&&i.skeleton!==void 0){let r=t[i.skeleton];r===void 0?xe("ObjectLoader: No skeleton found with UUID:",i.skeleton):i.bind(r,i.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){let i=t.target,r=e.getObjectByProperty("uuid",i);r!==void 0?t.target=r:t.target=new mt}})}},bv={UVMapping:Uo,CubeReflectionMapping:or,CubeRefractionMapping:Jr,EquirectangularReflectionMapping:dn,EquirectangularRefractionMapping:pn},wu={RepeatWrapping:Mr,ClampToEdgeWrapping:Gt,MirroredRepeatWrapping:bn},Tu={NearestFilter:Rt,NearestMipmapNearestFilter:bh,NearestMipmapLinearFilter:Ia,LinearFilter:Et,LinearMipmapNearestFilter:fn,LinearMipmapLinearFilter:Ni},ql=new WeakMap,Ev=class extends fi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&xe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&xe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,n=Wi.get(`image-bitmap:${e}`);if(n!==void 0){if(a.manager.itemStart(e),n.then){n.then(l=>{ql.has(n)===!0?(r&&r(ql.get(n)),a.manager.itemError(e),a.manager.itemEnd(e)):(t&&t(l),a.manager.itemEnd(e))});return}setTimeout(function(){t&&t(n),a.manager.itemEnd(e)},0);return}let s={};s.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",s.headers=this.requestHeader,s.priority=this.priority,s.cache=this.cache,s.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,s).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},a.options,{colorSpaceConversion:"none"}))}).then(function(l){return Wi.add(`image-bitmap:${e}`,l),t&&t(l),a.manager.itemEnd(e),l}).catch(function(l){r&&r(l),ql.set(o,l),Wi.remove(`image-bitmap:${e}`),a.manager.itemError(e),a.manager.itemEnd(e)});Wi.add(`image-bitmap:${e}`,o),a.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ps,oc=class{static getContext(){return Ps===void 0&&(Ps=new(window.AudioContext||window.webkitAudioContext)),Ps}static setContext(e){Ps=e}},wv=class extends fi{constructor(e){super(e)}load(e,t,i,r){let a=this,n=new ur(this.manager);n.setPriority(this.priority),n.setCache(this.cache),n.setResponseType("arraybuffer"),n.setPath(this.path),n.setRequestHeader(this.requestHeader),n.setWithCredentials(this.withCredentials),n.load(e,function(o){try{let l=o.slice(0),h=oc.getContext(),c=e+"#decode";a.manager.itemStart(c),h.decodeAudioData(l,function(u){t(u),a.manager.itemEnd(c)}).catch(function(u){s(u),a.manager.itemEnd(c)})}catch(l){s(l)}},i,r);function s(o){r?r(o):ke(o),a.manager.itemError(e)}}},Au=new Ye,Ru=new Ye,Br=new Ye,Tv=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new kt,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new kt,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){let t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,Br.copy(e.projectionMatrix);let i=t.eyeSep/2,r=i*t.near/t.focus,a=t.near*Math.tan(Zr*t.fov*.5)/t.zoom,n,s;Ru.elements[12]=-i,Au.elements[12]=i,n=-a*t.aspect+r,s=a*t.aspect+r,Br.elements[0]=2*t.near/(s-n),Br.elements[8]=(s+n)/(s-n),this.cameraL.projectionMatrix.copy(Br),n=-a*t.aspect-r,s=a*t.aspect-r,Br.elements[0]=2*t.near/(s-n),Br.elements[8]=(s+n)/(s-n),this.cameraR.projectionMatrix.copy(Br)}this.cameraL.matrix.copy(e.matrixWorld).multiply(Ru),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(e.matrixWorld).multiply(Au),this.cameraR.matrixWorldNeedsUpdate=!0}},ba=-90,Ea=1,No=class extends mt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new kt(ba,Ea,e,t);r.layers=this.layers,this.add(r);let a=new kt(ba,Ea,e,t);a.layers=this.layers,this.add(a);let n=new kt(ba,Ea,e,t);n.layers=this.layers,this.add(n);let s=new kt(ba,Ea,e,t);s.layers=this.layers,this.add(s);let o=new kt(ba,Ea,e,t);o.layers=this.layers,this.add(o);let l=new kt(ba,Ea,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,a,n,s,o]=t;for(let l of t)this.remove(l);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),n.up.set(0,0,1),n.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===$r)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),n.up.set(0,0,-1),n.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,n,s,o,l,h]=this.children,c=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let g=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let v=!1;e.isWebGLRenderer===!0?v=e.state.buffers.depth.getReversed():v=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,n),e.setRenderTarget(i,2,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,3,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,4,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.mipmapsAutoUpdate=g,e.setRenderTarget(i,5,r),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(c,u,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}},Pf=class extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Lf=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Av.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Av(){this._document.hidden===!1&&this.reset()}var zr=new R,Yl=new Ct,Rv=new R,Hr=new R,kr=new R,Cv=class extends mt{constructor(){super(),this.type="AudioListener",this.context=oc.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new Lf}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e),this._timer.update();let t=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(zr,Yl,Rv),Hr.set(0,0,-1).applyQuaternion(Yl),kr.set(0,1,0).applyQuaternion(Yl),t.positionX){let i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(zr.x,i),t.positionY.linearRampToValueAtTime(zr.y,i),t.positionZ.linearRampToValueAtTime(zr.z,i),t.forwardX.linearRampToValueAtTime(Hr.x,i),t.forwardY.linearRampToValueAtTime(Hr.y,i),t.forwardZ.linearRampToValueAtTime(Hr.z,i),t.upX.linearRampToValueAtTime(kr.x,i),t.upY.linearRampToValueAtTime(kr.y,i),t.upZ.linearRampToValueAtTime(kr.z,i)}else t.setPosition(zr.x,zr.y,zr.z),t.setOrientation(Hr.x,Hr.y,Hr.z,kr.x,kr.y,kr.z)}},Df=class extends mt{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){xe("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){xe("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){xe("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){xe("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){xe("Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(xe("Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){xe("Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(xe("Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}},Gr=new R,Cu=new Ct,Iv=new R,Vr=new R,Pv=class extends Df{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,i){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=i,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(Gr,Cu,Iv),Vr.set(0,0,1).applyQuaternion(Cu);let t=this.panner;if(t.positionX){let i=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(Gr.x,i),t.positionY.linearRampToValueAtTime(Gr.y,i),t.positionZ.linearRampToValueAtTime(Gr.z,i),t.orientationX.linearRampToValueAtTime(Vr.x,i),t.orientationY.linearRampToValueAtTime(Vr.y,i),t.orientationZ.linearRampToValueAtTime(Vr.z,i)}else t.setPosition(Gr.x,Gr.y,Gr.z),t.setOrientation(Vr.x,Vr.y,Vr.z)}},Lv=class{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0,t=this.getFrequencyData();for(let i=0;i<t.length;i++)e+=t[i];return e/t.length}},Nf=class{constructor(e,t,i){this.binding=e,this.valueSize=i;let r,a,n;switch(t){case"quaternion":r=this._slerp,a=this._slerpAdditive,n=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":r=this._select,a=this._select,n=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:r=this._lerp,a=this._lerpAdditive,n=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=a,this._setIdentity=n,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let i=this.buffer,r=this.valueSize,a=e*r+r,n=this.cumulativeWeight;if(n===0){for(let s=0;s!==r;++s)i[a+s]=i[s];n=t}else{n+=t;let s=t/n;this._mixBufferRegion(i,a,0,s,r)}this.cumulativeWeight=n}accumulateAdditive(e){let t=this.buffer,i=this.valueSize,r=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,r,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,i=this.buffer,r=e*t+t,a=this.cumulativeWeight,n=this.cumulativeWeightAdditive,s=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,a<1){let o=t*this._origIndex;this._mixBufferRegion(i,r,o,1-a,t)}n>0&&this._mixBufferRegionAdditive(i,r,this._addIndex*t,1,t);for(let o=t,l=t+t;o!==l;++o)if(i[o]!==i[o+t]){s.setValue(i,r);break}}saveOriginalState(){let e=this.binding,t=this.buffer,i=this.valueSize,r=i*this._origIndex;e.getValue(t,r);for(let a=i,n=r;a!==n;++a)t[a]=t[r+a%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,r,a){if(r>=.5)for(let n=0;n!==a;++n)e[t+n]=e[i+n]}_slerp(e,t,i,r){Ct.slerpFlat(e,t,e,t,e,i,r)}_slerpAdditive(e,t,i,r,a){let n=this._workIndex*a;Ct.multiplyQuaternionsFlat(e,n,e,t,e,i),Ct.slerpFlat(e,t,e,t,e,n,r)}_lerp(e,t,i,r,a){let n=1-r;for(let s=0;s!==a;++s){let o=t+s;e[o]=e[o]*n+e[i+s]*r}}_lerpAdditive(e,t,i,r,a){for(let n=0;n!==a;++n){let s=t+n;e[s]=e[s]+e[i+n]*r}}},lc="\\[\\]\\.:\\/",Dv=new RegExp("["+lc+"]","g"),hc="[^"+lc+"]",Nv="[^"+lc.replace("\\.","")+"]",Uv=/((?:WC+[\/:])*)/.source.replace("WC",hc),Ov=/(WCOD+)?/.source.replace("WCOD",Nv),Fv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",hc),Bv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",hc),zv=new RegExp("^"+Uv+Ov+Fv+Bv+"$"),Hv=["material","materials","bones","map"],kv=class{constructor(e,t,i){let r=i||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,a=i.length;r!==a;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},vt=class Ra{constructor(t,i,r){this.path=i,this.parsedPath=r||Ra.parseTrackName(i),this.node=Ra.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,i,r){return t&&t.isAnimationObjectGroup?new Ra.Composite(t,i,r):new Ra(t,i,r)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Dv,"")}static parseTrackName(t){let i=zv.exec(t);if(i===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let r={nodeName:i[2],objectName:i[3],objectIndex:i[4],propertyName:i[5],propertyIndex:i[6]},a=r.nodeName&&r.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=r.nodeName.substring(a+1);Hv.indexOf(n)!==-1&&(r.nodeName=r.nodeName.substring(0,a),r.objectName=n)}if(r.propertyName===null||r.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return r}static findNode(t,i){if(i===void 0||i===""||i==="."||i===-1||i===t.name||i===t.uuid)return t;if(t.skeleton){let r=t.skeleton.getBoneByName(i);if(r!==void 0)return r}if(t.children){let r=function(n){for(let s=0;s<n.length;s++){let o=n[s];if(o.name===i||o.uuid===i)return o;let l=r(o.children);if(l)return l}return null},a=r(t.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,i){t[i]=this.targetObject[this.propertyName]}_getValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)t[i++]=r[a]}_getValue_arrayElement(t,i){t[i]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,i){this.resolvedProperty.toArray(t,i)}_setValue_direct(t,i){this.targetObject[this.propertyName]=t[i]}_setValue_direct_setNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++]}_setValue_array_setNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,i){this.resolvedProperty[this.propertyIndex]=t[i]}_setValue_arrayElement_setNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,i){this.resolvedProperty.fromArray(t,i)}_setValue_fromArray_setNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,i){this.bind(),this.getValue(t,i)}_setValue_unbound(t,i){this.bind(),this.setValue(t,i)}bind(){let t=this.node,i=this.parsedPath,r=i.objectName,a=i.propertyName,n=i.propertyIndex;if(t||(t=Ra.findNode(this.rootNode,i.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){xe("PropertyBinding: No target node found for track: "+this.path+".");return}if(r){let h=i.objectIndex;switch(r){case"materials":if(!t.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===h){h=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[r]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[r]}if(h!==void 0){if(t[h]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let s=t[a];if(s===void 0){let h=i.nodeName;ke("PropertyBinding: Trying to update property for track: "+h+"."+a+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!t.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=n}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};vt.Composite=kv;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Gv=class{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Ei(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let e={};this._indicesByUUID=e;for(let i=0,r=arguments.length;i!==r;++i)e[arguments[i].uuid]=i;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){let e=this._objects,t=this._indicesByUUID,i=this._paths,r=this._parsedPaths,a=this._bindings,n=a.length,s,o=e.length,l=this.nCachedObjects_;for(let h=0,c=arguments.length;h!==c;++h){let u=arguments[h],d=u.uuid,p=t[d];if(p===void 0){p=o++,t[d]=p,e.push(u);for(let g=0,v=n;g!==v;++g)a[g].push(new vt(u,i[g],r[g]))}else if(p<l){s=e[p];let g=--l,v=e[g];t[v.uuid]=p,e[p]=v,t[d]=g,e[g]=u;for(let f=0,m=n;f!==m;++f){let x=a[f],S=x[g],_=x[p];x[p]=S,_===void 0&&(_=new vt(u,i[f],r[f])),x[g]=_}}else e[p]!==s&&ke("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=l}remove(){let e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length,a=this.nCachedObjects_;for(let n=0,s=arguments.length;n!==s;++n){let o=arguments[n],l=o.uuid,h=t[l];if(h!==void 0&&h>=a){let c=a++,u=e[c];t[u.uuid]=h,e[h]=u,t[l]=c,e[c]=o;for(let d=0,p=r;d!==p;++d){let g=i[d],v=g[c],f=g[h];g[h]=v,g[c]=f}}}this.nCachedObjects_=a}uncache(){let e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length,a=this.nCachedObjects_,n=e.length;for(let s=0,o=arguments.length;s!==o;++s){let l=arguments[s],h=l.uuid,c=t[h];if(c!==void 0)if(delete t[h],c<a){let u=--a,d=e[u],p=--n,g=e[p];c!==u&&(t[d.uuid]=c),e[c]=d,u!==p&&(t[g.uuid]=u),e[u]=g,e.pop();for(let v=0,f=r;v!==f;++v){let m=i[v],x=m[u],S=m[p];m[c]=x,m[u]=S,m.pop()}}else{let u=--n,d=e[u];c!==u&&(t[d.uuid]=c),e[c]=d,e.pop();for(let p=0,g=r;p!==g;++p){let v=i[p];v[c]=v[u],v.pop()}}}this.nCachedObjects_=a}subscribe_(e,t){let i=this._bindingsIndicesByPath,r=i[e],a=this._bindings;if(r!==void 0)return a[r];let n=this._paths,s=this._parsedPaths,o=this._objects,l=o.length,h=this.nCachedObjects_,c=new Array(l);r=a.length,i[e]=r,n.push(e),s.push(t),a.push(c);for(let u=h,d=o.length;u!==d;++u){let p=o[u];c[u]=new vt(p,e,t)}return c}unsubscribe_(e){let t=this._bindingsIndicesByPath,i=t[e];if(i!==void 0){let r=this._paths,a=this._parsedPaths,n=this._bindings,s=n.length-1,o=n[s],l=r[s];t[l]=i,n[i]=o,n.pop(),a[i]=a[s],a.pop(),r[i]=r[s],r.pop()}}},Uf=class{constructor(e,t,i=null,r=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=r;let a=t.tracks,n=a.length,s=new Array(n),o={endingStart:Xr,endingEnd:Xr};for(let l=0;l!==n;++l){let h=a[l].createInterpolant(null);s[l]=h,h.settings=o}this._interpolantSettings=o,this._interpolants=s,this._propertyBindings=new Array(n),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Ld,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){let r=this._clip.duration,a=e._clip.duration,n=a/r,s=r/a;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,n,t),this.warp(s,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){let r=this._mixer,a=r.time,n=this.timeScale,s=this._timeScaleInterpolant;s===null&&(s=r._lendControlInterpolant(),this._timeScaleInterpolant=s);let o=s.parameterPositions,l=s.sampleValues;return o[0]=a,o[1]=a+i,l[0]=e/n,l[1]=t/n,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,r){if(!this.enabled){this._updateWeight(e);return}let a=this._startTime;if(a!==null){let o=(e-a)*i;o<0||i===0?t=0:(this._startTime=null,t=i*o)}t*=this._updateTimeScale(e);let n=this._updateTime(t),s=this._updateWeight(e);if(s>0){let o=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Ih:for(let h=0,c=o.length;h!==c;++h)o[h].evaluate(n),l[h].accumulateAdditive(s);break;case Go:default:for(let h=0,c=o.length;h!==c;++h)o[h].evaluate(n),l[h].accumulate(r,s)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let i=this._weightInterpolant;if(i!==null){let r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let i=this._timeScaleInterpolant;if(i!==null){let r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,i=this.loop,r=this.time+e,a=this._loopCount,n=i===Dd;if(e===0)return a===-1?r:n&&(a&1)===1?t-r:r;if(i===Pd){a===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(r>=t)r=t;else if(r<0)r=0;else{this.time=r;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(a===-1&&(e>=0?(a=0,this._setEndings(!0,this.repetitions===0,n)):this._setEndings(this.repetitions===0,!0,n)),r>=t||r<0){let s=Math.floor(r/t);r-=t*s,a+=Math.abs(s);let o=this.repetitions-a;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=e>0?t:0,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let l=e<0;this._setEndings(l,!l,n)}else this._setEndings(!1,!1,n);this._loopCount=a,this.time=r,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:s})}}else this._loopCount=a,this.time=r;if(n&&(a&1)===1)return t-r}return r}_setEndings(e,t,i){let r=this._interpolantSettings;i?(r.endingStart=jr,r.endingEnd=jr):(e?r.endingStart=this.zeroSlopeAtStart?jr:Xr:r.endingStart=An,t?r.endingEnd=this.zeroSlopeAtEnd?jr:Xr:r.endingEnd=An)}_scheduleFading(e,t,i){let r=this._mixer,a=r.time,n=this._weightInterpolant;n===null&&(n=r._lendControlInterpolant(),this._weightInterpolant=n);let s=n.parameterPositions,o=n.sampleValues;return s[0]=a,o[0]=t,s[1]=a+e,o[1]=i,this}},Vv=new Float32Array(1),Wv=class extends Fi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let i=e._localRoot||this._root,r=e._clip.tracks,a=r.length,n=e._propertyBindings,s=e._interpolants,o=i.uuid,l=this._bindingsByRootAndName,h=l[o];h===void 0&&(h={},l[o]=h);for(let c=0;c!==a;++c){let u=r[c],d=u.name,p=h[d];if(p!==void 0)++p.referenceCount,n[c]=p;else{if(p=n[c],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,o,d));continue}let g=t&&t._propertyBindings[c].binding.parsedPath;p=new Nf(vt.create(i,d,g),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,o,d),n[c]=p}s[c].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let i=(e._localRoot||this._root).uuid,r=e._clip.uuid,a=this._actionsByClip[r];this._bindAction(e,a&&a.knownActions[0]),this._addInactiveAction(e,r,i)}let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.useCount++===0&&(this._lendBinding(a),a.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];--a.useCount===0&&(a.restoreOriginalState(),this._takeBackBinding(a))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){let r=this._actions,a=this._actionsByClip,n=a[t];if(n===void 0)n={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,a[t]=n;else{let s=n.knownActions;e._byClipCacheIndex=s.length,s.push(e)}e._cacheIndex=r.length,r.push(e),n.actionByRoot[i]=e}_removeInactiveAction(e){let t=this._actions,i=t[t.length-1],r=e._cacheIndex;i._cacheIndex=r,t[r]=i,t.pop(),e._cacheIndex=null;let a=e._clip.uuid,n=this._actionsByClip,s=n[a],o=s.knownActions,l=o[o.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,o[h]=l,o.pop(),e._byClipCacheIndex=null;let c=s.actionByRoot,u=(e._localRoot||this._root).uuid;delete c[u],o.length===0&&delete n[a],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){let a=t[i];--a.referenceCount===0&&this._removeInactiveBinding(a)}}_lendAction(e){let t=this._actions,i=e._cacheIndex,r=this._nActiveActions++,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_takeBackAction(e){let t=this._actions,i=e._cacheIndex,r=--this._nActiveActions,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_addInactiveBinding(e,t,i){let r=this._bindingsByRootAndName,a=this._bindings,n=r[t];n===void 0&&(n={},r[t]=n),n[i]=e,e._cacheIndex=a.length,a.push(e)}_removeInactiveBinding(e){let t=this._bindings,i=e.binding,r=i.rootNode.uuid,a=i.path,n=this._bindingsByRootAndName,s=n[r],o=t[t.length-1],l=e._cacheIndex;o._cacheIndex=l,t[l]=o,t.pop(),delete s[a],Object.keys(s).length===0&&delete n[r]}_lendBinding(e){let t=this._bindings,i=e._cacheIndex,r=this._nActiveBindings++,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_takeBackBinding(e){let t=this._bindings,i=e._cacheIndex,r=--this._nActiveBindings,a=t[r];e._cacheIndex=r,t[r]=e,a._cacheIndex=i,t[i]=a}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,i=e[t];return i===void 0&&(i=new tc(new Float32Array(2),new Float32Array(2),1,Vv),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){let t=this._controlInterpolants,i=e.__cacheIndex,r=--this._nActiveControlInterpolants,a=t[r];e.__cacheIndex=r,t[r]=e,a.__cacheIndex=i,t[i]=a}clipAction(e,t,i){let r=t||this._root,a=r.uuid,n=typeof e=="string"?Fn.findByName(r,e):e,s=n!==null?n.uuid:e,o=this._actionsByClip[s],l=null;if(i===void 0&&(n!==null?i=n.blendMode:i=Go),o!==void 0){let c=o.actionByRoot[a];if(c!==void 0&&c.blendMode===i)return c;l=o.knownActions[0],n===null&&(n=l._clip)}if(n===null)return null;let h=new Uf(this,n,t,i);return this._bindAction(h,l),this._addInactiveAction(h,s,a),h}existingAction(e,t){let i=t||this._root,r=i.uuid,a=typeof e=="string"?Fn.findByName(i,e):e,n=a?a.uuid:e,s=this._actionsByClip[n];return s!==void 0&&s.actionByRoot[r]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;let t=this._actions,i=this._nActiveActions,r=this.time+=e,a=Math.sign(e),n=this._accuIndex^=1;for(let l=0;l!==i;++l)t[l]._update(r,e,a,n);let s=this._bindings,o=this._nActiveBindings;for(let l=0;l!==o;++l)s[l].apply(n);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,i=e.uuid,r=this._actionsByClip,a=r[i];if(a!==void 0){let n=a.knownActions;for(let s=0,o=n.length;s!==o;++s){let l=n[s];this._deactivateAction(l);let h=l._cacheIndex,c=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,c._cacheIndex=h,t[h]=c,t.pop(),this._removeInactiveBindingsForAction(l)}delete r[i]}}uncacheRoot(e){let t=e.uuid,i=this._actionsByClip;for(let n in i){let s=i[n].actionByRoot,o=s[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let r=this._bindingsByRootAndName,a=r[t];if(a!==void 0)for(let n in a){let s=a[n];s.restoreOriginalState(),this._removeInactiveBinding(s)}}uncacheAction(e,t){let i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}},Xv=class extends Uh{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isRenderTarget3D=!0,this.depth=i;for(let a=0;a<this.textures.length;a++){let n=new jo(null,e,t,i);n.isRenderTargetTexture=!0,n.renderTarget=this,this.textures[a]=n}this._setTextureOptions(r)}},jv=class Of{constructor(t){this.value=t}clone(){return new Of(this.value.clone===void 0?this.value:this.value.clone())}},qv=0,Yv=class extends Fi{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:qv++}),this.name="",this.usage=Vo,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){let t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;let t=e.uniforms;this.uniforms.length=0;for(let i=0,r=t.length;i<r;i++){let a=t[i];Array.isArray(a)?this.uniforms.push(a.map(n=>n.clone())):this.uniforms.push(a.clone())}return this}clone(){return new this.constructor().copy(this)}},Zv=class extends Zo{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}},Jv=class{constructor(e,t,i,r,a,n=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=i,this.elementSize=r,this.count=a,this.normalized=n,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}},Iu=new Ye,cc=class{constructor(e,t,i=0,r=1/0){this.ray=new ka(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new qo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ke("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Iu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Iu),this}intersectObject(e,t=!0,i=[]){return uh(e,this,i,t),i.sort(Pu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,a=e.length;r<a;r++)uh(e[r],this,i,t);return i.sort(Pu),i}};function Pu(e,t){return e.distance-t.distance}function uh(e,t,i,r){let a=!0;if(e.layers.test(t.layers)&&e.raycast(t,i)===!1&&(a=!1),a===!0&&r===!0){let n=e.children;for(let s=0,o=n.length;s<o;s++)uh(n[s],t,i,!0)}}var Kv=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,xe("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},$v=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},Qv=class{constructor(e=1,t=0,i=0){this.radius=e,this.theta=t,this.y=i}set(e,t,i){return this.radius=e,this.theta=t,this.y=i,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+i*i),this.theta=Math.atan2(e,i),this.y=t,this}clone(){return new this.constructor().copy(this)}},Ff=class{constructor(t,i,r,a){this.elements=[1,0,0,1],t!==void 0&&this.set(t,i,r,a)}identity(){return this.set(1,0,0,1),this}fromArray(t,i=0){for(let r=0;r<4;r++)this.elements[r]=t[r+i];return this}set(t,i,r,a){let n=this.elements;return n[0]=t,n[2]=i,n[1]=r,n[3]=a,this}};Ff.prototype.isMatrix2=!0;var e_=Ff,Lu=new ie,Bf=class{constructor(e=new ie(1/0,1/0),t=new ie(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Lu.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Lu).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Du=new R,Ls=new R,wa=new R,Ta=new R,Zl=new R,t_=new R,i_=new R,r_=class{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Du.subVectors(e,this.start),Ls.subVectors(this.end,this.start);let i=Ls.dot(Ls);if(i===0)return 0;let r=Ls.dot(Du)/i;return t&&(r=Ze(r,0,1)),r}closestPointToPoint(e,t,i){let r=this.closestPointToPointParameter(e,t);return this.delta(i).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=t_,i=i_){let r=10000000000000001e-32,a,n,s=this.start,o=e.start,l=this.end,h=e.end;wa.subVectors(l,s),Ta.subVectors(h,o),Zl.subVectors(s,o);let c=wa.dot(wa),u=Ta.dot(Ta),d=Ta.dot(Zl);if(c<=r&&u<=r)return t.copy(s),i.copy(o),t.distanceToSquared(i);if(c<=r)a=0,n=d/u,n=Ze(n,0,1);else{let p=wa.dot(Zl);if(u<=r)n=0,a=Ze(-p/c,0,1);else{let g=wa.dot(Ta),v=c*u-g*g;v!==0?a=Ze((g*d-p*u)/v,0,1):a=0,n=(g*a+d)/u,n<0?(n=0,a=Ze(-p/c,0,1)):n>1&&(n=1,a=Ze((g-p)/c,0,1))}}return t.copy(s).addScaledVector(wa,a),i.copy(o).addScaledVector(Ta,n),t.distanceToSquared(i)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},Nu=new R,a_=class extends mt{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";let i=new et,r=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let n=0,s=1,o=32;n<o;n++,s++){let l=n/o*Math.PI*2,h=s/o*Math.PI*2;r.push(Math.cos(l),Math.sin(l),1,Math.cos(h),Math.sin(h),1)}i.setAttribute("position",new De(r,3));let a=new li({fog:!1,toneMapped:!1});this.cone=new ji(i,a),this.add(this.cone),this.update()}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;let e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Nu.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Nu),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},yr=new R,Ds=new Ye,Jl=new Ye,n_=class extends ji{constructor(e){let t=zf(e),i=new et,r=[],a=[];for(let l=0;l<t.length;l++){let h=t[l];h.parent&&h.parent.isBone&&(r.push(0,0,0),r.push(0,0,0),a.push(0,0,0),a.push(0,0,0))}i.setAttribute("position",new De(r,3)),i.setAttribute("color",new De(a,3));let n=new li({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,n),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;let s=new Ae(255),o=new Ae(65280);this.setColors(s,o)}updateMatrixWorld(e){let t=this.bones,i=this.geometry,r=i.getAttribute("position");Jl.copy(this.root.matrixWorld).invert();for(let a=0,n=0;a<t.length;a++){let s=t[a];s.parent&&s.parent.isBone&&(Ds.multiplyMatrices(Jl,s.matrixWorld),yr.setFromMatrixPosition(Ds),r.setXYZ(n,yr.x,yr.y,yr.z),Ds.multiplyMatrices(Jl,s.parent.matrixWorld),yr.setFromMatrixPosition(Ds),r.setXYZ(n+1,yr.x,yr.y,yr.z),n+=2)}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){let i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function zf(e){let t=[];e.isBone===!0&&t.push(e);for(let i=0;i<e.children.length;i++)t.push(...zf(e.children[i]));return t}var s_=class extends Xe{constructor(e,t,i){let r=new hi(t,4,2),a=new oi({wireframe:!0,fog:!1,toneMapped:!1});super(r,a),this.light=e,this.color=i,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},o_=new R,Uu=new Ae,Ou=new Ae,l_=class extends mt{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="HemisphereLightHelper";let r=new Kh(t);r.rotateY(Math.PI*.5),this.material=new oi({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let a=r.getAttribute("position"),n=new Float32Array(a.count*3);r.setAttribute("color",new Mt(n,3)),this.add(new Xe(r,this.material)),this.update()}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let t=e.geometry.getAttribute("color");Uu.copy(this.light.color),Ou.copy(this.light.groundColor);for(let i=0,r=t.count;i<r;i++){let a=i<r/2?Uu:Ou;t.setXYZ(i,a.r,a.g,a.b)}t.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),e.lookAt(o_.setFromMatrixPosition(this.light.matrixWorld).negate())}},h_=class extends ji{constructor(e=10,t=10,i=4473924,r=8947848){i=new Ae(i),r=new Ae(r);let a=t/2,n=e/t,s=e/2,o=[],l=[];for(let u=0,d=0,p=-s;u<=t;u++,p+=n){o.push(-s,0,p,s,0,p),o.push(p,0,-s,p,0,s);let g=u===a?i:r;g.toArray(l,d),d+=3,g.toArray(l,d),d+=3,g.toArray(l,d),d+=3,g.toArray(l,d),d+=3}let h=new et;h.setAttribute("position",new De(o,3)),h.setAttribute("color",new De(l,3));let c=new li({vertexColors:!0,toneMapped:!1});super(h,c),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},c_=class extends ji{constructor(e=10,t=16,i=8,r=64,a=4473924,n=8947848){a=new Ae(a),n=new Ae(n);let s=[],o=[];if(t>1)for(let c=0;c<t;c++){let u=c/t*(Math.PI*2),d=Math.sin(u)*e,p=Math.cos(u)*e;s.push(0,0,0),s.push(d,0,p);let g=c&1?a:n;o.push(g.r,g.g,g.b),o.push(g.r,g.g,g.b)}for(let c=0;c<i;c++){let u=c&1?a:n,d=e-e/i*c;for(let p=0;p<r;p++){let g=p/r*(Math.PI*2),v=Math.sin(g)*d,f=Math.cos(g)*d;s.push(v,0,f),o.push(u.r,u.g,u.b),g=(p+1)/r*(Math.PI*2),v=Math.sin(g)*d,f=Math.cos(g)*d,s.push(v,0,f),o.push(u.r,u.g,u.b)}}let l=new et;l.setAttribute("position",new De(s,3)),l.setAttribute("color",new De(o,3));let h=new li({vertexColors:!0,toneMapped:!1});super(l,h),this.type="PolarGridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},Fu=new R,Ns=new R,Bu=new R,u_=class extends mt{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="DirectionalLightHelper",t===void 0&&(t=1);let r=new et;r.setAttribute("position",new De([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));let a=new li({fog:!1,toneMapped:!1});this.lightPlane=new wr(r,a),this.add(this.lightPlane),r=new et,r.setAttribute("position",new De([0,0,0,0,0,1],3)),this.targetLine=new wr(r,a),this.add(this.targetLine),this.update()}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Fu.setFromMatrixPosition(this.light.matrixWorld),Ns.setFromMatrixPosition(this.light.target.matrixWorld),Bu.subVectors(Ns,Fu),this.lightPlane.lookAt(Ns),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Ns),this.targetLine.scale.z=Bu.length()}},Us=new R,Tt=new rl,d_=class extends ji{constructor(e){let t=new et,i=new li({color:16777215,vertexColors:!0,toneMapped:!1}),r=[],a=[],n={};s("n1","n2"),s("n2","n4"),s("n4","n3"),s("n3","n1"),s("f1","f2"),s("f2","f4"),s("f4","f3"),s("f3","f1"),s("n1","f1"),s("n2","f2"),s("n3","f3"),s("n4","f4"),s("p","n1"),s("p","n2"),s("p","n3"),s("p","n4"),s("u1","u2"),s("u2","u3"),s("u3","u1"),s("c","t"),s("p","c"),s("cn1","cn2"),s("cn3","cn4"),s("cf1","cf2"),s("cf3","cf4");function s(p,g){o(p),o(g)}function o(p){r.push(0,0,0),a.push(0,0,0),n[p]===void 0&&(n[p]=[]),n[p].push(r.length/3-1)}t.setAttribute("position",new De(r,3)),t.setAttribute("color",new De(a,3)),super(t,i),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=n,this.update();let l=new Ae(16755200),h=new Ae(16711680),c=new Ae(43775),u=new Ae(16777215),d=new Ae(3355443);this.setColors(l,h,c,u,d)}setColors(e,t,i,r,a){let n=this.geometry.getAttribute("color");return n.setXYZ(0,e.r,e.g,e.b),n.setXYZ(1,e.r,e.g,e.b),n.setXYZ(2,e.r,e.g,e.b),n.setXYZ(3,e.r,e.g,e.b),n.setXYZ(4,e.r,e.g,e.b),n.setXYZ(5,e.r,e.g,e.b),n.setXYZ(6,e.r,e.g,e.b),n.setXYZ(7,e.r,e.g,e.b),n.setXYZ(8,e.r,e.g,e.b),n.setXYZ(9,e.r,e.g,e.b),n.setXYZ(10,e.r,e.g,e.b),n.setXYZ(11,e.r,e.g,e.b),n.setXYZ(12,e.r,e.g,e.b),n.setXYZ(13,e.r,e.g,e.b),n.setXYZ(14,e.r,e.g,e.b),n.setXYZ(15,e.r,e.g,e.b),n.setXYZ(16,e.r,e.g,e.b),n.setXYZ(17,e.r,e.g,e.b),n.setXYZ(18,e.r,e.g,e.b),n.setXYZ(19,e.r,e.g,e.b),n.setXYZ(20,e.r,e.g,e.b),n.setXYZ(21,e.r,e.g,e.b),n.setXYZ(22,e.r,e.g,e.b),n.setXYZ(23,e.r,e.g,e.b),n.setXYZ(24,t.r,t.g,t.b),n.setXYZ(25,t.r,t.g,t.b),n.setXYZ(26,t.r,t.g,t.b),n.setXYZ(27,t.r,t.g,t.b),n.setXYZ(28,t.r,t.g,t.b),n.setXYZ(29,t.r,t.g,t.b),n.setXYZ(30,t.r,t.g,t.b),n.setXYZ(31,t.r,t.g,t.b),n.setXYZ(32,i.r,i.g,i.b),n.setXYZ(33,i.r,i.g,i.b),n.setXYZ(34,i.r,i.g,i.b),n.setXYZ(35,i.r,i.g,i.b),n.setXYZ(36,i.r,i.g,i.b),n.setXYZ(37,i.r,i.g,i.b),n.setXYZ(38,r.r,r.g,r.b),n.setXYZ(39,r.r,r.g,r.b),n.setXYZ(40,a.r,a.g,a.b),n.setXYZ(41,a.r,a.g,a.b),n.setXYZ(42,a.r,a.g,a.b),n.setXYZ(43,a.r,a.g,a.b),n.setXYZ(44,a.r,a.g,a.b),n.setXYZ(45,a.r,a.g,a.b),n.setXYZ(46,a.r,a.g,a.b),n.setXYZ(47,a.r,a.g,a.b),n.setXYZ(48,a.r,a.g,a.b),n.setXYZ(49,a.r,a.g,a.b),n.needsUpdate=!0,this}update(){let e=this.geometry,t=this.pointMap,i=1,r=1,a,n;if(Tt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)a=1,n=0;else if(this.camera.coordinateSystem===_i)a=-1,n=1;else if(this.camera.coordinateSystem===$r)a=0,n=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);At("c",t,e,Tt,0,0,a),At("t",t,e,Tt,0,0,n),At("n1",t,e,Tt,-i,-r,a),At("n2",t,e,Tt,i,-r,a),At("n3",t,e,Tt,-i,r,a),At("n4",t,e,Tt,i,r,a),At("f1",t,e,Tt,-i,-r,n),At("f2",t,e,Tt,i,-r,n),At("f3",t,e,Tt,-i,r,n),At("f4",t,e,Tt,i,r,n),At("u1",t,e,Tt,i*.7,r*1.1,a),At("u2",t,e,Tt,-i*.7,r*1.1,a),At("u3",t,e,Tt,0,r*2,a),At("cf1",t,e,Tt,-i,0,n),At("cf2",t,e,Tt,i,0,n),At("cf3",t,e,Tt,0,-r,n),At("cf4",t,e,Tt,0,r,n),At("cn1",t,e,Tt,-i,0,a),At("cn2",t,e,Tt,i,0,a),At("cn3",t,e,Tt,0,-r,a),At("cn4",t,e,Tt,0,r,a),e.getAttribute("position").needsUpdate=!0}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function At(e,t,i,r,a,n,s){Us.set(a,n,s).unproject(r);let o=t[e];if(o!==void 0){let l=i.getAttribute("position");for(let h=0,c=o.length;h<c;h++)l.setXYZ(o[h],Us.x,Us.y,Us.z)}}var Os=new ei,p_=class extends ji{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=new Float32Array(24),a=new et;a.setIndex(new Mt(i,1)),a.setAttribute("position",new Mt(r,3)),super(a,new li({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Os.setFromObject(this.object),Os.isEmpty())return;let e=Os.min,t=Os.max,i=this.geometry.attributes.position,r=i.array;r[0]=t.x,r[1]=t.y,r[2]=t.z,r[3]=e.x,r[4]=t.y,r[5]=t.z,r[6]=e.x,r[7]=e.y,r[8]=t.z,r[9]=t.x,r[10]=e.y,r[11]=t.z,r[12]=t.x,r[13]=t.y,r[14]=e.z,r[15]=e.x,r[16]=t.y,r[17]=e.z,r[18]=e.x,r[19]=e.y,r[20]=e.z,r[21]=t.x,r[22]=e.y,r[23]=e.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},f_=class extends ji{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],a=new et;a.setIndex(new Mt(i,1)),a.setAttribute("position",new De(r,3)),super(a,new li({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},m_=class extends wr{constructor(e,t=1,i=16776960){let r=i,a=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],n=new et;n.setAttribute("position",new De(a,3)),n.computeBoundingSphere(),super(n,new li({color:r,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;let s=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],o=new et;o.setAttribute("position",new De(s,3)),o.computeBoundingSphere(),this.add(new Xe(o,new oi({color:r,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}},zu=new R,Fs,Kl,g_=class extends mt{constructor(e=new R(0,0,1),t=new R(0,0,0),i=1,r=16776960,a=i*.2,n=a*.2){super(),this.type="ArrowHelper",Fs===void 0&&(Fs=new et,Fs.setAttribute("position",new De([0,0,0,0,1,0],3)),Kl=new ra(.5,1,5,1),Kl.translate(0,-.5,0)),this.position.copy(t),this.line=new wr(Fs,new li({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Xe(Kl,new oi({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(i,a,n)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{zu.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(zu,t)}}setLength(e,t=e*.2,i=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(i,t,i),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},v_=class extends ji{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new et;r.setAttribute("position",new De(t,3)),r.setAttribute("color",new De(i,3));let a=new li({vertexColors:!0,toneMapped:!1});super(r,a),this.type="AxesHelper"}setColors(e,t,i){let r=new Ae,a=this.geometry.attributes.color.array;return r.set(e),r.toArray(a,0),r.toArray(a,3),r.set(t),r.toArray(a,6),r.toArray(a,9),r.set(i),r.toArray(a,12),r.toArray(a,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}},__=class{constructor(){this.type="ShapePath",this.color=new Ae,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new Dn,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,i,r){return this.currentPath.quadraticCurveTo(e,t,i,r),this}bezierCurveTo(e,t,i,r,a,n){return this.currentPath.bezierCurveTo(e,t,i,r,a,n),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(o,l){let h=!1,c=l.length;for(let u=0,d=c-1;u<c;d=u++){let p=l[u],g=l[d];p.y>o.y!=g.y>o.y&&o.x<(g.x-p.x)*(o.y-p.y)/(g.y-p.y)+p.x&&(h=!h)}return h}function t(o,l){let h=l.getCenter(new ie);if(e(h,o))return h;let c=h.y,u=[],d=o.length;for(let p=0;p<d;p++){let g=o[p],v=o[(p+1)%d];if(g.y>c!=v.y>c){let f=g.x+(c-g.y)*(v.x-g.x)/(v.y-g.y);u.push(f)}}return u.length>1&&(u.sort((p,g)=>p-g),h.x=(u[0]+u[1])/2),h}let i=this.userData.style&&this.userData.style.fillRule||"nonzero";i!=="nonzero"&&i!=="evenodd"&&(xe('Fill-rule "'+i+'" is not supported, falling back to "nonzero".'),i="nonzero");let r=i==="nonzero"?(o=>o!==0):(o=>(o&1)!==0),a=[];for(let o of this.subPaths){let l=o.getPoints();if(l.length<3)continue;let h=ar.area(l);if(h===0)continue;let c=new Bf;for(let u=0;u<l.length;u++)c.expandByPoint(l[u]);a.push({subPath:o,points:l,boundingBox:c,interiorPoint:t(l,c),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}a.sort((o,l)=>l.absArea-o.absArea);for(let o=0;o<a.length;o++){let l=a[o],h=0;for(let c=o-1;c>=0;c--){let u=a[c];if(u.boundingBox.containsBox(l.boundingBox)&&e(l.interiorPoint,u.points)){l.container=u.exclude?u.container:u,h=u.winding,l.winding+=h;break}}r(l.winding)===r(h)&&(l.exclude=!0)}for(let o of a)o.exclude||(o.role=o.container===null||o.container.role==="hole"?"outer":"hole");let n=[],s=new Map;for(let o of a){if(o.exclude||o.role!=="outer")continue;let l=new Wn;l.curves=o.subPath.curves,n.push(l),s.set(o,l)}for(let o of a){if(o.exclude||o.role!=="hole")continue;let l=s.get(o.container);if(!l)continue;let h=new Dn;h.curves=o.subPath.curves,l.holes.push(h)}return n}},y_=class extends Fi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function x_(e,t){let i=e.image&&e.image.width?e.image.width/e.image.height:1;return i>t?(e.repeat.x=1,e.repeat.y=i/t,e.offset.x=0,e.offset.y=(1-e.repeat.y)/2):(e.repeat.x=t/i,e.repeat.y=1,e.offset.x=(1-e.repeat.x)/2,e.offset.y=0),e}function S_(e,t){let i=e.image&&e.image.width?e.image.width/e.image.height:1;return i>t?(e.repeat.x=t/i,e.repeat.y=1,e.offset.x=(1-e.repeat.x)/2,e.offset.y=0):(e.repeat.x=1,e.repeat.y=i/t,e.offset.x=0,e.offset.y=(1-e.repeat.y)/2),e}function M_(e){return e.repeat.x=1,e.repeat.y=1,e.offset.x=0,e.offset.y=0,e}function dh(e,t,i,r){let a=b_(r);switch(i){case Rh:return e*t;case zo:return e*t/a.components*a.byteLength;case kn:return e*t/a.components*a.byteLength;case br:return e*t*2/a.components*a.byteLength;case Ho:return e*t*2/a.components*a.byteLength;case Ch:return e*t*3/a.components*a.byteLength;case pi:return e*t*4/a.components*a.byteLength;case ko:return e*t*4/a.components*a.byteLength;case mn:case gn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vn:case _n:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case eo:case io:return Math.max(e,16)*Math.max(t,8)/4;case Qs:case to:return Math.max(e,8)*Math.max(t,8)/2;case ro:case ao:case so:case oo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case no:case En:case lo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ho:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case co:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case uo:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case po:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case fo:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case mo:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case go:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case vo:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case _o:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case yo:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case xo:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case So:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Mo:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case bo:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Eo:case wo:case To:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ao:case Ro:return Math.ceil(e/4)*Math.ceil(t/4)*8;case wn:case Co:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function b_(e){switch(e){case di:case Eh:return{byteLength:1,components:1};case Oa:case wh:case Ui:return{byteLength:2,components:1};case Fo:case Bo:return{byteLength:2,components:4};case bi:case Oo:case ni:return{byteLength:4,components:1};case Th:case Ah:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}var E_=class{static contain(e,t){return x_(e,t)}static cover(e,t){return S_(e,t)}static fill(e){return M_(e)}static getByteLength(e,t,i,r){return dh(e,t,i,r)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?xe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Hf(){let e=null,t=!1,i=null,r=null;function a(n,s){r=e.requestAnimationFrame(a),i(n,s)}return{start:function(){t!==!0&&i!==null&&e!==null&&(r=e.requestAnimationFrame(a),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(n){i=n},setContext:function(n){e=n}}}function w_(e){let t=new WeakMap;function i(o,l){let h=o.array,c=o.usage,u=h.byteLength,d=e.createBuffer();e.bindBuffer(l,d),e.bufferData(l,h,c),o.onUploadCallback();let p;if(h instanceof Float32Array)p=e.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=e.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=e.HALF_FLOAT:p=e.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=e.SHORT;else if(h instanceof Uint32Array)p=e.UNSIGNED_INT;else if(h instanceof Int32Array)p=e.INT;else if(h instanceof Int8Array)p=e.BYTE;else if(h instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function r(o,l,h){let c=l.array,u=l.updateRanges;if(e.bindBuffer(h,o),u.length===0)e.bufferSubData(h,0,c);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],v=u[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let v=u[p];e.bufferSubData(h,v.start*c.BYTES_PER_ELEMENT,c,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=t.get(o);if(h===void 0)t.set(o,i(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,o,l),h.version=o.version}}return{get:a,remove:n,update:s}}var T_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,A_=`#ifdef USE_ALPHAHASH
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
#endif`,R_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,C_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,I_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,P_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,L_=`#ifdef USE_AOMAP
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
#endif`,D_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,N_=`#ifdef USE_BATCHING
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
#endif`,U_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,O_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,F_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,B_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,z_=`#ifdef USE_IRIDESCENCE
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
#endif`,H_=`#ifdef USE_BUMPMAP
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
#endif`,k_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,G_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,V_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,W_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,X_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,j_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,q_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Y_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Z_=`#define PI 3.141592653589793
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
} // validated`,J_=`vec3 transformedNormal = objectNormal;
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
#endif`,K_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Q_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ey=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ty="gl_FragColor = linearToOutputTexel( gl_FragColor );",iy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ry=`#ifdef USE_ENVMAP
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
#endif`,ay=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,ny=`#ifdef USE_ENVMAP
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
#endif`,sy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,oy=`#ifdef USE_ENVMAP
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
#endif`,ly=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dy=`#ifdef USE_GRADIENTMAP
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
}`,py=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,my=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gy=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,vy=`#ifdef USE_ENVMAP
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
#endif`,_y=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,My=`PhysicalMaterial material;
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
#endif`,by=`uniform sampler2D dfgLUT;
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
}`,Ey=`
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
#endif`,wy=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ty=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ay=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Ry=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Cy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Iy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Py=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ly=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ny=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Uy=`#if defined( USE_POINTS_UV )
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
#endif`,Oy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Fy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,By=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zy=`#if defined( USE_MORPHCOLORS )
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
#endif`,Hy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ky=`#ifdef USE_MORPHTARGETS
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
#endif`,Gy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Wy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Yy=`#ifdef USE_NORMALMAP
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
#endif`,Zy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ky=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$y=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ex=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,tx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ix=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,nx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ox=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cx=`float getShadowMask() {
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
}`,ux=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dx=`#ifdef USE_SKINNING
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
#endif`,px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fx=`#ifdef USE_SKINNING
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
#endif`,mx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_x=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yx=`#ifdef USE_TRANSMISSION
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
#endif`,xx=`#ifdef USE_TRANSMISSION
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
#endif`,Sx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,wx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tx=`uniform sampler2D t2D;
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
}`,Ax=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rx=`uniform float backgroundBlurriness;
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
}`,Cx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ix=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Px=`#include <common>
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
}`,Lx=`#if DEPTH_PACKING == 3200
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
}`,Dx=`#define DISTANCE
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
}`,Nx=`#define DISTANCE
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
}`,Ux=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ox=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fx=`uniform float scale;
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
}`,Bx=`uniform vec3 diffuse;
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
}`,zx=`#include <common>
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
}`,Hx=`uniform vec3 diffuse;
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
}`,kx=`#define LAMBERT
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
}`,Gx=`#define LAMBERT
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
}`,Vx=`#define MATCAP
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
}`,Wx=`#define MATCAP
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
}`,Xx=`#define NORMAL
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
}`,jx=`#define NORMAL
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
}`,qx=`#define PHONG
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
}`,Yx=`#define PHONG
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
}`,Zx=`#define STANDARD
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
}`,Jx=`#define STANDARD
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
}`,Kx=`#define TOON
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
}`,$x=`#define TOON
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
}`,Qx=`uniform float size;
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
}`,e1=`uniform vec3 diffuse;
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
}`,t1=`#include <common>
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
}`,i1=`uniform vec3 color;
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
}`,r1=`uniform float rotation;
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
}`,a1=`uniform vec3 diffuse;
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
}`,rt={alphahash_fragment:T_,alphahash_pars_fragment:A_,alphamap_fragment:R_,alphamap_pars_fragment:C_,alphatest_fragment:I_,alphatest_pars_fragment:P_,aomap_fragment:L_,aomap_pars_fragment:D_,batching_pars_vertex:N_,batching_vertex:U_,begin_vertex:O_,beginnormal_vertex:F_,bsdfs:B_,iridescence_fragment:z_,bumpmap_pars_fragment:H_,clipping_planes_fragment:k_,clipping_planes_pars_fragment:G_,clipping_planes_pars_vertex:V_,clipping_planes_vertex:W_,color_fragment:X_,color_pars_fragment:j_,color_pars_vertex:q_,color_vertex:Y_,common:Z_,defaultnormal_vertex:J_,displacementmap_pars_vertex:K_,displacementmap_vertex:$_,emissivemap_fragment:Q_,emissivemap_pars_fragment:ey,colorspace_fragment:ty,colorspace_pars_fragment:iy,envmap_fragment:ry,envmap_common_pars_fragment:ay,envmap_pars_fragment:ny,envmap_pars_vertex:sy,envmap_physical_pars_fragment:vy,envmap_vertex:oy,fog_vertex:ly,fog_pars_vertex:hy,fog_fragment:cy,fog_pars_fragment:uy,gradientmap_pars_fragment:dy,lightmap_pars_fragment:py,lights_lambert_fragment:fy,lights_lambert_pars_fragment:my,lights_pars_begin:gy,lights_toon_fragment:_y,lights_toon_pars_fragment:yy,lights_phong_fragment:xy,lights_phong_pars_fragment:Sy,lights_physical_fragment:My,lights_physical_pars_fragment:by,lights_fragment_begin:Ey,lights_fragment_maps:wy,lights_fragment_end:Ty,lightprobes_pars_fragment:Ay,logdepthbuf_fragment:Ry,logdepthbuf_pars_fragment:Cy,logdepthbuf_pars_vertex:Iy,logdepthbuf_vertex:Py,map_fragment:Ly,map_pars_fragment:Dy,map_particle_fragment:Ny,map_particle_pars_fragment:Uy,metalnessmap_fragment:Oy,metalnessmap_pars_fragment:Fy,morphinstance_vertex:By,morphcolor_vertex:zy,morphnormal_vertex:Hy,morphtarget_pars_vertex:ky,morphtarget_vertex:Gy,normal_fragment_begin:Vy,normal_fragment_maps:Wy,normal_pars_fragment:Xy,normal_pars_vertex:jy,normal_vertex:qy,normalmap_pars_fragment:Yy,clearcoat_normal_fragment_begin:Zy,clearcoat_normal_fragment_maps:Jy,clearcoat_pars_fragment:Ky,iridescence_pars_fragment:$y,opaque_fragment:Qy,packing:ex,premultiplied_alpha_fragment:tx,project_vertex:ix,dithering_fragment:rx,dithering_pars_fragment:ax,roughnessmap_fragment:nx,roughnessmap_pars_fragment:sx,shadowmap_pars_fragment:ox,shadowmap_pars_vertex:lx,shadowmap_vertex:hx,shadowmask_pars_fragment:cx,skinbase_vertex:ux,skinning_pars_vertex:dx,skinning_vertex:px,skinnormal_vertex:fx,specularmap_fragment:mx,specularmap_pars_fragment:gx,tonemapping_fragment:vx,tonemapping_pars_fragment:_x,transmission_fragment:yx,transmission_pars_fragment:xx,uv_pars_fragment:Sx,uv_pars_vertex:Mx,uv_vertex:bx,worldpos_vertex:Ex,background_vert:wx,background_frag:Tx,backgroundCube_vert:Ax,backgroundCube_frag:Rx,cube_vert:Cx,cube_frag:Ix,depth_vert:Px,depth_frag:Lx,distance_vert:Dx,distance_frag:Nx,equirect_vert:Ux,equirect_frag:Ox,linedashed_vert:Fx,linedashed_frag:Bx,meshbasic_vert:zx,meshbasic_frag:Hx,meshlambert_vert:kx,meshlambert_frag:Gx,meshmatcap_vert:Vx,meshmatcap_frag:Wx,meshnormal_vert:Xx,meshnormal_frag:jx,meshphong_vert:qx,meshphong_frag:Yx,meshphysical_vert:Zx,meshphysical_frag:Jx,meshtoon_vert:Kx,meshtoon_frag:$x,points_vert:Qx,points_frag:e1,shadow_vert:t1,shadow_frag:i1,sprite_vert:r1,sprite_frag:a1},Ee={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},Di={basic:{uniforms:ai([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:ai([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:ai([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:ai([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:ai([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:ai([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:ai([Ee.points,Ee.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:ai([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:ai([Ee.common,Ee.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:ai([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:ai([Ee.sprite,Ee.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:ai([Ee.common,Ee.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:ai([Ee.lights,Ee.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Di.physical={uniforms:ai([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};var Bs={r:0,b:0,g:0},n1=new Ye,kf=new Qe;kf.set(-1,0,0,0,1,0,0,0,1);function s1(e,t,i,r,a,n){let s=new Ae(0),o=a===!0?0:1,l,h,c=null,u=0,d=null;function p(x){let S=x.isScene===!0?x.background:null;if(S&&S.isTexture){let _=x.backgroundBlurriness>0;S=t.get(S,_)}return S}function g(x){let S=!1,_=p(x);_===null?f(s,o):_&&_.isColor&&(f(_,1),S=!0);let E=e.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,n):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,n),(e.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function v(x,S){let _=p(S);_&&_.isCubeTexture?(h===void 0&&(h=new Xe(new zt(1,1,1),new cr({name:"BackgroundCubeMaterial",uniforms:Ha(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,y){this.matrixWorld.copyPosition(y.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(n1.makeRotationFromEuler(S.backgroundRotation)).transpose(),_.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(kf),h.material.toneMapped=ot.getTransfer(_.colorSpace)!==ft,(c!==_||u!==_.version||d!==e.toneMapping)&&(h.material.needsUpdate=!0,c=_,u=_.version,d=e.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Xe(new zi(2,2),new cr({name:"BackgroundMaterial",uniforms:Ha(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:Sr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=ot.getTransfer(_.colorSpace)!==ft,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(c!==_||u!==_.version||d!==e.toneMapping)&&(l.material.needsUpdate=!0,c=_,u=_.version,d=e.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,S){x.getRGB(Bs,sf(e)),i.buffers.color.setClear(Bs.r,Bs.g,Bs.b,S,n)}function m(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(x,S=1){s.set(x),o=S,f(s,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,f(s,o)},render:g,addToRenderList:v,dispose:m}}function o1(e,t){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},a=d(null),n=a,s=!1;function o(N,k,q,P,B){let Y=!1,H=u(N,P,q,k);n!==H&&(n=H,h(n.object)),Y=p(N,P,q,B),Y&&g(N,P,q,B),B!==null&&t.update(B,e.ELEMENT_ARRAY_BUFFER),(Y||s)&&(s=!1,_(N,k,q,P),B!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return e.createVertexArray()}function h(N){return e.bindVertexArray(N)}function c(N){return e.deleteVertexArray(N)}function u(N,k,q,P){let B=P.wireframe===!0,Y=r[k.id];Y===void 0&&(Y={},r[k.id]=Y);let H=N.isInstancedMesh===!0?N.id:0,he=Y[H];he===void 0&&(he={},Y[H]=he);let J=he[q.id];J===void 0&&(J={},he[q.id]=J);let Z=J[B];return Z===void 0&&(Z=d(l()),J[B]=Z),Z}function d(N){let k=[],q=[],P=[];for(let B=0;B<i;B++)k[B]=0,q[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:q,attributeDivisors:P,object:N,attributes:{},index:null}}function p(N,k,q,P){let B=n.attributes,Y=k.attributes,H=0,he=q.getAttributes();for(let J in he)if(he[J].location>=0){let Z=B[J],re=Y[J];if(re===void 0&&(J==="instanceMatrix"&&N.instanceMatrix&&(re=N.instanceMatrix),J==="instanceColor"&&N.instanceColor&&(re=N.instanceColor)),Z===void 0||Z.attribute!==re||re&&Z.data!==re.data)return!0;H++}return n.attributesNum!==H||n.index!==P}function g(N,k,q,P){let B={},Y=k.attributes,H=0,he=q.getAttributes();for(let J in he)if(he[J].location>=0){let Z=Y[J];Z===void 0&&(J==="instanceMatrix"&&N.instanceMatrix&&(Z=N.instanceMatrix),J==="instanceColor"&&N.instanceColor&&(Z=N.instanceColor));let re={};re.attribute=Z,Z&&Z.data&&(re.data=Z.data),B[J]=re,H++}n.attributes=B,n.attributesNum=H,n.index=P}function v(){let N=n.newAttributes;for(let k=0,q=N.length;k<q;k++)N[k]=0}function f(N){m(N,0)}function m(N,k){let q=n.newAttributes,P=n.enabledAttributes,B=n.attributeDivisors;q[N]=1,P[N]===0&&(e.enableVertexAttribArray(N),P[N]=1),B[N]!==k&&(e.vertexAttribDivisor(N,k),B[N]=k)}function x(){let N=n.newAttributes,k=n.enabledAttributes;for(let q=0,P=k.length;q<P;q++)k[q]!==N[q]&&(e.disableVertexAttribArray(q),k[q]=0)}function S(N,k,q,P,B,Y,H){H===!0?e.vertexAttribIPointer(N,k,q,B,Y):e.vertexAttribPointer(N,k,q,P,B,Y)}function _(N,k,q,P){v();let B=P.attributes,Y=q.getAttributes(),H=k.defaultAttributeValues;for(let he in Y){let J=Y[he];if(J.location>=0){let Z=B[he];if(Z===void 0&&(he==="instanceMatrix"&&N.instanceMatrix&&(Z=N.instanceMatrix),he==="instanceColor"&&N.instanceColor&&(Z=N.instanceColor)),Z!==void 0){let re=Z.normalized,Ie=Z.itemSize,ee=t.get(Z);if(ee===void 0)continue;let ne=ee.buffer,we=ee.type,Pe=ee.bytesPerElement,Oe=we===e.INT||we===e.UNSIGNED_INT||Z.gpuType===Oo;if(Z.isInterleavedBufferAttribute){let fe=Z.data,Ge=fe.isInterleavedBuffer===!0?fe.stride:fe.itemSize,tt=Z.offset;if(fe.isInstancedInterleavedBuffer||fe.isInstancedBufferAttribute){for(let Le=0;Le<J.locationSize;Le++)m(J.location+Le,fe.meshPerAttribute);N.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Le=0;Le<J.locationSize;Le++)f(J.location+Le);e.bindBuffer(e.ARRAY_BUFFER,ne);for(let Le=0;Le<J.locationSize;Le++)S(J.location+Le,Ie/J.locationSize,we,re,Ge*Pe,(tt+Ie/J.locationSize*Le)*Pe,Oe)}else{if(Z.isInstancedBufferAttribute){for(let fe=0;fe<J.locationSize;fe++)m(J.location+fe,Z.meshPerAttribute);N.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let fe=0;fe<J.locationSize;fe++)f(J.location+fe);e.bindBuffer(e.ARRAY_BUFFER,ne);for(let fe=0;fe<J.locationSize;fe++)S(J.location+fe,Ie/J.locationSize,we,re,Ie*Pe,Ie/J.locationSize*fe*Pe,Oe)}}else if(H!==void 0){let re=H[he];if(re!==void 0)switch(re.length){case 2:e.vertexAttrib2fv(J.location,re);break;case 3:e.vertexAttrib3fv(J.location,re);break;case 4:e.vertexAttrib4fv(J.location,re);break;default:e.vertexAttrib1fv(J.location,re)}}}}x()}function E(){w();for(let N in r){let k=r[N];for(let q in k){let P=k[q];for(let B in P){let Y=P[B];for(let H in Y)c(Y[H].object),delete Y[H];delete P[B]}}delete r[N]}}function A(N){if(r[N.id]===void 0)return;let k=r[N.id];for(let q in k){let P=k[q];for(let B in P){let Y=P[B];for(let H in Y)c(Y[H].object),delete Y[H];delete P[B]}}delete r[N.id]}function y(N){for(let k in r){let q=r[k];for(let P in q){let B=q[P];if(B[N.id]===void 0)continue;let Y=B[N.id];for(let H in Y)c(Y[H].object),delete Y[H];delete B[N.id]}}}function M(N){for(let k in r){let q=r[k],P=N.isInstancedMesh===!0?N.id:0,B=q[P];if(B!==void 0){for(let Y in B){let H=B[Y];for(let he in H)c(H[he].object),delete H[he];delete B[Y]}delete q[P],Object.keys(q).length===0&&delete r[k]}}}function w(){L(),s=!0,n!==a&&(n=a,h(n.object))}function L(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:M,releaseStatesOfProgram:y,initAttributes:v,enableAttribute:f,disableUnusedAttributes:x}}function l1(e,t,i){let r;function a(l){r=l}function n(l,h){e.drawArrays(r,l,h),i.update(h,r,1)}function s(l,h,c){c!==0&&(e.drawArraysInstanced(r,l,h,c),i.update(h,r,c))}function o(l,h,c){if(c===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,l,0,h,0,c);let u=0;for(let d=0;d<c;d++)u+=h[d];i.update(u,r,1)}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o}function h1(e,t,i,r){let a;function n(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){let y=t.get("EXT_texture_filter_anisotropic");a=e.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(y){return!(y!==pi&&r.convert(y)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(y){let M=y===Ui&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(y!==di&&y!==ni&&!M&&r.convert(y)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(y){if(y==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=i.precision!==void 0?i.precision:"highp",c=l(h);c!==h&&(xe("WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);let u=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.logarithmicDepthBuffer===!0&&u===!1;i.reversedDepthBuffer===!0&&u===!1&&xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),i.logarithmicDepthBuffer===!0&&u===!0&&xe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),m=e.getParameter(e.MAX_VERTEX_ATTRIBS),x=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),S=e.getParameter(e.MAX_VARYING_VECTORS),_=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),E=e.getParameter(e.MAX_SAMPLES),A=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:_,maxSamples:E,samples:A}}function c1(e){let t=this,i=null,r=0,a=!1,n=!1,s=new Pi,o=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||r!==0||a;return a=d,r=u.length,p},this.beginShadows=function(){n=!0,c(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(u,d){i=c(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,v=u.clipIntersection,f=u.clipShadows,m=e.get(u);if(!a||g===null||g.length===0||n&&!f)n?c(null):h();else{let x=n?0:r,S=x*4,_=m.clippingState||null;l.value=_,_=c(g,d,S,p);for(let E=0;E!==S;++E)_[E]=i[E];m.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function h(){l.value!==i&&(l.value=i,l.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function c(u,d,p,g){let v=u!==null?u.length:0,f=null;if(v!==0){if(f=l.value,g!==!0||f===null){let m=p+v*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(f===null||f.length<m)&&(f=new Float32Array(m));for(let S=0,_=p;S!==v;++S,_+=4)s.copy(u[S]).applyMatrix4(x,o),s.normal.toArray(f,_),f[_+3]=s.constant}l.value=f,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,f}}var sl=class extends yi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Vn(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new zt(5,5,5),a=new cr({name:"CubemapFromEquirect",uniforms:Ha(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:si,blending:Yr});a.uniforms.tEquirect.value=t;let n=new Xe(r,a),s=t.minFilter;return t.minFilter===Ni&&(t.minFilter=Et),new No(1,10,this).update(e,n),t.minFilter=s,n.geometry.dispose(),n.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let a=e.getRenderTarget();for(let n=0;n<6;n++)e.setRenderTarget(this,n),e.clear(t,i,r);e.setRenderTarget(a)}},Hu=256,u1=3,d1=20,Gf=256,Vf=16,p1=3,f1=new R,m1=new Ae,ph=class Wf{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new No(1,10,null),this._boxMesh=new Xe(new zt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,i=0,r=.1,a=100,n={}){let{size:s=256,position:o=f1}=n,l=this._renderer;this._setSize(s);let h=this._allocateTarget(),c=this._getSourceTarget(!0);i>0&&(c.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,p=l.autoClearDepth,g=l.autoClearStencil,v=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(t.background=l.getClearColor(m1));let f=new No(r,a,c);return f.position.copy(o),f.update(l,t),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=p,l.autoClearStencil=g,t.background=v,i>0&&(c.texture.mipmapsAutoUpdate=!0,this._blur(h,i)),this._applyPMREM(h),h}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,i){return i>0?1-Math.sqrt(1-t/i):0}_setSize(t){this._cubeSize=Math.max(Hu,Xd(t))}_fromTexture(t,i){t.mapping===or||t.mapping===Jr?this._setSize(t.image.length===0?Hu:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let r=i||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(r),r}_allocateTarget(){let t=this._cubeSize,i=ku(t,!1,!1),r=Math.log2(t)-u1;for(let a=0;a<=r;a++)i.texture.mipmaps.push({width:t>>a,height:t>>a});return i.texture.name="PMREM",i.texture.isPMREMTexture=!0,i}_getSourceTarget(t=!1){let i=this._cubeSize,r=this._sourceTarget;return(r===null||r.width!==i||t&&r.depthBuffer===!1)&&(r!==null&&r.dispose(),this._sourceTarget=ku(i,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,i,r){let a=this._boxMesh,n=this._cubeCamera;a.material=r,n.renderTarget=t,n.activeMipmapLevel=i;let s=t.width>>i;t.viewport.set(0,0,s,s),n.update(this._renderer,a),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let i;t.mapping===or||t.mapping===Jr?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vu()),i=this._cubemapMaterial,i.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Gu()),i=this._equirectMaterial),i.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,i)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=g1(),this._integrationMaterial=v1());let i=this._cubeSize,r=t.texture.mipmaps.length-1,a=this._ggxMaterial.uniforms;a.envMap.value=this._sourceTarget.texture;let n=this._integrationMaterial.uniforms;n.envMap.value=this._sourceTarget.texture,n.sourceLod.value=Math.log2(i/Vf);for(let s=0;s<=r;s++){let o=Wf.lodToRoughness(s,r);if(s>r-p1)n.roughness.value=o,this._renderCube(t,s,this._integrationMaterial);else{let l=o>0?Math.log2(i)+.5*Math.log2(6/(Gf*Math.pow(o,4)))+.5:0;a.roughness.value=o,a.lodBias.value=l,this._renderCube(t,s,this._ggxMaterial)}}}_blur(t,i){this._blurMaterial===null&&(this._blurMaterial=_1());let r=this._blurMaterial,a=r.uniforms,n=this._sourceTarget;a.sigma.value=Math.min(i,Math.PI)/Math.SQRT2,a.envMap.value=n.texture,this._renderCube(t,0,r),a.envMap.value=t.texture,this._renderCube(n,0,r)}};function ku(e,t,i){return new sl(e,{minFilter:Ni,generateMipmaps:t,type:Ui,colorSpace:Rn,depthBuffer:i})}function jn(e,t,i){return new cr({name:e,uniforms:t,vertexShader:rt.cube_vert,fragmentShader:i,side:si,blending:Yr,depthTest:!1,depthWrite:!1})}function g1(){return jn("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Gf}u

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
	`)}function v1(){return jn("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Vf}},`

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
	`)}function _1(){return jn("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${d1}
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
	`)}function Gu(){return jn("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Vu(){return jn("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function y1(e){let t=new WeakMap,i=new WeakMap,r=null;function a(d,p=!1){return d==null?null:p?s(d):n(d)}function n(d){if(d&&d.isTexture){let p=d.mapping;if(p===dn||p===pn)if(t.has(d)){let g=t.get(d).texture;return o(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let v=new sl(g.height);return v.fromEquirectangularTexture(e,d),t.set(d,v),d.addEventListener("dispose",h),o(v.texture,d.mapping)}else return null}}return d}function s(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let p=d.mapping,g=p===dn||p===pn,v=p===or||p===Jr;if(g||v){let f=i.get(d),m=f!==void 0?f.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return r===null&&(r=new ph(e)),f=g?r.fromEquirectangular(d,f):r.fromCubemap(d,f),f.texture.pmremVersion=d.pmremVersion,i.set(d,f),f.texture;if(f!==void 0)return f.texture;{let x=d.image;return g&&x&&x.height>0||v&&x&&l(x)?(r===null&&(r=new ph(e)),f=g?r.fromEquirectangular(d):r.fromCubemap(d),f.texture.pmremVersion=d.pmremVersion,i.set(d,f),d.addEventListener("dispose",c),f.texture):null}}}return d}function o(d,p){return p===dn?d.mapping=or:p===pn&&(d.mapping=Jr),d}function l(d){let p=0,g=6;for(let v=0;v<g;v++)d[v]!==void 0&&p++;return p===g}function h(d){let p=d.target;p.removeEventListener("dispose",h);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function c(d){let p=d.target;p.removeEventListener("dispose",c);let g=i.get(p);g!==void 0&&(i.delete(p),g.dispose())}function u(){t=new WeakMap,i=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:a,dispose:u}}function x1(e){let t={};function i(r){if(t[r]!==void 0)return t[r];let a=e.getExtension(r);return t[r]=a,a}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){let a=i(r);return a===null&&nr("WebGLRenderer: "+r+" extension not supported."),a}}}function S1(e,t,i,r){let a={},n=new WeakMap,s=new FinalizationRegistry(g=>delete a[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(let f in g.attributes)t.remove(g.attributes[f]);g.removeEventListener("dispose",o),delete a[g.id],s.unregister(g);let v=n.get(g);v&&(t.remove(v),n.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,i.memory.geometries--}function h(g,v){return a[v.id]!==void 0||(v.addEventListener("dispose",o),a[v.id]=new WeakRef(v),s.register(v,v.id,v),i.memory.geometries++),v}function c(g){let v=g.attributes;for(let f in v)t.update(v[f],e.ARRAY_BUFFER)}function u(g){let v=g.index,f=g.attributes.position,m=0;if(f===void 0)return;let x=v!==null?v.array.length:f.array.length/3-1,S=f.count>=65535?Fh:Oh,_=new S(Math.ceil(x/3)*6,1),E=_.array;if(v!==null){let y=v.array;m=v.version;for(let M=0,w=0;M<x;M+=3){let L=y[M+0],N=y[M+1],k=y[M+2];E[w++]=L,E[w++]=N,E[w++]=N,E[w++]=k,E[w++]=k,E[w++]=L}}else{m=f.version;for(let y=0,M=0;y<x;y+=3){let w=y+0,L=y+1,N=y+2;E[M++]=w,E[M++]=L,E[M++]=L,E[M++]=N,E[M++]=N,E[M++]=w}}_.version=m;let A=n.get(g);A&&t.remove(A),n.set(g,_)}function d(g){let v=n.get(g);if(v){let f=g.index;f!==null&&v.version<f.version&&u(g)}else u(g);return n.get(g)}function p(){for(let g in a){let v=a[g].deref();v!==void 0&&l(v)}}return{get:h,update:c,getWireframeAttribute:d,dispose:p}}function M1(e,t,i){let r;function a(u){r=u}let n,s;function o(u){n=u.type,s=u.bytesPerElement}function l(u,d){e.drawElements(r,d,n,u*s),i.update(d,r,1)}function h(u,d,p){p!==0&&(e.drawElementsInstanced(r,d,n,u*s,p),i.update(d,r,p))}function c(u,d,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,d,0,n,u,0,p);let g=0;for(let v=0;v<p;v++)g+=d[v];i.update(g,r,1)}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c}function b1(e){let t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(n,s,o){switch(i.calls++,s){case e.TRIANGLES:i.triangles+=o*(n/3);break;case e.LINES:i.lines+=o*(n/2);break;case e.LINE_STRIP:i.lines+=o*(n-1);break;case e.LINE_LOOP:i.lines+=o*n;break;case e.POINTS:i.points+=o*n;break;default:ke("WebGLInfo: Unknown draw mode:",s);break}}function a(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:a,update:r}}function E1(e,t,i){let r=new WeakMap,a=new _t;function n(s,o,l){let h=s.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=c!==void 0?c.length:0,d=r.get(o);if(d===void 0||d.count!==u){let p=function(){M.dispose(),r.delete(o),o.removeEventListener("dispose",p)};d!==void 0&&d.texture.dispose();let g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],_=0;g===!0&&(_=1),v===!0&&(_=2),f===!0&&(_=3);let E=o.attributes.position.count*_,A=1;E>t.maxTextureSize&&(A=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);let y=new Float32Array(E*A*4*u),M=new Xo(y,E,A,u);M.type=ni,M.needsUpdate=!0;let w=_*4;for(let L=0;L<u;L++){let N=m[L],k=x[L],q=S[L],P=E*A*4*L;for(let B=0;B<N.count;B++){let Y=B*w;g===!0&&(a.fromBufferAttribute(N,B),y[P+Y+0]=a.x,y[P+Y+1]=a.y,y[P+Y+2]=a.z,y[P+Y+3]=0),v===!0&&(a.fromBufferAttribute(k,B),y[P+Y+4]=a.x,y[P+Y+5]=a.y,y[P+Y+6]=a.z,y[P+Y+7]=0),f===!0&&(a.fromBufferAttribute(q,B),y[P+Y+8]=a.x,y[P+Y+9]=a.y,y[P+Y+10]=a.z,y[P+Y+11]=q.itemSize===4?a.w:1)}}d={count:u,texture:M,size:new ie(E,A)},r.set(o,d),o.addEventListener("dispose",p)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",s.morphTexture,i);else{let p=0;for(let v=0;v<h.length;v++)p+=h[v];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(e,"morphTargetBaseInfluence",g),l.getUniforms().setValue(e,"morphTargetInfluences",h)}l.getUniforms().setValue(e,"morphTargetsTexture",d.texture,i),l.getUniforms().setValue(e,"morphTargetsTextureSize",d.size)}return{update:n}}function w1(e,t,i,r,a){let n=new WeakMap;function s(h){let c=a.render.frame,u=h.geometry,d=t.get(h,u);if(n.get(d)!==c&&(t.update(d),n.set(d,c)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),n.get(h)!==c&&(i.update(h.instanceMatrix,e.ARRAY_BUFFER),h.instanceColor!==null&&i.update(h.instanceColor,e.ARRAY_BUFFER),n.set(h,c))),h.isSkinnedMesh){let p=h.skeleton;n.get(p)!==c&&(p.update(),n.set(p,c))}return d}function o(){n=new WeakMap}function l(h){let c=h.target;c.removeEventListener("dispose",l),r.releaseStatesOfObject(c),i.remove(c.instanceMatrix),c.instanceColor!==null&&i.remove(c.instanceColor)}return{update:s,dispose:o}}var T1={[vh]:"LINEAR_TONE_MAPPING",[_h]:"REINHARD_TONE_MAPPING",[yh]:"CINEON_TONE_MAPPING",[xh]:"ACES_FILMIC_TONE_MAPPING",[Mh]:"AGX_TONE_MAPPING",[Hn]:"NEUTRAL_TONE_MAPPING",[Sh]:"CUSTOM_TONE_MAPPING"};function A1(e,t,i,r,a,n){let s=new yi(t,i,{type:e,depthBuffer:a,stencilBuffer:n,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,h=null,c=new et;c.setAttribute("position",new De([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new De([0,2,0,0,2,0],2));let u=new $h({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Xe(c,u),p=new al(-1,1,1,-1,0,1),g=null,v=null,f=!1,m,x=null,S=[],_=!1;this.setSize=function(E,A){s.setSize(E,A),o!==null&&o.setSize(E,A),l!==null&&l.setSize(E,A);for(let y=0;y<S.length;y++){let M=S[y];M.setSize&&M.setSize(E,A)}},this.setEffects=function(E){S=E,_=S.length>0&&S[0].isRenderPass===!0;let A=s.width,y=s.height;S.length>0&&o===null&&(o=new yi(A,y,{type:Ui,depthBuffer:!1,stencilBuffer:!1}),l=new yi(A,y,{type:Ui,depthBuffer:!1,stencilBuffer:!1}));let M=a===!0&&S.some(w=>w.needsDepthTexture===!0);M!==(s.depthTexture!==null)&&(M===!0&&h===null&&(h=new ea(A,y),n===!0&&(h.format=rr,h.type=Kr)),s.dispose(),s.depthTexture=M?h:null,s.resolveDepthBuffer=M,s.storeMultisampledDepthBuffer=M);for(let w=0;w<S.length;w++){let L=S[w];L.setSize&&L.setSize(A,y),M&&L.needsDepthTexture===!0&&L.setDepthTexture&&L.setDepthTexture(h)}},this.begin=function(E,A){if(f||E.toneMapping===Xi&&S.length===0)return!1;if(x=A,A!==null){let y=A.width,M=A.height;(s.width!==y||s.height!==M)&&this.setSize(y,M)}return _===!1&&E.setRenderTarget(s),m=E.toneMapping,E.toneMapping=Xi,!0},this.hasRenderPass=function(){return _},this.end=function(E,A){E.toneMapping=m,f=!0;let y=s,M=o;for(let w=0;w<S.length;w++){let L=S[w];L.enabled!==!1&&(L.render(E,M,y,A),L.needsSwap!==!1&&(y=M,M=M===o?l:o))}if(g!==E.outputColorSpace||v!==E.toneMapping){g=E.outputColorSpace,v=E.toneMapping,u.defines={},ot.getTransfer(g)===ft&&(u.defines.SRGB_TRANSFER="");let w=T1[v];w&&(u.defines[w]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=y.texture,E.setRenderTarget(x),E.render(d,p),x=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){s.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Xf=new Bt,jf=new ea(1,1),qf=new Vh(1),Yf=new Xo,Zf=new jo,Jf=new Vn,Wu=[],Xu=[],ju=new Float32Array(16),qu=new Float32Array(9),Yu=new Float32Array(4);function Xa(e,t,i){let r=e[0];if(r<=0||r>0)return e;let a=t*i,n=Wu[a];if(n===void 0&&(n=new Float32Array(a),Wu[a]=n),t!==0){r.toArray(n,0);for(let s=1,o=0;s!==t;++s)o+=i,e[s].toArray(n,o)}return n}function Ot(e,t){if(e.length!==t.length)return!1;for(let i=0,r=e.length;i<r;i++)if(e[i]!==t[i])return!1;return!0}function Ft(e,t){for(let i=0,r=t.length;i<r;i++)e[i]=t[i]}function ol(e,t){let i=Xu[t];i===void 0&&(i=new Int32Array(t),Xu[t]=i);for(let r=0;r!==t;++r)i[r]=e.allocateTextureUnit();return i}function R1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1f(this.addr,t),i[0]=t)}function C1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Ot(i,t))return;e.uniform2fv(this.addr,t),Ft(i,t)}}function I1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(Ot(i,t))return;e.uniform3fv(this.addr,t),Ft(i,t)}}function P1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Ot(i,t))return;e.uniform4fv(this.addr,t),Ft(i,t)}}function L1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(Ot(i,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ft(i,t)}else{if(Ot(i,r))return;Yu.set(r),e.uniformMatrix2fv(this.addr,!1,Yu),Ft(i,r)}}function D1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(Ot(i,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ft(i,t)}else{if(Ot(i,r))return;qu.set(r),e.uniformMatrix3fv(this.addr,!1,qu),Ft(i,r)}}function N1(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(Ot(i,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ft(i,t)}else{if(Ot(i,r))return;ju.set(r),e.uniformMatrix4fv(this.addr,!1,ju),Ft(i,r)}}function U1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1i(this.addr,t),i[0]=t)}function O1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Ot(i,t))return;e.uniform2iv(this.addr,t),Ft(i,t)}}function F1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Ot(i,t))return;e.uniform3iv(this.addr,t),Ft(i,t)}}function B1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Ot(i,t))return;e.uniform4iv(this.addr,t),Ft(i,t)}}function z1(e,t){let i=this.cache;i[0]!==t&&(e.uniform1ui(this.addr,t),i[0]=t)}function H1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(Ot(i,t))return;e.uniform2uiv(this.addr,t),Ft(i,t)}}function k1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(Ot(i,t))return;e.uniform3uiv(this.addr,t),Ft(i,t)}}function G1(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(Ot(i,t))return;e.uniform4uiv(this.addr,t),Ft(i,t)}}function ll(e){return e.version===0&&(e.compareFunction=Dh,e.needsUpdate=!0),e}function V1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a);let n;this.type===e.SAMPLER_2D_SHADOW?n=ll(jf):n=Xf,i.setTexture2D(t||n,a)}function W1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture3D(t||Zf,a)}function X1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a);let n;this.type===e.SAMPLER_CUBE_SHADOW?n=ll(qf):n=Jf,i.setTextureCube(t||n,a)}function j1(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture2DArray(t||Yf,a)}function q1(e){switch(e){case 5126:return R1;case 35664:return C1;case 35665:return I1;case 35666:return P1;case 35674:return L1;case 35675:return D1;case 35676:return N1;case 5124:case 35670:return U1;case 35667:case 35671:return O1;case 35668:case 35672:return F1;case 35669:case 35673:return B1;case 5125:return z1;case 36294:return H1;case 36295:return k1;case 36296:return G1;case 35678:case 36198:case 36298:case 36306:case 35682:return V1;case 35679:case 36299:case 36307:return W1;case 35680:case 36300:case 36308:case 36293:return X1;case 36289:case 36303:case 36311:case 36292:return j1}}function Y1(e,t){e.uniform1fv(this.addr,t)}function Z1(e,t){let i=Xa(t,this.size,2);e.uniform2fv(this.addr,i)}function J1(e,t){let i=Xa(t,this.size,3);e.uniform3fv(this.addr,i)}function K1(e,t){let i=Xa(t,this.size,4);e.uniform4fv(this.addr,i)}function $1(e,t){let i=Xa(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,i)}function Q1(e,t){let i=Xa(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,i)}function eS(e,t){let i=Xa(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,i)}function tS(e,t){e.uniform1iv(this.addr,t)}function iS(e,t){e.uniform2iv(this.addr,t)}function rS(e,t){e.uniform3iv(this.addr,t)}function aS(e,t){e.uniform4iv(this.addr,t)}function nS(e,t){e.uniform1uiv(this.addr,t)}function sS(e,t){e.uniform2uiv(this.addr,t)}function oS(e,t){e.uniform3uiv(this.addr,t)}function lS(e,t){e.uniform4uiv(this.addr,t)}function hS(e,t,i){let r=this.cache,a=t.length,n=ol(i,a);Ot(r,n)||(e.uniform1iv(this.addr,n),Ft(r,n));let s;this.type===e.SAMPLER_2D_SHADOW?s=ll(jf):s=Xf;for(let o=0;o!==a;++o)i.setTexture2D(t[o]||s,n[o])}function cS(e,t,i){let r=this.cache,a=t.length,n=ol(i,a);Ot(r,n)||(e.uniform1iv(this.addr,n),Ft(r,n));for(let s=0;s!==a;++s)i.setTexture3D(t[s]||Zf,n[s])}function uS(e,t,i){let r=this.cache,a=t.length,n=ol(i,a);Ot(r,n)||(e.uniform1iv(this.addr,n),Ft(r,n));let s;this.type===e.SAMPLER_CUBE_SHADOW?s=ll(qf):s=Jf;for(let o=0;o!==a;++o)i.setTextureCube(t[o]||s,n[o])}function dS(e,t,i){let r=this.cache,a=t.length,n=ol(i,a);Ot(r,n)||(e.uniform1iv(this.addr,n),Ft(r,n));for(let s=0;s!==a;++s)i.setTexture2DArray(t[s]||Yf,n[s])}function pS(e){switch(e){case 5126:return Y1;case 35664:return Z1;case 35665:return J1;case 35666:return K1;case 35674:return $1;case 35675:return Q1;case 35676:return eS;case 5124:case 35670:return tS;case 35667:case 35671:return iS;case 35668:case 35672:return rS;case 35669:case 35673:return aS;case 5125:return nS;case 36294:return sS;case 36295:return oS;case 36296:return lS;case 35678:case 36198:case 36298:case 36306:case 35682:return hS;case 35679:case 36299:case 36307:return cS;case 35680:case 36300:case 36308:case 36293:return uS;case 36289:case 36303:case 36311:case 36292:return dS}}var fS=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=q1(t.type)}},mS=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pS(t.type)}},gS=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let a=0,n=r.length;a!==n;++a){let s=r[a];s.setValue(e,t[s.id],i)}}},$l=/(\w+)(\])?(\[|\.)?/g;function Zu(e,t){e.seq.push(t),e.map[t.id]=t}function vS(e,t,i){let r=e.name,a=r.length;for($l.lastIndex=0;;){let n=$l.exec(r),s=$l.lastIndex,o=n[1],l=n[2]==="]",h=n[3];if(l&&(o=o|0),h===void 0||h==="["&&s+2===a){Zu(i,h===void 0?new fS(o,e,t):new mS(o,e,t));break}else{let c=i.map[o];c===void 0&&(c=new gS(o),Zu(i,c)),i=c}}}var Xs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n),o=e.getUniformLocation(t,s.name);vS(s,o,this)}let r=[],a=[];for(let n of this.seq)n.type===e.SAMPLER_2D_SHADOW||n.type===e.SAMPLER_CUBE_SHADOW||n.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(n):a.push(n);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){let a=this.map[t];a!==void 0&&a.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,n=t.length;a!==n;++a){let s=t[a],o=i[s.id];o.needsUpdate!==!1&&s.setValue(e,o.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,a=e.length;r!==a;++r){let n=e[r];n.id in t&&i.push(n)}return i}};function Ju(e,t,i){let r=e.createShader(t);return e.shaderSource(r,i),e.compileShader(r),r}var _S=37297,yS=0;function xS(e,t){let i=e.split(`
`),r=[],a=Math.max(t-6,0),n=Math.min(t+6,i.length);for(let s=a;s<n;s++){let o=s+1;r.push(`${o===t?">":" "} ${o}: ${i[s]}`)}return r.join(`
`)}var Ku=new Qe;function SS(e){ot._getMatrix(Ku,ot.workingColorSpace,e);let t=`mat3( ${Ku.elements.map(i=>i.toFixed(4))} )`;switch(ot.getTransfer(e)){case Cn:return[t,"LinearTransferOETF"];case ft:return[t,"sRGBTransferOETF"];default:return xe("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function $u(e,t,i){let r=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(r&&a==="")return"";let n=/ERROR: 0:(\d+)/.exec(a);if(n){let s=parseInt(n[1]);return i.toUpperCase()+`

`+a+`

`+xS(e.getShaderSource(t),s)}else return a}function MS(e,t){let i=SS(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${i[1]}( vec4( ${i[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var bS={[vh]:"Linear",[_h]:"Reinhard",[yh]:"Cineon",[xh]:"ACESFilmic",[Mh]:"AgX",[Hn]:"Neutral",[Sh]:"Custom"};function ES(e,t){let i=bS[t];return i===void 0?(xe("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}var zs=new R;function wS(){ot.getLuminanceCoefficients(zs);let e=zs.x.toFixed(4),t=zs.y.toFixed(4),i=zs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function TS(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cn).join(`
`)}function AS(e){let t=[];for(let i in e){let r=e[i];r!==!1&&t.push("#define "+i+" "+r)}return t.join(`
`)}function RS(e,t){let i={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){let n=e.getActiveAttrib(t,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),i[s]={type:n.type,location:e.getAttribLocation(t,s),locationSize:o}}return i}function cn(e){return e!==""}function Qu(e,t){let i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function ed(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var CS=/^[ \t]*#include +<([\w\d./]+)>/gm;function fh(e){return e.replace(CS,IS)}function IS(e,t){let i=rt[t];if(i===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return fh(i)}var PS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function td(e){return e.replace(PS,LS)}function LS(e,t,i,r){let a="";for(let n=parseInt(t);n<parseInt(i);n++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function id(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var DS={[un]:"SHADOWMAP_TYPE_PCF",[Ca]:"SHADOWMAP_TYPE_VSM"};function NS(e){return DS[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var US={[Jr]:"ENVMAP_MODE_REFRACTION"};function OS(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":US[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var FS={[zn]:"ENVMAP_BLENDING_MULTIPLY",[Rd]:"ENVMAP_BLENDING_MIX",[Cd]:"ENVMAP_BLENDING_ADD"};function BS(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":FS[e.combine]||"ENVMAP_BLENDING_NONE"}function zS(e,t,i,r){let a=e.getContext(),n=i.defines,s=i.vertexShader,o=i.fragmentShader,l=NS(i),h=i.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",c=OS(i),u=BS(i),d=TS(i),p=AS(n),g=a.createProgram(),v,f,m=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(v=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,p].filter(cn).join(`
`),v.length>0&&(v+=`
`),f=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,p].filter(cn).join(`
`),f.length>0&&(f+=`
`)):(v=[id(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,p,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+c:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+i.diffuseRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cn).join(`
`),f=[id(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,p,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+h:"",i.envMap?"#define "+c:"",i.envMap?"#define "+u:"",i.envMapPMREM?"#define ENVMAP_MAX_LOD "+i.envMapMaxLod+".0":"",i.envMapPMREM?"#define ENVMAP_SIZE "+i.envMapSize+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",i.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.retroreflection?"#define USE_RETROREFLECTION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Xi?"#define TONE_MAPPING":"",i.toneMapping!==Xi?rt.tonemapping_pars_fragment:"",i.toneMapping!==Xi?ES("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,MS("linearToOutputTexel",i.outputColorSpace),wS(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(cn).join(`
`)),s=fh(s),s=Qu(s,i),s=ed(s,i),o=fh(o),o=Qu(o,i),o=ed(o,i),s=td(s),o=td(o),i.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,v=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,f=["#define varying in",i.glslVersion===nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let x=m+v+s,S=m+f+o,_=Ju(a,a.VERTEX_SHADER,x),E=Ju(a,a.FRAGMENT_SHADER,S);a.attachShader(g,_),a.attachShader(g,E),i.index0AttributeName!==void 0?a.bindAttribLocation(g,0,i.index0AttributeName):i.hasPositionAttribute===!0&&a.bindAttribLocation(g,0,"position"),a.linkProgram(g);function A(L){if(e.debug.checkShaderErrors){let N=a.getProgramInfoLog(g)||"",k=a.getShaderInfoLog(_)||"",q=a.getShaderInfoLog(E)||"",P=N.trim(),B=k.trim(),Y=q.trim(),H=!0,he=!0;if(a.getProgramParameter(g,a.LINK_STATUS)===!1)if(H=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,g,_,E);else{let J=$u(a,_,"vertex"),Z=$u(a,E,"fragment");ke("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(g,a.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+P+`
`+J+`
`+Z)}else P!==""?xe("WebGLProgram: Program Info Log:",P):(B===""||Y==="")&&(he=!1);he&&(L.diagnostics={runnable:H,programLog:P,vertexShader:{log:B,prefix:v},fragmentShader:{log:Y,prefix:f}})}a.deleteShader(_),a.deleteShader(E),y=new Xs(a,g),M=RS(a,g)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let w=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=a.getProgramParameter(g,_S)),w},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(g),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=yS++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=_,this.fragmentShader=E,this}var HS=0,kS=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new GS(e),t.set(e,i)),i}},GS=class{constructor(e){this.id=HS++,this.code=e,this.usedTimes=0}};function VS(e){return e===br||e===En||e===wn}function WS(e,t,i,r,a,n){let s=new qo,o=new kS,l=new Set,h=[],c=new Map,u=r.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function g(y,M,w,L,N,k){let q=L.fog,P=N.geometry,B=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?L.environment:null,Y=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,H=t.get(y.envMap||B,Y),he=d[y.type],J=r.precision;y.precision!==null&&(J=r.getMaxPrecision(y.precision),J!==y.precision&&xe("WebGLProgram.getParameters:",y.precision,"not supported, using",J,"instead."));let Z=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,re=Z!==void 0?Z.length:0,Ie=0;P.morphAttributes.position!==void 0&&(Ie=1),P.morphAttributes.normal!==void 0&&(Ie=2),P.morphAttributes.color!==void 0&&(Ie=3);let ee,ne,we,Pe;if(he){let pe=Di[he];ee=pe.vertexShader,ne=pe.fragmentShader}else{ee=y.vertexShader,ne=y.fragmentShader;let pe=o.getVertexShaderStage(y),Ke=o.getFragmentShaderStage(y);o.update(y,pe,Ke),we=pe.id,Pe=Ke.id}let Oe=e.getRenderTarget(),fe=e.state.buffers.depth.getReversed(),Ge=N.isInstancedMesh===!0,tt=N.isBatchedMesh===!0,Le=!!y.map,lt=!!y.matcap,oe=!!H,ge=oe&&H.isPMREMTexture===!0,ue=!!y.aoMap,Ce=!!y.lightMap,Re=!!y.bumpMap&&y.wireframe===!1,Fe=!!y.normalMap,He=!!y.displacementMap,Je=!!y.emissiveMap,it=!!y.metalnessMap,at=!!y.roughnessMap,O=y.anisotropy>0,ht=y.clearcoat>0,Ve=y.diffuseRoughness>0,dt=y.dispersion>0,de=y.retroreflectivity>0,nt=y.iridescence>0,ze=y.sheen>0,qe=y.transmission>0,xt=O&&!!y.anisotropyMap,I=ht&&!!y.clearcoatMap,b=ht&&!!y.clearcoatNormalMap,W=ht&&!!y.clearcoatRoughnessMap,le=Ve&&!!y.diffuseRoughnessMap,te=nt&&!!y.iridescenceMap,ye=nt&&!!y.iridescenceThicknessMap,_e=ze&&!!y.sheenColorMap,G=ze&&!!y.sheenRoughnessMap,ae=!!y.specularMap,Te=!!y.specularColorMap,F=!!y.specularIntensityMap,$=qe&&!!y.transmissionMap,C=qe&&!!y.thicknessMap,D=!!y.gradientMap,U=!!y.alphaMap,j=y.alphaTest>0,se=!!y.alphaHash,Q=!!y.extensions,ce=Xi;y.toneMapped&&(Oe===null||Oe.isXRRenderTarget===!0)&&(ce=e.toneMapping);let me=ge?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,Se={shaderID:he,shaderType:y.type,shaderName:y.name,vertexShader:ee,fragmentShader:ne,defines:y.defines,customVertexShaderID:we,customFragmentShaderID:Pe,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:J,batching:tt,batchingColor:tt&&N._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&N.instanceColor!==null,instancingMorph:Ge&&N.morphTexture!==null,outputColorSpace:Oe===null?e.outputColorSpace:Oe.isXRRenderTarget===!0?Oe.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Le,matcap:lt,envMap:oe,envMapMode:oe&&H.mapping,envMapPMREM:ge,envMapMaxLod:ge?me.length-1:null,envMapSize:ge?me[0].width:null,aoMap:ue,lightMap:Ce,bumpMap:Re,normalMap:Fe,displacementMap:He,emissiveMap:Je,normalMapObjectSpace:Fe&&y.normalMapType===Ud,normalMapTangentSpace:Fe&&y.normalMapType===hr,packedNormalMap:Fe&&y.normalMapType===hr&&VS(y.normalMap.format),metalnessMap:it,roughnessMap:at,anisotropy:O,anisotropyMap:xt,clearcoat:ht,clearcoatMap:I,clearcoatNormalMap:b,clearcoatRoughnessMap:W,diffuseRoughness:Ve,diffuseRoughnessMap:le,dispersion:dt,retroreflection:de,iridescence:nt,iridescenceMap:te,iridescenceThicknessMap:ye,sheen:ze,sheenColorMap:_e,sheenRoughnessMap:G,specularMap:ae,specularColorMap:Te,specularIntensityMap:F,transmission:qe,transmissionMap:$,thicknessMap:C,gradientMap:D,opaque:y.transparent===!1&&y.blending===Da&&y.alphaToCoverage===!1,alphaMap:U,alphaTest:j,alphaHash:se,combine:y.combine,mapUv:Le&&p(y.map.channel),aoMapUv:ue&&p(y.aoMap.channel),lightMapUv:Ce&&p(y.lightMap.channel),bumpMapUv:Re&&p(y.bumpMap.channel),normalMapUv:Fe&&p(y.normalMap.channel),displacementMapUv:He&&p(y.displacementMap.channel),emissiveMapUv:Je&&p(y.emissiveMap.channel),metalnessMapUv:it&&p(y.metalnessMap.channel),roughnessMapUv:at&&p(y.roughnessMap.channel),anisotropyMapUv:xt&&p(y.anisotropyMap.channel),clearcoatMapUv:I&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:b&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&p(y.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:le&&p(y.diffuseRoughnessMap.channel),iridescenceMapUv:te&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:G&&p(y.sheenRoughnessMap.channel),specularMapUv:ae&&p(y.specularMap.channel),specularColorMapUv:Te&&p(y.specularColorMap.channel),specularIntensityMapUv:F&&p(y.specularIntensityMap.channel),transmissionMapUv:$&&p(y.transmissionMap.channel),thicknessMapUv:C&&p(y.thicknessMap.channel),alphaMapUv:U&&p(y.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(Fe||O),vertexNormals:!!P.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!P.attributes.uv&&(Le||U),fog:!!q,useFog:y.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||P.attributes.normal===void 0&&Fe===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:fe,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:Ie,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:k.filter(pe=>pe.texture!==null).length,numClippingPlanes:n.numPlanes,numClipIntersection:n.numIntersection,dithering:y.dithering,shadowMapEnabled:e.shadowMap.enabled&&w.length>0,shadowMapType:e.shadowMap.type,toneMapping:ce,decodeVideoTexture:Le&&y.map.isVideoTexture===!0&&ot.getTransfer(y.map.colorSpace)===ft,decodeVideoTextureEmissive:Je&&y.emissiveMap.isVideoTexture===!0&&ot.getTransfer(y.emissiveMap.colorSpace)===ft,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Si,flipSided:y.side===si,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Q&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Q&&y.extensions.multiDraw===!0||tt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function v(y){let M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(let w in y.defines)M.push(w),M.push(y.defines[w]);return y.isRawShaderMaterial===!1&&(f(M,y),m(M,y),M.push(e.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function f(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapPMREM),y.push(M.envMapMaxLod),y.push(M.envMapSize),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.diffuseRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.numSunLights),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numSunLightShadows),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.numLightProbeGrids),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function m(y,M){s.disableAll(),M.instancing&&s.enable(0),M.instancingColor&&s.enable(1),M.instancingMorph&&s.enable(2),M.matcap&&s.enable(3),M.envMap&&s.enable(4),M.normalMapObjectSpace&&s.enable(5),M.normalMapTangentSpace&&s.enable(6),M.clearcoat&&s.enable(7),M.iridescence&&s.enable(8),M.alphaTest&&s.enable(9),M.vertexColors&&s.enable(10),M.vertexAlphas&&s.enable(11),M.vertexUv1s&&s.enable(12),M.vertexUv2s&&s.enable(13),M.vertexUv3s&&s.enable(14),M.vertexTangents&&s.enable(15),M.anisotropy&&s.enable(16),M.alphaHash&&s.enable(17),M.batching&&s.enable(18),M.dispersion&&s.enable(19),M.retroreflection&&s.enable(24),M.diffuseRoughness&&s.enable(25),M.batchingColor&&s.enable(20),M.gradientMap&&s.enable(21),M.packedNormalMap&&s.enable(22),M.vertexNormals&&s.enable(23),y.push(s.mask),s.disableAll(),M.fog&&s.enable(0),M.useFog&&s.enable(1),M.flatShading&&s.enable(2),M.logarithmicDepthBuffer&&s.enable(3),M.reversedDepthBuffer&&s.enable(4),M.skinning&&s.enable(5),M.morphTargets&&s.enable(6),M.morphNormals&&s.enable(7),M.morphColors&&s.enable(8),M.premultipliedAlpha&&s.enable(9),M.shadowMapEnabled&&s.enable(10),M.doubleSided&&s.enable(11),M.flipSided&&s.enable(12),M.useDepthPacking&&s.enable(13),M.dithering&&s.enable(14),M.transmission&&s.enable(15),M.sheen&&s.enable(16),M.opaque&&s.enable(17),M.pointsUvs&&s.enable(18),M.decodeVideoTexture&&s.enable(19),M.decodeVideoTextureEmissive&&s.enable(20),M.alphaToCoverage&&s.enable(21),M.numLightProbeGrids>0&&s.enable(22),M.hasPositionAttribute&&s.enable(23),y.push(s.mask)}function x(y){let M=d[y.type],w;if(M){let L=Di[M];w=of.clone(L.uniforms)}else w=y.uniforms;return w}function S(y,M){let w=c.get(M);return w!==void 0?++w.usedTimes:(w=new zS(e,M,y,a),h.push(w),c.set(M,w)),w}function _(y){if(--y.usedTimes===0){let M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),c.delete(y.cacheKey),y.destroy()}}function E(y){o.remove(y)}function A(){o.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:S,releaseProgram:_,releaseShaderCache:E,programs:h,dispose:A}}function XS(){let e=new WeakMap;function t(s){return e.has(s)}function i(s){let o=e.get(s);return o===void 0&&(o={},e.set(s,o)),o}function r(s){e.delete(s)}function a(s,o,l){e.get(s)[o]=l}function n(){e=new WeakMap}return{has:t,get:i,remove:r,update:a,dispose:n}}function jS(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function rd(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function ad(){let e=[],t=0,i=[],r=[],a=[];function n(){t=0,i.length=0,r.length=0,a.length=0}function s(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function o(d,p,g,v,f,m){let x=e[t];return x===void 0?(x={id:d.id,object:d,geometry:p,material:g,materialVariant:s(d),groupOrder:v,renderOrder:d.renderOrder,z:f,group:m},e[t]=x):(x.id=d.id,x.object=d,x.geometry=p,x.material=g,x.materialVariant=s(d),x.groupOrder=v,x.renderOrder=d.renderOrder,x.z=f,x.group=m),t++,x}function l(d,p,g,v,f,m,x){x.reversedDepth===!0&&(f=-f);let S=o(d,p,g,v,f,m);g.transmission>0?r.push(S):g.transparent===!0?a.push(S):i.push(S)}function h(d,p,g,v,f,m){let x=o(d,p,g,v,f,m);g.transmission>0?r.unshift(x):g.transparent===!0?a.unshift(x):i.unshift(x)}function c(d,p){i.length>1&&i.sort(d||jS),r.length>1&&r.sort(p||rd),a.length>1&&a.sort(p||rd)}function u(){for(let d=t,p=e.length;d<p;d++){let g=e[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:i,transmissive:r,transparent:a,init:n,push:l,unshift:h,finish:u,sort:c}}function qS(){let e=new WeakMap;function t(r,a){let n=e.get(r),s;return n===void 0?(s=new ad,e.set(r,[s])):a>=n.length?(s=new ad,n.push(s)):s=n[a],s}function i(){e=new WeakMap}return{get:t,dispose:i}}function YS(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={direction:new R,color:new Ae};break;case"SpotLight":i={position:new R,direction:new R,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new R,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":i={direction:new R,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":i={color:new Ae,position:new R,halfWidth:new R,halfHeight:new R};break}return e[t.id]=i,i}}}function ZS(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=i,i}}}var JS=0;function KS(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function $S(e){let t=new YS,i=ZS(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new R);let a=new R,n=new Ye,s=new Ye;function o(h){let c=0,u=0,d=0;for(let k=0;k<9;k++)r.probe[k].set(0,0,0);let p=0,g=0,v=0,f=0,m=0,x=0,S=0,_=0,E=0,A=0,y=0,M=0,w=0,L=0;h.sort(KS);for(let k=0,q=h.length;k<q;k++){let P=h[k],B=P.color,Y=P.intensity,H=P.distance,he=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===br?he=P.shadow.map.texture:he=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)c+=B.r*Y,u+=B.g*Y,d+=B.b*Y;else if(P.isLightProbe){for(let J=0;J<9;J++)r.probe[J].addScaledVector(P.sh.coefficients[J],Y);L++}else if(P.isSunLight){let J=t.get(P);if(J.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,re=i.get(P);re.shadowIntensity=Z.intensity,re.shadowBias=Z.bias,re.shadowNormalBias=Z.normalBias,re.shadowRadius=Z.radius,re.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),r.sunShadow[g]=re,r.sunShadowMap[g]=he;let Ie=Z.getViewportCount();for(let ee=0;ee<Ie;ee++)r.sunShadowMatrix[v+ee]=Z.getMatrix(ee),r.sunShadowCascade[v+ee]=Z._cascadeData[ee];v+=Ie,g++}r.sun[p]=J,p++}else if(P.isDirectionalLight){let J=t.get(P);if(J.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,re=i.get(P);re.shadowIntensity=Z.intensity,re.shadowBias=Z.bias,re.shadowNormalBias=Z.normalBias,re.shadowRadius=Z.radius,re.shadowMapSize=Z.mapSize,r.directionalShadow[f]=re,r.directionalShadowMap[f]=he,r.directionalShadowMatrix[f]=P.shadow.matrix,E++}r.directional[f]=J,f++}else if(P.isSpotLight){let J=t.get(P);J.position.setFromMatrixPosition(P.matrixWorld),J.color.copy(B).multiplyScalar(Y),J.distance=H,J.coneCos=Math.cos(P.angle),J.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),J.decay=P.decay,r.spot[x]=J;let Z=P.shadow;if(P.map&&(r.spotLightMap[M]=P.map,M++,Z.updateMatrices(P),P.castShadow&&w++),r.spotLightMatrix[x]=Z.matrix,P.castShadow){let re=i.get(P);re.shadowIntensity=Z.intensity,re.shadowBias=Z.bias,re.shadowNormalBias=Z.normalBias,re.shadowRadius=Z.radius,re.shadowMapSize=Z.mapSize,r.spotShadow[x]=re,r.spotShadowMap[x]=he,y++}x++}else if(P.isRectAreaLight){let J=t.get(P);J.color.copy(B).multiplyScalar(Y),J.halfWidth.set(P.width*.5,0,0),J.halfHeight.set(0,P.height*.5,0),r.rectArea[S]=J,S++}else if(P.isPointLight){let J=t.get(P);if(J.color.copy(P.color).multiplyScalar(P.intensity),J.distance=P.distance,J.decay=P.decay,P.castShadow){let Z=P.shadow,re=i.get(P);re.shadowIntensity=Z.intensity,re.shadowBias=Z.bias,re.shadowNormalBias=Z.normalBias,re.shadowRadius=Z.radius,re.shadowMapSize=Z.mapSize,re.shadowCameraNear=Z.camera.near,re.shadowCameraFar=Z.camera.far,r.pointShadow[m]=re,r.pointShadowMap[m]=he,r.pointShadowMatrix[m]=P.shadow.matrix,A++}r.point[m]=J,m++}else if(P.isHemisphereLight){let J=t.get(P);J.skyColor.copy(P.color).multiplyScalar(Y),J.groundColor.copy(P.groundColor).multiplyScalar(Y),r.hemi[_]=J,_++}}S>0&&(e.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ee.LTC_FLOAT_1,r.rectAreaLTC2=Ee.LTC_FLOAT_2):(r.rectAreaLTC1=Ee.LTC_HALF_1,r.rectAreaLTC2=Ee.LTC_HALF_2)),r.ambient[0]=c,r.ambient[1]=u,r.ambient[2]=d;let N=r.hash;(N.sunLength!==p||N.directionalLength!==f||N.pointLength!==m||N.spotLength!==x||N.rectAreaLength!==S||N.hemiLength!==_||N.numSunShadows!==g||N.numDirectionalShadows!==E||N.numPointShadows!==A||N.numSpotShadows!==y||N.numSpotMaps!==M||N.numLightProbes!==L)&&(r.sun.length=p,r.directional.length=f,r.spot.length=x,r.rectArea.length=S,r.point.length=m,r.hemi.length=_,r.sunShadow.length=g,r.sunShadowMap.length=g,r.sunShadowMatrix.length=v,r.sunShadowCascade.length=v,r.directionalShadow.length=E,r.directionalShadowMap.length=E,r.directionalShadowMatrix.length=E,r.pointShadow.length=A,r.pointShadowMap.length=A,r.pointShadowMatrix.length=A,r.spotShadow.length=y,r.spotShadowMap.length=y,r.spotLightMatrix.length=y+M-w,r.spotLightMap.length=M,r.numSpotLightShadowsWithMaps=w,r.numLightProbes=L,N.sunLength=p,N.directionalLength=f,N.pointLength=m,N.spotLength=x,N.rectAreaLength=S,N.hemiLength=_,N.numSunShadows=g,N.numDirectionalShadows=E,N.numPointShadows=A,N.numSpotShadows=y,N.numSpotMaps=M,N.numLightProbes=L,r.version=JS++)}function l(h,c){let u=0,d=0,p=0,g=0,v=0,f=0,m=c.matrixWorldInverse;for(let x=0,S=h.length;x<S;x++){let _=h[x];if(_.isSunLight){let E=r.sun[u];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(m),u++}else if(_.isDirectionalLight){let E=r.directional[d];E.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(a),E.direction.transformDirection(m),d++}else if(_.isSpotLight){let E=r.spot[g];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(a),E.direction.transformDirection(m),g++}else if(_.isRectAreaLight){let E=r.rectArea[v];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),s.identity(),n.copy(_.matrixWorld),n.premultiply(m),s.extractRotation(n),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(s),E.halfHeight.applyMatrix4(s),v++}else if(_.isPointLight){let E=r.point[p];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),p++}else if(_.isHemisphereLight){let E=r.hemi[f];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(m),f++}}}return{setup:o,setupView:l,state:r}}function nd(e){let t=new $S(e),i=[],r=[],a=[];function n(u){c.camera=u,i.length=0,r.length=0,a.length=0}function s(u){u.isLightProbeGrid?a.push(u):i.push(u)}function o(u){r.push(u)}function l(){t.setup(i),a.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function h(u){t.setupView(i,u)}let c={lightsArray:i,shadowsArray:r,lightProbeGridArray:a,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:n,state:c,setupLights:l,setupLightsView:h,pushLight:s,pushShadow:o}}function QS(e){let t=new WeakMap;function i(a,n=0){let s=t.get(a),o;return s===void 0?(o=new nd(e),t.set(a,[o])):n>=s.length?(o=new nd(e),s.push(o)):o=s[n],o}function r(){t=new WeakMap}return{get:i,dispose:r}}var eM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tM=`uniform sampler2D shadow_pass;
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
}`,iM=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],rM=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],sd=new Ye,on=new R,Ql=new R;function aM(e,t,i){let r=new Qr,a=new ie,n=new ie,s=new _t,o=new Qh,l=new ec,h={},c=i.maxTextureSize,u={[Sr]:si,[si]:Sr,[Si]:Si},d=new cr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:eM,fragmentShader:tM}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new et;g.setAttribute("position",new Mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Xe(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=un;let m=this.type;this.render=function(A,y,M){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;this.type===hd&&(xe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=un);let w=e.getRenderTarget(),L=e.getActiveCubeFace(),N=e.getActiveMipmapLevel(),k=e.state;k.setBlending(Yr),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let q=m!==this.type;q&&y.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=A.length;P<B;P++){let Y=A[P],H=Y.shadow;if(H===void 0){xe("WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;a.copy(H.mapSize);let he=H.getFrameExtents();a.multiply(he),n.copy(H.mapSize),(a.x>c||a.y>c)&&(a.x>c&&(n.x=Math.floor(c/he.x),a.x=n.x*he.x,H.mapSize.x=n.x),a.y>c&&(n.y=Math.floor(c/he.y),a.y=n.y*he.y,H.mapSize.y=n.y));let J=e.state.buffers.depth.getReversed();if(H.camera._reversedDepth=J,H.map===null||q===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Ca){if(Y.isPointLight){xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new yi(a.x,a.y,{format:br,type:Ui,minFilter:Et,magFilter:Et,generateMipmaps:!1}),H.map.texture.name=Y.name+".shadowMap",H.map.depthTexture=new ea(a.x,a.y,ni),H.map.depthTexture.name=Y.name+".shadowMapDepth",H.map.depthTexture.format=lr,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Rt,H.map.depthTexture.magFilter=Rt}else Y.isPointLight?(H.map=new sl(a.x),H.map.depthTexture=new Vh(a.x,bi)):(H.map=new yi(a.x,a.y),H.map.depthTexture=new ea(a.x,a.y,bi)),H.map.depthTexture.name=Y.name+".shadowMap",H.map.depthTexture.format=lr,this.type===un?(H.map.depthTexture.compareFunction=J?Lh:Ph,H.map.depthTexture.minFilter=Et,H.map.depthTexture.magFilter=Et):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Rt,H.map.depthTexture.magFilter=Rt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==a.x||H.map.height!==a.y)&&H.map.setSize(a.x,a.y);let Z=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();Y.isPointLight!==!0&&H.updateMatrices(Y,M);let re=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:M.layers;for(let Ie=0;Ie<Z;Ie++){let ee=H.getCamera(Ie);if(Y.isPointLight){let ne=H.camera,we=H.matrix,Pe=Y.distance||ne.far;Pe!==ne.far&&(ne.far=Pe,ne.updateProjectionMatrix()),on.setFromMatrixPosition(Y.matrixWorld),ne.position.copy(on),Ql.copy(ne.position),Ql.add(iM[Ie]),ne.up.copy(rM[Ie]),ne.lookAt(Ql),ne.updateMatrixWorld(),we.makeTranslation(-on.x,-on.y,-on.z),sd.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),H._frustum.setFromProjectionMatrix(sd,ne.coordinateSystem,ne.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)e.setRenderTarget(H.map,Ie),e.clear();else{Ie===0&&(e.setRenderTarget(H.map),e.clear());let ne=H.getViewport(Ie);s.set(n.x*ne.x,n.y*ne.y,n.x*ne.z,n.y*ne.w),k.viewport(s)}r=H.getFrustum(Ie),_(y,M,ee,Y,re,this.type)}H.isPointLightShadow!==!0&&this.type===Ca&&x(H,M),H.needsUpdate=!1}m=this.type,f.needsUpdate=!1,e.setRenderTarget(w,L,N)};function x(A,y){let M=t.update(v);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null?A.mapPass=new yi(a.x,a.y,{format:br,type:Ui}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),d.uniforms.shadow_pass.value=A.map.depthTexture,d.uniforms.resolution.value.set(A.map.width,A.map.height),d.uniforms.radius.value=A.radius,e.setRenderTarget(A.mapPass),e.clear(),e.renderBufferDirect(y,null,M,d,v,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value.set(A.map.width,A.map.height),p.uniforms.radius.value=A.radius,e.setRenderTarget(A.map),e.clear(),e.renderBufferDirect(y,null,M,p,v,null)}function S(A,y,M,w){let L=null,N=M.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(N!==void 0)L=N;else if(L=M.isPointLight===!0?l:o,e.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0||y.alphaToCoverage===!0){let k=L.uuid,q=y.uuid,P=h[k];P===void 0&&(P={},h[k]=P);let B=P[q];B===void 0&&(B=L.clone(),P[q]=B,y.addEventListener("dispose",E)),L=B}if(L.visible=y.visible,L.wireframe=y.wireframe,w===Ca?L.side=y.shadowSide!==null?y.shadowSide:y.side:L.side=y.shadowSide!==null?y.shadowSide:u[y.side],L.alphaMap=y.alphaMap,L.alphaTest=y.alphaToCoverage===!0?.5:y.alphaTest,L.map=y.map,L.clipShadows=y.clipShadows,L.clippingPlanes=y.clippingPlanes,L.clipIntersection=y.clipIntersection,L.displacementMap=y.displacementMap,L.displacementScale=y.displacementScale,L.displacementBias=y.displacementBias,L.wireframeLinewidth=y.wireframeLinewidth,L.linewidth=y.linewidth,M.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let k=e.properties.get(L);k.light=M}return L}function _(A,y,M,w,L,N){if(A.visible===!1)return;if(A.layers.test(L)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&N===Ca)&&(!A.frustumCulled||A.intersectsFrustum(r))){A.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,A.matrixWorld);let q=t.update(A),P=A.material;if(Array.isArray(P)){let B=q.groups;for(let Y=0,H=B.length;Y<H;Y++){let he=B[Y],J=P[he.materialIndex];if(J&&J.visible){let Z=S(A,J,w,N);A.onBeforeShadow(e,A,y,M,q,Z,he),e.renderBufferDirect(M,null,q,Z,A,he),A.onAfterShadow(e,A,y,M,q,Z,he)}}}else if(P.visible){let B=S(A,P,w,N);A.onBeforeShadow(e,A,y,M,q,B,null),e.renderBufferDirect(M,null,q,B,A,null),A.onAfterShadow(e,A,y,M,q,B,null)}}let k=A.children;for(let q=0,P=k.length;q<P;q++)_(k[q],y,M,w,L,N)}function E(A){A.target.removeEventListener("dispose",E);for(let y in h){let M=h[y],w=A.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function nM(e,t){function i(){let F=!1,$=new _t,C=null,D=new _t(0,0,0,0);return{setMask:function(U){C!==U&&!F&&(e.colorMask(U,U,U,U),C=U)},setLocked:function(U){F=U},setClear:function(U,j,se,Q,ce){ce===!0&&(U*=Q,j*=Q,se*=Q),$.set(U,j,se,Q),D.equals($)===!1&&(e.clearColor(U,j,se,Q),D.copy($))},reset:function(){F=!1,C=null,D.set(-1,0,0,0)}}}function r(){let F=!1,$=!1,C=null,D=null,U=null;return{setReversed:function(j){if($!==j){let se=t.get("EXT_clip_control");j?se.clipControlEXT(se.LOWER_LEFT_EXT,se.ZERO_TO_ONE_EXT):se.clipControlEXT(se.LOWER_LEFT_EXT,se.NEGATIVE_ONE_TO_ONE_EXT),$=j;let Q=U;U=null,this.setClear(Q)}},getReversed:function(){return $},setTest:function(j){j?fe(e.DEPTH_TEST):Ge(e.DEPTH_TEST)},setMask:function(j){C!==j&&!F&&(e.depthMask(j),C=j)},setFunc:function(j){if($&&(j=bg[j]),D!==j){switch(j){case js:e.depthFunc(e.NEVER);break;case qs:e.depthFunc(e.ALWAYS);break;case Ys:e.depthFunc(e.LESS);break;case Ua:e.depthFunc(e.LEQUAL);break;case Zs:e.depthFunc(e.EQUAL);break;case Js:e.depthFunc(e.GEQUAL);break;case Ks:e.depthFunc(e.GREATER);break;case $s:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}D=j}},setLocked:function(j){F=j},setClear:function(j){U!==j&&(U=j,$&&(j=1-j),e.clearDepth(j))},reset:function(){F=!1,C=null,D=null,U=null,$=!1}}}function a(){let F=!1,$=null,C=null,D=null,U=null,j=null,se=null,Q=null,ce=null;return{setTest:function(me){F||(me?fe(e.STENCIL_TEST):Ge(e.STENCIL_TEST))},setMask:function(me){$!==me&&!F&&(e.stencilMask(me),$=me)},setFunc:function(me,Se,pe){(C!==me||D!==Se||U!==pe)&&(e.stencilFunc(me,Se,pe),C=me,D=Se,U=pe)},setOp:function(me,Se,pe){(j!==me||se!==Se||Q!==pe)&&(e.stencilOp(me,Se,pe),j=me,se=Se,Q=pe)},setLocked:function(me){F=me},setClear:function(me){ce!==me&&(e.clearStencil(me),ce=me)},reset:function(){F=!1,$=null,C=null,D=null,U=null,j=null,se=null,Q=null,ce=null}}}let n=new i,s=new r,o=new a,l={},h=new WeakMap,c={},u={},d={},p=new WeakMap,g=[],v=null,f=!1,m=null,x=null,S=null,_=null,E=null,A=null,y=null,M=new Ae(0,0,0),w=0,L=!1,N=null,k=null,q=null,P=null,B=null,Y=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,he=0,J=e.getParameter(e.VERSION);J.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(J)[1]),H=he>=1):J.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),H=he>=2);let Z=null,re={},Ie=e.getParameter(e.SCISSOR_BOX),ee=e.getParameter(e.VIEWPORT),ne=new _t().fromArray(Ie),we=new _t().fromArray(ee);function Pe(F,$,C,D){let U=new Uint8Array(4),j=e.createTexture();e.bindTexture(F,j),e.texParameteri(F,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(F,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let se=0;se<C;se++)F===e.TEXTURE_3D||F===e.TEXTURE_2D_ARRAY?e.texImage3D($,0,e.RGBA,1,1,D,0,e.RGBA,e.UNSIGNED_BYTE,U):e.texImage2D($+se,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,U);return j}let Oe={};Oe[e.TEXTURE_2D]=Pe(e.TEXTURE_2D,e.TEXTURE_2D,1),Oe[e.TEXTURE_CUBE_MAP]=Pe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Oe[e.TEXTURE_2D_ARRAY]=Pe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Oe[e.TEXTURE_3D]=Pe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),fe(e.DEPTH_TEST),s.setFunc(Ua),Re(!1),Fe(eh),fe(e.CULL_FACE),ue(Yr);function fe(F){c[F]!==!0&&(e.enable(F),c[F]=!0)}function Ge(F){c[F]!==!1&&(e.disable(F),c[F]=!1)}function tt(F,$){return d[F]!==$?(e.bindFramebuffer(F,$),d[F]=$,F===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=$),F===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=$),!0):!1}function Le(F,$){let C=g,D=!1;if(F){C=p.get($),C===void 0&&(C=[],p.set($,C));let U=F.textures;if(C.length!==U.length||C[0]!==e.COLOR_ATTACHMENT0){for(let j=0,se=U.length;j<se;j++)C[j]=e.COLOR_ATTACHMENT0+j;C.length=U.length,D=!0}}else C[0]!==e.BACK&&(C[0]=e.BACK,D=!0);D&&e.drawBuffers(C)}function lt(F){return v!==F?(e.useProgram(F),v=F,!0):!1}let oe={[Wr]:e.FUNC_ADD,[ud]:e.FUNC_SUBTRACT,[dd]:e.FUNC_REVERSE_SUBTRACT};oe[pd]=e.MIN,oe[fd]=e.MAX;let ge={[md]:e.ZERO,[gd]:e.ONE,[vd]:e.SRC_COLOR,[mh]:e.SRC_ALPHA,[bd]:e.SRC_ALPHA_SATURATE,[Sd]:e.DST_COLOR,[yd]:e.DST_ALPHA,[_d]:e.ONE_MINUS_SRC_COLOR,[gh]:e.ONE_MINUS_SRC_ALPHA,[Md]:e.ONE_MINUS_DST_COLOR,[xd]:e.ONE_MINUS_DST_ALPHA,[Ed]:e.CONSTANT_COLOR,[wd]:e.ONE_MINUS_CONSTANT_COLOR,[Td]:e.CONSTANT_ALPHA,[Ad]:e.ONE_MINUS_CONSTANT_ALPHA};function ue(F,$,C,D,U,j,se,Q,ce,me){if(F===Yr){f===!0&&(Ge(e.BLEND),f=!1);return}if(f===!1&&(fe(e.BLEND),f=!0),F!==cd){if(F!==m||me!==L){if((x!==Wr||E!==Wr)&&(e.blendEquation(e.FUNC_ADD),x=Wr,E=Wr),me)switch(F){case Da:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Mn:e.blendFunc(e.ONE,e.ONE);break;case th:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ih:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:ke("WebGLState: Invalid blending: ",F);break}else switch(F){case Da:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Mn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case th:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ih:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",F);break}S=null,_=null,A=null,y=null,M.set(0,0,0),w=0,m=F,L=me}return}U=U||$,j=j||C,se=se||D,($!==x||U!==E)&&(e.blendEquationSeparate(oe[$],oe[U]),x=$,E=U),(C!==S||D!==_||j!==A||se!==y)&&(e.blendFuncSeparate(ge[C],ge[D],ge[j],ge[se]),S=C,_=D,A=j,y=se),(Q.equals(M)===!1||ce!==w)&&(e.blendColor(Q.r,Q.g,Q.b,ce),M.copy(Q),w=ce),m=F,L=!1}function Ce(F,$){F.side===Si?Ge(e.CULL_FACE):fe(e.CULL_FACE);let C=F.side===si;$&&(C=!C),Re(C),F.blending===Da&&F.transparent===!1?ue(Yr):ue(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),s.setFunc(F.depthFunc),s.setTest(F.depthTest),s.setMask(F.depthWrite),n.setMask(F.colorWrite);let D=F.stencilWrite;o.setTest(D),D&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Je(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?fe(e.SAMPLE_ALPHA_TO_COVERAGE):Ge(e.SAMPLE_ALPHA_TO_COVERAGE)}function Re(F){N!==F&&(F?e.frontFace(e.CW):e.frontFace(e.CCW),N=F)}function Fe(F){F!==od?(fe(e.CULL_FACE),F!==k&&(F===eh?e.cullFace(e.BACK):F===ld?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Ge(e.CULL_FACE),k=F}function He(F){F!==q&&(H&&e.lineWidth(F),q=F)}function Je(F,$,C){F?(fe(e.POLYGON_OFFSET_FILL),(P!==$||B!==C)&&(P=$,B=C,s.getReversed()&&($=-$,C=-C),e.polygonOffset($,C))):Ge(e.POLYGON_OFFSET_FILL)}function it(F){F?fe(e.SCISSOR_TEST):Ge(e.SCISSOR_TEST)}function at(F){F===void 0&&(F=e.TEXTURE0+Y-1),Z!==F&&(e.activeTexture(F),Z=F)}function O(F,$,C){C===void 0&&(Z===null?C=e.TEXTURE0+Y-1:C=Z);let D=re[C];D===void 0&&(D={type:void 0,texture:void 0},re[C]=D),(D.type!==F||D.texture!==$)&&(Z!==C&&(e.activeTexture(C),Z=C),e.bindTexture(F,$||Oe[F]),D.type=F,D.texture=$)}function ht(){let F=re[Z];F!==void 0&&F.type!==void 0&&(e.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Ve(){try{e.compressedTexImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function dt(){try{e.compressedTexImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function de(){try{e.texSubImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function nt(){try{e.texSubImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function ze(){try{e.compressedTexSubImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function qe(){try{e.compressedTexSubImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function xt(){try{e.texStorage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function I(){try{e.texStorage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function b(){try{e.texImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function W(){try{e.texImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function le(F){return u[F]!==void 0?u[F]:e.getParameter(F)}function te(F,$){u[F]!==$&&(e.pixelStorei(F,$),u[F]=$)}function ye(F){ne.equals(F)===!1&&(e.scissor(F.x,F.y,F.z,F.w),ne.copy(F))}function _e(F){we.equals(F)===!1&&(e.viewport(F.x,F.y,F.z,F.w),we.copy(F))}function G(F,$){let C=h.get($);C===void 0&&(C=new WeakMap,h.set($,C));let D=C.get(F);D===void 0&&(D=e.getUniformBlockIndex($,F.name),e.uniformBlockBinding($,D,D),C.set(F,D))}function ae(F,$,C){let D=h.get($).get(F);l[D]!==C&&(e.bindBufferBase(e.UNIFORM_BUFFER,D,C),l[D]=C)}function Te(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),c={},u={},Z=null,re={},d={},l={},p=new WeakMap,g=[],v=null,f=!1,m=null,x=null,S=null,_=null,E=null,A=null,y=null,M=new Ae(0,0,0),w=0,L=!1,N=null,k=null,q=null,P=null,B=null,ne.set(0,0,e.canvas.width,e.canvas.height),we.set(0,0,e.canvas.width,e.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:fe,disable:Ge,bindFramebuffer:tt,drawBuffers:Le,useProgram:lt,setBlending:ue,setMaterial:Ce,setFlipSided:Re,setCullFace:Fe,setLineWidth:He,setPolygonOffset:Je,setScissorTest:it,activeTexture:at,bindTexture:O,unbindTexture:ht,compressedTexImage2D:Ve,compressedTexImage3D:dt,texImage2D:b,texImage3D:W,pixelStorei:te,getParameter:le,updateUBOMapping:G,uniformBlockBinding:ae,texStorage2D:xt,texStorage3D:I,texSubImage2D:de,texSubImage3D:nt,compressedTexSubImage2D:ze,compressedTexSubImage3D:qe,scissor:ye,viewport:_e,reset:Te}}function sM(e,t,i,r,a,n,s){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ie,c=new WeakMap,u=new Set,d,p=new WeakMap,g=new Set,v=new FinalizationRegistry(I=>g.delete(I)),f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,b){return f?new OffscreenCanvas(I,b):In("canvas")}function x(I,b,W){let le=1,te=xt(I);if((te.width>W||te.height>W)&&(le=W/Math.max(te.width,te.height)),le<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let ye=Math.floor(le*te.width),_e=Math.floor(le*te.height);d===void 0&&(d=m(ye,_e));let G=b?m(ye,_e):d;return G.width=ye,G.height=_e,G.getContext("2d").drawImage(I,0,0,ye,_e),xe("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ye+"x"+_e+")."),G}else return"data"in I&&xe("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),I;return I}function S(I){return I.generateMipmaps}function _(I){e.generateMipmap(I)}function E(I){return I.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?e.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function A(I,b,W,le,te,ye=!1){if(I!==null){if(e[I]!==void 0)return e[I];xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let _e;le&&(_e=t.get("EXT_texture_norm16"),_e||xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let G=b;if(b===e.RED&&(W===e.FLOAT&&(G=e.R32F),W===e.HALF_FLOAT&&(G=e.R16F),W===e.UNSIGNED_BYTE&&(G=e.R8),W===e.UNSIGNED_SHORT&&_e&&(G=_e.R16_EXT),W===e.SHORT&&_e&&(G=_e.R16_SNORM_EXT)),b===e.RED_INTEGER&&(W===e.UNSIGNED_BYTE&&(G=e.R8UI),W===e.UNSIGNED_SHORT&&(G=e.R16UI),W===e.UNSIGNED_INT&&(G=e.R32UI),W===e.BYTE&&(G=e.R8I),W===e.SHORT&&(G=e.R16I),W===e.INT&&(G=e.R32I)),b===e.RG&&(W===e.FLOAT&&(G=e.RG32F),W===e.HALF_FLOAT&&(G=e.RG16F),W===e.UNSIGNED_BYTE&&(G=e.RG8),W===e.UNSIGNED_SHORT&&_e&&(G=_e.RG16_EXT),W===e.SHORT&&_e&&(G=_e.RG16_SNORM_EXT)),b===e.RG_INTEGER&&(W===e.UNSIGNED_BYTE&&(G=e.RG8UI),W===e.UNSIGNED_SHORT&&(G=e.RG16UI),W===e.UNSIGNED_INT&&(G=e.RG32UI),W===e.BYTE&&(G=e.RG8I),W===e.SHORT&&(G=e.RG16I),W===e.INT&&(G=e.RG32I)),b===e.RGB_INTEGER&&(W===e.UNSIGNED_BYTE&&(G=e.RGB8UI),W===e.UNSIGNED_SHORT&&(G=e.RGB16UI),W===e.UNSIGNED_INT&&(G=e.RGB32UI),W===e.BYTE&&(G=e.RGB8I),W===e.SHORT&&(G=e.RGB16I),W===e.INT&&(G=e.RGB32I)),b===e.RGBA_INTEGER&&(W===e.UNSIGNED_BYTE&&(G=e.RGBA8UI),W===e.UNSIGNED_SHORT&&(G=e.RGBA16UI),W===e.UNSIGNED_INT&&(G=e.RGBA32UI),W===e.BYTE&&(G=e.RGBA8I),W===e.SHORT&&(G=e.RGBA16I),W===e.INT&&(G=e.RGBA32I)),b===e.RGB&&(W===e.UNSIGNED_SHORT&&_e&&(G=_e.RGB16_EXT),W===e.SHORT&&_e&&(G=_e.RGB16_SNORM_EXT),W===e.UNSIGNED_INT_5_9_9_9_REV&&(G=e.RGB9_E5),W===e.UNSIGNED_INT_10F_11F_11F_REV&&(G=e.R11F_G11F_B10F)),b===e.RGBA){let ae=ye?Cn:ot.getTransfer(te);W===e.FLOAT&&(G=e.RGBA32F),W===e.HALF_FLOAT&&(G=e.RGBA16F),W===e.UNSIGNED_BYTE&&(G=ae===ft?e.SRGB8_ALPHA8:e.RGBA8),W===e.UNSIGNED_SHORT&&_e&&(G=_e.RGBA16_EXT),W===e.SHORT&&_e&&(G=_e.RGBA16_SNORM_EXT),W===e.UNSIGNED_SHORT_4_4_4_4&&(G=e.RGBA4),W===e.UNSIGNED_SHORT_5_5_5_1&&(G=e.RGB5_A1)}return(G===e.R16F||G===e.R32F||G===e.RG16F||G===e.RG32F||G===e.RGBA16F||G===e.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function y(I,b){let W;return I?b===null||b===bi||b===Kr?W=e.DEPTH24_STENCIL8:b===ni?W=e.DEPTH32F_STENCIL8:b===Oa&&(W=e.DEPTH24_STENCIL8,xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===bi||b===Kr?W=e.DEPTH_COMPONENT24:b===ni?W=e.DEPTH_COMPONENT32F:b===Oa&&(W=e.DEPTH_COMPONENT16),W}function M(I,b){return S(I)===!0||I.isFramebufferTexture&&I.minFilter!==Rt&&I.minFilter!==Et?Math.log2(Math.max(b.width,b.height))+1:I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?b.mipmaps.length:1}function w(I){let b=new WeakRef(I);r.get(I).__ref=b,g.add(b),v.register(I,b,b)}function L(I){let b=r.get(I).__ref;b!==void 0&&(g.delete(b),v.unregister(b))}function N(I){q(I.target)}function k(I){P(I.target)}function q(I){I.removeEventListener("dispose",N),L(I),Y(I),I.isVideoTexture&&c.delete(I),I.isHTMLTexture&&u.delete(I)}function P(I){I.removeEventListener("dispose",k),L(I),he(I)}function B(){for(let I of g){let b=I.deref();b!==void 0&&(b.isRenderTarget===!0?P(b):q(b))}g.clear(),u.clear()}function Y(I){let b=r.get(I);if(b.__webglInit===void 0)return;let W=I.source,le=p.get(W);if(le){let te=le[b.__cacheKey];te.usedTimes--,te.usedTimes===0&&H(I),Object.keys(le).length===0&&p.delete(W)}r.remove(I)}function H(I){let b=r.get(I);e.deleteTexture(b.__webglTexture);let W=I.source,le=p.get(W);delete le[b.__cacheKey],s.memory.textures--}function he(I){let b=r.get(I);b.__depthDisposeCallback&&b.__depthDisposeCallback();let W=I.depthTexture;if(W&&W.renderTarget===I&&q(W),I.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(b.__webglFramebuffer[te]))for(let ye=0;ye<b.__webglFramebuffer[te].length;ye++)e.deleteFramebuffer(b.__webglFramebuffer[te][ye]);else e.deleteFramebuffer(b.__webglFramebuffer[te]);b.__webglDepthbuffer&&e.deleteRenderbuffer(b.__webglDepthbuffer[te])}else{if(Array.isArray(b.__webglFramebuffer))for(let te=0;te<b.__webglFramebuffer.length;te++)e.deleteFramebuffer(b.__webglFramebuffer[te]);else e.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&e.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&e.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let te=0;te<b.__webglColorRenderbuffer.length;te++)b.__webglColorRenderbuffer[te]&&e.deleteRenderbuffer(b.__webglColorRenderbuffer[te]);b.__webglDepthRenderbuffer&&e.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let le=I.textures;for(let te=0,ye=le.length;te<ye;te++){let _e=r.get(le[te]);_e.__webglTexture&&(e.deleteTexture(_e.__webglTexture),s.memory.textures--),r.remove(le[te])}r.remove(I)}let J=0;function Z(){J=0}function re(){return J}function Ie(I){J=I}function ee(){let I=J;return I>=a.maxTextures&&xe("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+a.maxTextures),J+=1,I}function ne(I){let b=[];return b.push(I.wrapS),b.push(I.wrapT),b.push(I.wrapR||0),b.push(I.magFilter),b.push(I.minFilter),b.push(I.anisotropy),b.push(I.internalFormat),b.push(I.format),b.push(I.type),b.push(I.generateMipmaps),b.push(I.mipmapsAutoUpdate),b.push(I.premultiplyAlpha),b.push(I.flipY),b.push(I.unpackAlignment),b.push(I.colorSpace),b.join()}function we(I,b){let W=r.get(I);if(I.isVideoTexture&&ze(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&W.__version!==I.version){let le=I.image;if(le===null)xe("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)xe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(W,I,b);return}}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);i.bindTexture(e.TEXTURE_2D,W.__webglTexture,e.TEXTURE0+b)}function Pe(I,b){let W=r.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Ce(W,I,b);return}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);i.bindTexture(e.TEXTURE_2D_ARRAY,W.__webglTexture,e.TEXTURE0+b)}function Oe(I,b){let W=r.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){Ce(W,I,b);return}i.bindTexture(e.TEXTURE_3D,W.__webglTexture,e.TEXTURE0+b)}function fe(I,b){let W=r.get(I);if(I.version>0&&W.__version!==I.version){Re(W,I,b);return}i.bindTexture(e.TEXTURE_CUBE_MAP,W.__webglTexture,e.TEXTURE0+b)}let Ge={[Mr]:e.REPEAT,[Gt]:e.CLAMP_TO_EDGE,[bn]:e.MIRRORED_REPEAT},tt={[Rt]:e.NEAREST,[bh]:e.NEAREST_MIPMAP_NEAREST,[Ia]:e.NEAREST_MIPMAP_LINEAR,[Et]:e.LINEAR,[fn]:e.LINEAR_MIPMAP_NEAREST,[Ni]:e.LINEAR_MIPMAP_LINEAR},Le={[Fd]:e.NEVER,[Dh]:e.ALWAYS,[Bd]:e.LESS,[Ph]:e.LEQUAL,[zd]:e.EQUAL,[Lh]:e.GEQUAL,[Hd]:e.GREATER,[kd]:e.NOTEQUAL};function lt(I,b){if(b.type===ni&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Et||b.magFilter===fn||b.magFilter===Ia||b.magFilter===Ni||b.minFilter===Et||b.minFilter===fn||b.minFilter===Ia||b.minFilter===Ni)&&xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(I,e.TEXTURE_WRAP_S,Ge[b.wrapS]),e.texParameteri(I,e.TEXTURE_WRAP_T,Ge[b.wrapT]),(I===e.TEXTURE_3D||I===e.TEXTURE_2D_ARRAY)&&e.texParameteri(I,e.TEXTURE_WRAP_R,Ge[b.wrapR]),e.texParameteri(I,e.TEXTURE_MAG_FILTER,tt[b.magFilter]),e.texParameteri(I,e.TEXTURE_MIN_FILTER,tt[b.minFilter]),b.compareFunction&&(e.texParameteri(I,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(I,e.TEXTURE_COMPARE_FUNC,Le[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Rt||b.minFilter!==Ia&&b.minFilter!==Ni||b.type===ni&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||r.get(b).__currentAnisotropy){let W=t.get("EXT_texture_filter_anisotropic");e.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,a.getMaxAnisotropy())),r.get(b).__currentAnisotropy=b.anisotropy}}}function oe(I,b){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,b.addEventListener("dispose",N),w(b));let le=b.source,te=p.get(le);te===void 0&&(te={},p.set(le,te));let ye=ne(b);if(ye!==I.__cacheKey){te[ye]===void 0&&(te[ye]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,W=!0),te[ye].usedTimes++;let _e=te[I.__cacheKey];_e!==void 0&&(te[I.__cacheKey].usedTimes--,_e.usedTimes===0&&H(b)),I.__cacheKey=ye,I.__webglTexture=te[ye].texture}return W}function ge(I,b,W){return Math.floor(Math.floor(I/W)/b)}function ue(I,b,W,le){let te=I.updateRanges;if(te.length===0)i.texSubImage2D(e.TEXTURE_2D,0,0,0,b.width,b.height,W,le,b.data);else{te.sort((Te,F)=>Te.start-F.start);let ye=0;for(let Te=1;Te<te.length;Te++){let F=te[ye],$=te[Te],C=F.start+F.count,D=ge($.start,b.width,4),U=ge(F.start,b.width,4);$.start<=C+1&&D===U&&ge($.start+$.count-1,b.width,4)===D?F.count=Math.max(F.count,$.start+$.count-F.start):(++ye,te[ye]=$)}te.length=ye+1;let _e=i.getParameter(e.UNPACK_ROW_LENGTH),G=i.getParameter(e.UNPACK_SKIP_PIXELS),ae=i.getParameter(e.UNPACK_SKIP_ROWS);i.pixelStorei(e.UNPACK_ROW_LENGTH,b.width);for(let Te=0,F=te.length;Te<F;Te++){let $=te[Te],C=Math.floor($.start/4),D=Math.ceil($.count/4),U=C%b.width,j=Math.floor(C/b.width),se=D;i.pixelStorei(e.UNPACK_SKIP_PIXELS,U),i.pixelStorei(e.UNPACK_SKIP_ROWS,j),i.texSubImage2D(e.TEXTURE_2D,0,U,j,se,1,W,le,b.data)}I.clearUpdateRanges(),i.pixelStorei(e.UNPACK_ROW_LENGTH,_e),i.pixelStorei(e.UNPACK_SKIP_PIXELS,G),i.pixelStorei(e.UNPACK_SKIP_ROWS,ae)}}function Ce(I,b,W){let le=e.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(le=e.TEXTURE_2D_ARRAY),b.isData3DTexture&&(le=e.TEXTURE_3D);let te=oe(I,b),ye=b.source;i.bindTexture(le,I.__webglTexture,e.TEXTURE0+W);let _e=r.get(ye);if(ye.version!==_e.__version||te===!0){if(i.activeTexture(e.TEXTURE0+W),!(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)){let Q=ot.getPrimaries(ot.workingColorSpace),ce=b.colorSpace===tr?null:ot.getPrimaries(b.colorSpace),me=b.colorSpace===tr||Q===ce?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}i.pixelStorei(e.UNPACK_ALIGNMENT,b.unpackAlignment);let G=x(b.image,!1,a.maxTextureSize);G=qe(b,G);let ae=n.convert(b.format,b.colorSpace),Te=n.convert(b.type),F=A(b.internalFormat,ae,Te,b.normalized,b.colorSpace,b.isVideoTexture);lt(le,b);let $,C=b.mipmaps,D=b.isVideoTexture!==!0,U=_e.__version===void 0||te===!0,j=ye.dataReady,se=M(b,G);if(b.isDepthTexture)F=y(b.format===rr,b.type),U&&(D?i.texStorage2D(e.TEXTURE_2D,1,F,G.width,G.height):i.texImage2D(e.TEXTURE_2D,0,F,G.width,G.height,0,ae,Te,null));else if(b.isDataTexture)if(C.length>0){D&&U&&i.texStorage2D(e.TEXTURE_2D,se,F,C[0].width,C[0].height);for(let Q=0,ce=C.length;Q<ce;Q++)$=C[Q],D?j&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,$.width,$.height,ae,Te,$.data):i.texImage2D(e.TEXTURE_2D,Q,F,$.width,$.height,0,ae,Te,$.data);b.generateMipmaps=!1}else D?(U&&i.texStorage2D(e.TEXTURE_2D,se,F,G.width,G.height),j&&ue(b,G,ae,Te)):i.texImage2D(e.TEXTURE_2D,0,F,G.width,G.height,0,ae,Te,G.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){D&&U&&i.texStorage3D(e.TEXTURE_2D_ARRAY,se,F,C[0].width,C[0].height,G.depth);for(let Q=0,ce=C.length;Q<ce;Q++)if($=C[Q],b.format!==pi)if(ae!==null)if(D){if(j)if(b.layerUpdates.size>0){let me=dh($.width,$.height,b.format,b.type);for(let Se of b.layerUpdates){let pe=$.data.subarray(Se*me/$.data.BYTES_PER_ELEMENT,(Se+1)*me/$.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,Se,$.width,$.height,1,ae,pe)}}else i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,$.width,$.height,G.depth,ae,$.data)}else i.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Q,F,$.width,$.height,G.depth,0,$.data,0,0);else xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?j&&i.texSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,$.width,$.height,G.depth,ae,Te,$.data):i.texImage3D(e.TEXTURE_2D_ARRAY,Q,F,$.width,$.height,G.depth,0,ae,Te,$.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{D&&U&&i.texStorage2D(e.TEXTURE_2D,se,F,C[0].width,C[0].height);for(let Q=0,ce=C.length;Q<ce;Q++)$=C[Q],b.format!==pi?ae!==null?D?j&&i.compressedTexSubImage2D(e.TEXTURE_2D,Q,0,0,$.width,$.height,ae,$.data):i.compressedTexImage2D(e.TEXTURE_2D,Q,F,$.width,$.height,0,$.data):xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?j&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,$.width,$.height,ae,Te,$.data):i.texImage2D(e.TEXTURE_2D,Q,F,$.width,$.height,0,ae,Te,$.data)}else if(b.isDataArrayTexture)if(D){if(U&&i.texStorage3D(e.TEXTURE_2D_ARRAY,se,F,G.width,G.height,G.depth),j)if(b.layerUpdates.size>0){let Q=dh(G.width,G.height,b.format,b.type);for(let ce of b.layerUpdates){let me=G.data.subarray(ce*Q/G.data.BYTES_PER_ELEMENT,(ce+1)*Q/G.data.BYTES_PER_ELEMENT);i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ce,G.width,G.height,1,ae,Te,me)}b.clearLayerUpdates()}else i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,G.width,G.height,G.depth,ae,Te,G.data)}else i.texImage3D(e.TEXTURE_2D_ARRAY,0,F,G.width,G.height,G.depth,0,ae,Te,G.data);else if(b.isData3DTexture)D?(U&&i.texStorage3D(e.TEXTURE_3D,se,F,G.width,G.height,G.depth),j&&i.texSubImage3D(e.TEXTURE_3D,0,0,0,0,G.width,G.height,G.depth,ae,Te,G.data)):i.texImage3D(e.TEXTURE_3D,0,F,G.width,G.height,G.depth,0,ae,Te,G.data);else if(b.isFramebufferTexture){if(U)if(D)i.texStorage2D(e.TEXTURE_2D,se,F,G.width,G.height);else{let Q=G.width,ce=G.height;for(let me=0;me<se;me++)i.texImage2D(e.TEXTURE_2D,me,F,Q,ce,0,ae,Te,null),Q>>=1,ce>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in e){let Q=e.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),G.parentNode!==Q){Q.appendChild(G),u.add(b),Q.onpaint=ce=>{let me=ce.changedElements;for(let Se of u)me.includes(Se.image)&&(Se.needsUpdate=!0)},Q.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,G);else{let ce=e.RGBA,me=e.RGBA,Se=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,ce,me,Se,G)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(C.length>0){if(D&&U){let Q=xt(C[0]);i.texStorage2D(e.TEXTURE_2D,se,F,Q.width,Q.height)}for(let Q=0,ce=C.length;Q<ce;Q++)$=C[Q],D?j&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,ae,Te,$):i.texImage2D(e.TEXTURE_2D,Q,F,ae,Te,$);b.generateMipmaps=!1}else if(D){if(U){let Q=xt(G);i.texStorage2D(e.TEXTURE_2D,se,F,Q.width,Q.height)}j&&i.texSubImage2D(e.TEXTURE_2D,0,0,0,ae,Te,G)}else i.texImage2D(e.TEXTURE_2D,0,F,ae,Te,G);S(b)&&b.mipmapsAutoUpdate===!0&&_(le),_e.__version=ye.version,b.onUpdate&&b.onUpdate(b)}I.__version=b.version}function Re(I,b,W){if(b.image.length!==6)return;let le=oe(I,b),te=b.source;i.bindTexture(e.TEXTURE_CUBE_MAP,I.__webglTexture,e.TEXTURE0+W);let ye=r.get(te);if(te.version!==ye.__version||le===!0){i.activeTexture(e.TEXTURE0+W);let _e=ot.getPrimaries(ot.workingColorSpace),G=b.colorSpace===tr?null:ot.getPrimaries(b.colorSpace),ae=b.colorSpace===tr||_e===G?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(e.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);let Te=b.isCompressedTexture||b.image[0].isCompressedTexture,F=b.image[0]&&b.image[0].isDataTexture,$=[];for(let pe=0;pe<6;pe++)!Te&&!F?$[pe]=x(b.image[pe],!0,a.maxCubemapSize):$[pe]=F?b.image[pe].image:b.image[pe],$[pe]=qe(b,$[pe]);let C=$[0],D=n.convert(b.format,b.colorSpace),U=n.convert(b.type),j=A(b.internalFormat,D,U,b.normalized,b.colorSpace),se=b.isVideoTexture!==!0,Q=ye.__version===void 0||le===!0,ce=te.dataReady,me=M(b,C);lt(e.TEXTURE_CUBE_MAP,b);let Se;if(b.isDepthTexture){if(j=y(b.format===rr,b.type),Q)if(se)i.texStorage2D(e.TEXTURE_CUBE_MAP,1,j,C.width,C.height);else for(let pe=0;pe<6;pe++)i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,j,C.width,C.height,0,D,U,null)}else if(Te){se&&Q&&i.texStorage2D(e.TEXTURE_CUBE_MAP,me,j,C.width,C.height);for(let pe=0;pe<6;pe++){Se=$[pe].mipmaps;for(let Ke=0;Ke<Se.length;Ke++){let $e=Se[Ke];b.format!==pi?D!==null?se?ce&&i.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,$e.width,$e.height,D,$e.data):i.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,j,$e.width,$e.height,0,$e.data):xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):se?ce&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,0,0,$e.width,$e.height,D,U,$e.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke,j,$e.width,$e.height,0,D,U,$e.data)}}}else{if(Se=b.mipmaps,se&&Q){Se.length>0&&me++;let pe=xt($[0]);i.texStorage2D(e.TEXTURE_CUBE_MAP,me,j,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(F){se?ce&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,$[pe].width,$[pe].height,D,U,$[pe].data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,j,$[pe].width,$[pe].height,0,D,U,$[pe].data);for(let Ke=0;Ke<Se.length;Ke++){let $e=Se[Ke].image[pe].image;se?ce&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,$e.width,$e.height,D,U,$e.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,j,$e.width,$e.height,0,D,U,$e.data)}}else{se?ce&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,D,U,$[pe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,j,D,U,$[pe]);for(let Ke=0;Ke<Se.length;Ke++){let $e=Se[Ke];se?ce&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,0,0,D,U,$e.image[pe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ke+1,j,D,U,$e.image[pe])}}}S(b)&&b.mipmapsAutoUpdate===!0&&_(e.TEXTURE_CUBE_MAP),ye.__version=te.version,b.onUpdate&&b.onUpdate(b)}I.__version=b.version}function Fe(I,b,W,le,te,ye){let _e=n.convert(W.format,W.colorSpace),G=n.convert(W.type),ae=A(W.internalFormat,_e,G,W.normalized,W.colorSpace),Te=r.get(b),F=r.get(W);if(F.__renderTarget=b,!Te.__hasExternalTextures){let $=Math.max(1,b.width>>ye),C=Math.max(1,b.height>>ye);te===e.TEXTURE_3D||te===e.TEXTURE_2D_ARRAY?i.texImage3D(te,ye,ae,$,C,b.depth,0,_e,G,null):i.texImage2D(te,ye,ae,$,C,0,_e,G,null)}i.bindFramebuffer(e.FRAMEBUFFER,I),nt(b)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,le,te,F.__webglTexture,0,de(b)):(te===e.TEXTURE_2D||te>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,le,te,F.__webglTexture,ye),i.bindFramebuffer(e.FRAMEBUFFER,null)}function He(I,b,W){if(e.bindRenderbuffer(e.RENDERBUFFER,I),b.depthBuffer){let le=b.depthTexture,te=le&&le.isDepthTexture?le.type:null,ye=y(b.stencilBuffer,te),_e=b.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;nt(b)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,de(b),ye,b.width,b.height):W?e.renderbufferStorageMultisample(e.RENDERBUFFER,de(b),ye,b.width,b.height):e.renderbufferStorage(e.RENDERBUFFER,ye,b.width,b.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,_e,e.RENDERBUFFER,I)}else{let le=b.textures;for(let te=0;te<le.length;te++){let ye=le[te],_e=n.convert(ye.format,ye.colorSpace),G=n.convert(ye.type),ae=A(ye.internalFormat,_e,G,ye.normalized,ye.colorSpace);nt(b)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,de(b),ae,b.width,b.height):W?e.renderbufferStorageMultisample(e.RENDERBUFFER,de(b),ae,b.width,b.height):e.renderbufferStorage(e.RENDERBUFFER,ae,b.width,b.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Je(I,b,W){let le=b.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(e.FRAMEBUFFER,I),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let te=r.get(b.depthTexture);te.__renderTarget=b;let ye=le?b.depthTexture.image[0]:b.depthTexture.image;(!te.__webglTexture||ye.width!==b.width||ye.height!==b.height)&&(ye.width=b.width,ye.height=b.height,b.depthTexture.needsUpdate=!0),le?fe(b.depthTexture,0):we(b.depthTexture,0);let _e=te.__webglTexture,G=de(b),ae=le?e.TEXTURE_CUBE_MAP_POSITIVE_X+W:e.TEXTURE_2D,Te=b.depthTexture.format===rr?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(b.depthTexture.format===lr)nt(b)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Te,ae,_e,0,G):e.framebufferTexture2D(e.FRAMEBUFFER,Te,ae,_e,0);else if(b.depthTexture.format===rr)nt(b)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Te,ae,_e,0,G):e.framebufferTexture2D(e.FRAMEBUFFER,Te,ae,_e,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(I){let b=r.get(I),W=I.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==I.depthTexture){let le=I.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),le){let te=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,le.removeEventListener("dispose",te)};le.addEventListener("dispose",te),b.__depthDisposeCallback=te}b.__boundDepthTexture=le}if(I.depthTexture&&!b.__autoAllocateDepthBuffer)if(W)for(let le=0;le<6;le++)Je(b.__webglFramebuffer[le],I,le);else I.texture.mipmaps.length>0?Je(b.__webglFramebuffer[0],I,0):Je(b.__webglFramebuffer,I,0);else if(W){b.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(i.bindFramebuffer(e.FRAMEBUFFER,b.__webglFramebuffer[le]),b.__webglDepthbuffer[le]===void 0)b.__webglDepthbuffer[le]=e.createRenderbuffer(),He(b.__webglDepthbuffer[le],I,!1);else{let te=I.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ye=b.__webglDepthbuffer[le];e.bindRenderbuffer(e.RENDERBUFFER,ye),e.framebufferRenderbuffer(e.FRAMEBUFFER,te,e.RENDERBUFFER,ye)}}else if(I.texture.mipmaps.length>0?i.bindFramebuffer(e.FRAMEBUFFER,b.__webglFramebuffer[0]):i.bindFramebuffer(e.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=e.createRenderbuffer(),He(b.__webglDepthbuffer,I,!1);else{let le=I.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=b.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,le,e.RENDERBUFFER,te)}i.bindFramebuffer(e.FRAMEBUFFER,null)}function at(I,b,W){let le=r.get(I);b!==void 0&&Fe(le.__webglFramebuffer,I,I.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),W!==void 0&&it(I)}function O(I){let b=I.texture,W=r.get(I),le=r.get(b);I.addEventListener("dispose",k),w(I);let te=I.textures,ye=I.isWebGLCubeRenderTarget===!0,_e=te.length>1;if(_e||(le.__webglTexture===void 0&&(le.__webglTexture=e.createTexture()),le.__version=b.version,s.memory.textures++),ye){W.__webglFramebuffer=[];for(let G=0;G<6;G++)if(b.mipmaps.length>0){W.__webglFramebuffer[G]=[];for(let ae=0;ae<b.mipmaps.length;ae++)W.__webglFramebuffer[G][ae]=e.createFramebuffer()}else W.__webglFramebuffer[G]=e.createFramebuffer()}else{if(b.mipmaps.length>0){W.__webglFramebuffer=[];for(let G=0;G<b.mipmaps.length;G++)W.__webglFramebuffer[G]=e.createFramebuffer()}else W.__webglFramebuffer=e.createFramebuffer();if(_e)for(let G=0,ae=te.length;G<ae;G++){let Te=r.get(te[G]);Te.__webglTexture===void 0&&(Te.__webglTexture=e.createTexture(),s.memory.textures++)}if(I.samples>0&&nt(I)===!1){W.__webglMultisampledFramebuffer=e.createFramebuffer(),W.__webglColorRenderbuffer=[],i.bindFramebuffer(e.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let G=0;G<te.length;G++){let ae=te[G];W.__webglColorRenderbuffer[G]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,W.__webglColorRenderbuffer[G]);let Te=n.convert(ae.format,ae.colorSpace),F=n.convert(ae.type),$=A(ae.internalFormat,Te,F,ae.normalized,ae.colorSpace,I.isXRRenderTarget===!0),C=de(I);e.renderbufferStorageMultisample(e.RENDERBUFFER,C,$,I.width,I.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+G,e.RENDERBUFFER,W.__webglColorRenderbuffer[G])}e.bindRenderbuffer(e.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=e.createRenderbuffer(),He(W.__webglDepthRenderbuffer,I,!0)),i.bindFramebuffer(e.FRAMEBUFFER,null)}}if(ye){i.bindTexture(e.TEXTURE_CUBE_MAP,le.__webglTexture),lt(e.TEXTURE_CUBE_MAP,b);for(let G=0;G<6;G++)if(b.mipmaps.length>0)for(let ae=0;ae<b.mipmaps.length;ae++)Fe(W.__webglFramebuffer[G][ae],I,b,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+G,ae);else Fe(W.__webglFramebuffer[G],I,b,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0);S(b)?_(e.TEXTURE_CUBE_MAP):b.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),i.unbindTexture()}else if(_e){for(let G=0,ae=te.length;G<ae;G++){let Te=te[G],F=r.get(Te),$=e.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&($=I.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture($,F.__webglTexture),lt($,Te),Fe(W.__webglFramebuffer,I,Te,e.COLOR_ATTACHMENT0+G,$,0),S(Te)&&_($)}i.unbindTexture()}else{let G=e.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(G=I.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(G,le.__webglTexture),lt(G,b),b.mipmaps.length>0)for(let ae=0;ae<b.mipmaps.length;ae++)Fe(W.__webglFramebuffer[ae],I,b,e.COLOR_ATTACHMENT0,G,ae);else Fe(W.__webglFramebuffer,I,b,e.COLOR_ATTACHMENT0,G,0);S(b)?_(G):b.mipmaps.length>0&&e.texParameteri(G,e.TEXTURE_MAX_LEVEL,b.mipmaps.length-1),i.unbindTexture()}I.depthBuffer&&it(I)}function ht(I){let b=I.textures;for(let W=0,le=b.length;W<le;W++){let te=b[W];if(S(te)&&te.mipmapsAutoUpdate===!0){let ye=E(I),_e=r.get(te).__webglTexture;i.bindTexture(ye,_e),_(ye),i.unbindTexture()}}}let Ve=[];function dt(I){if(I.samples>0){if(nt(I)===!1){let b=I.textures,W=I.width,le=I.height,te=e.COLOR_BUFFER_BIT,ye=I.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,_e=r.get(I),G=b.length>1;if(G)for(let ae=0;ae<b.length;ae++)i.bindFramebuffer(e.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ae,e.RENDERBUFFER,null),i.bindFramebuffer(e.FRAMEBUFFER,_e.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ae,e.TEXTURE_2D,null,0);i.bindFramebuffer(e.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),I.texture.mipmaps.length>0?i.bindFramebuffer(e.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):i.bindFramebuffer(e.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let ae=0;ae<b.length;ae++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(te|=e.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(te|=e.STENCIL_BUFFER_BIT)),G){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,_e.__webglColorRenderbuffer[ae]);let Te=r.get(b[ae]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Te,0)}e.blitFramebuffer(0,0,W,le,0,0,W,le,te,e.NEAREST),l===!0&&(Ve.length=0,Ve.push(e.COLOR_ATTACHMENT0+ae),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&Ve.push(ye),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ve))}if(i.bindFramebuffer(e.READ_FRAMEBUFFER,null),i.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),G)for(let ae=0;ae<b.length;ae++){i.bindFramebuffer(e.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ae,e.RENDERBUFFER,_e.__webglColorRenderbuffer[ae]);let Te=r.get(b[ae]).__webglTexture;i.bindFramebuffer(e.FRAMEBUFFER,_e.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ae,e.TEXTURE_2D,Te,0)}i.bindFramebuffer(e.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let b=I.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[b])}}}function de(I){return Math.min(a.maxSamples,I.samples)}function nt(I){let b=r.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ze(I){let b=s.render.frame;c.get(I)!==b&&(c.set(I,b),I.update())}function qe(I,b){let W=I.colorSpace,le=I.format,te=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==Rn&&W!==tr&&(ot.getTransfer(W)===ft?(le!==pi||te!==di)&&xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",W)),b}function xt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(h.width=I.naturalWidth||I.width,h.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(h.width=I.displayWidth,h.height=I.displayHeight):(h.width=I.width,h.height=I.height),h}this.allocateTextureUnit=ee,this.resetTextureUnits=Z,this.getTextureUnits=re,this.setTextureUnits=Ie,this.setTexture2D=we,this.setTexture2DArray=Pe,this.setTexture3D=Oe,this.setTextureCube=fe,this.rebindTextures=at,this.setupRenderTarget=O,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=dt,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Fe,this.useMultisampledRTT=nt,this.dispose=B}function Kf(e,t){function i(r,a=tr){let n,s=ot.getTransfer(a);if(r===di)return e.UNSIGNED_BYTE;if(r===Fo)return e.UNSIGNED_SHORT_4_4_4_4;if(r===Bo)return e.UNSIGNED_SHORT_5_5_5_1;if(r===Th)return e.UNSIGNED_INT_5_9_9_9_REV;if(r===Ah)return e.UNSIGNED_INT_10F_11F_11F_REV;if(r===Eh)return e.BYTE;if(r===wh)return e.SHORT;if(r===Oa)return e.UNSIGNED_SHORT;if(r===Oo)return e.INT;if(r===bi)return e.UNSIGNED_INT;if(r===ni)return e.FLOAT;if(r===Ui)return e.HALF_FLOAT;if(r===Rh)return e.ALPHA;if(r===Ch)return e.RGB;if(r===pi)return e.RGBA;if(r===lr)return e.DEPTH_COMPONENT;if(r===rr)return e.DEPTH_STENCIL;if(r===zo)return e.RED;if(r===kn)return e.RED_INTEGER;if(r===br)return e.RG;if(r===Ho)return e.RG_INTEGER;if(r===ko)return e.RGBA_INTEGER;if(r===mn||r===gn||r===vn||r===_n)if(s===ft)if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(r===mn)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===gn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===vn)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===_n)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(r===mn)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===gn)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===vn)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===_n)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Qs||r===eo||r===to||r===io)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(r===Qs)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===eo)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===to)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===io)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ro||r===ao||r===no||r===so||r===oo||r===En||r===lo)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(r===ro||r===ao)return s===ft?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(r===no)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(r===so)return n.COMPRESSED_R11_EAC;if(r===oo)return n.COMPRESSED_SIGNED_R11_EAC;if(r===En)return n.COMPRESSED_RG11_EAC;if(r===lo)return n.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===ho||r===co||r===uo||r===po||r===fo||r===mo||r===go||r===vo||r===_o||r===yo||r===xo||r===So||r===Mo||r===bo)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(r===ho)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===co)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===uo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===po)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===fo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===mo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===go)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===vo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===_o)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===yo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===xo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===So)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Mo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===bo)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Eo||r===wo||r===To)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(r===Eo)return s===ft?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===wo)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===To)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ao||r===Ro||r===wn||r===Co)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(r===Ao)return n.COMPRESSED_RED_RGTC1_EXT;if(r===Ro)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===wn)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Co)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Kr?e.UNSIGNED_INT_24_8:e[r]!==void 0?e[r]:null}return{convert:i}}var oM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lM=`
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

}`,hM=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Wh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new cr({vertexShader:oM,fragmentShader:lM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xe(new zi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},cM=class extends Fi{constructor(e,t){super();let i=this,r=null,a=1,n=null,s="local-floor",o=1,l=null,h=null,c=null,u=null,d=null,p=null,g=typeof XRWebGLBinding<"u",v=new hM,f={},m=t.getContextAttributes(),x=null,S=null,_=[],E=[],A=new ie,y=null,M=null,w=new kt;w.viewport=new _t;let L=new kt;L.viewport=new _t;let N=[w,L],k=new Pf,q=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ne=_[ee];return ne===void 0&&(ne=new Ws,_[ee]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(ee){let ne=_[ee];return ne===void 0&&(ne=new Ws,_[ee]=ne),ne.getGripSpace()},this.getHand=function(ee){let ne=_[ee];return ne===void 0&&(ne=new Ws,_[ee]=ne),ne.getHandSpace()};function B(ee){let ne=E.indexOf(ee.inputSource);if(ne===-1)return;let we=_[ne];we!==void 0&&(we.update(ee.inputSource,ee.frame,l||n),we.dispatchEvent({type:ee.type,data:ee.inputSource}))}function Y(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",H);for(let ee=0;ee<_.length;ee++){let ne=E[ee];ne!==null&&(E[ee]=null,_[ee].disconnect(ne))}q=null,P=null,v.reset();for(let ee in f)delete f[ee];if(e.setRenderTarget(x),d=null,u=null,c=null,r=null,S=null,Ie.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(A.width,A.height,!1),M!==null){let ee=M.camera;ee.fov=M.fov,ee.zoom=M.zoom,ee.updateProjectionMatrix(),M=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){a=ee,i.isPresenting===!0&&xe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){s=ee,i.isPresenting===!0&&xe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||n},this.setReferenceSpace=function(ee){l=ee},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return c===null&&g&&(c=new XRWebGLBinding(r,t)),c},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(ee){if(r=ee,r!==null){if(x=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",H),m.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(A),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,we=null,Pe=null;m.depth&&(Pe=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=m.stencil?rr:lr,we=m.stencil?Kr:bi);let Oe={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:a};c=this.getBinding(),u=c.createProjectionLayer(Oe),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new yi(u.textureWidth,u.textureHeight,{format:pi,type:di,depthTexture:new ea(u.textureWidth,u.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(r,t,ne),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new yi(d.framebufferWidth,d.framebufferHeight,{format:pi,type:di,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(o),l=null,n=await r.requestReferenceSpace(s),Ie.setContext(r),Ie.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function H(ee){for(let ne=0;ne<ee.removed.length;ne++){let we=ee.removed[ne],Pe=E.indexOf(we);Pe>=0&&(E[Pe]=null,_[Pe].disconnect(we))}for(let ne=0;ne<ee.added.length;ne++){let we=ee.added[ne],Pe=E.indexOf(we);if(Pe===-1){for(let fe=0;fe<_.length;fe++)if(fe>=E.length){E.push(we),Pe=fe;break}else if(E[fe]===null){E[fe]=we,Pe=fe;break}if(Pe===-1)break}let Oe=_[Pe];Oe&&Oe.connect(we)}}function he(ee,ne){ne===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ne.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(r===null)return;let ne=ee.near,we=ee.far;v.texture!==null&&(v.depthNear>0&&(ne=v.depthNear),v.depthFar>0&&(we=v.depthFar)),k.near=L.near=w.near=ne,k.far=L.far=w.far=we,(q!==k.near||P!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),q=k.near,P=k.far),k.layers.mask=ee.layers.mask|6,w.layers.mask=k.layers.mask&-5,L.layers.mask=k.layers.mask&-3;let Pe=ee.parent,Oe=k.cameras;he(k,Pe);for(let fe=0;fe<Oe.length;fe++)he(Oe[fe],Pe);k.projectionMatrix.copy(w.projectionMatrix),k.projectionMatrixInverse.copy(w.projectionMatrixInverse),M===null&&ee.isPerspectiveCamera&&(M={camera:ee,fov:ee.fov,zoom:ee.zoom}),J(ee,k,Pe)};function J(ee,ne,we){we===null?ee.matrix.copy(ne.matrixWorld):(ee.matrix.copy(we.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ne.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ne.projectionMatrix),ee.projectionMatrixInverse.copy(ne.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Fa*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&d===null))return o},this.setFoveation=function(ee){o=ee,u!==null&&(u.fixedFoveation=ee),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ee)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(k)},this.getCameraTexture=function(ee){return f[ee]};let Z=null;function re(ee,ne){if(h=ne.getViewerPose(l||n),p=ne,h!==null){let we=h.views;d!==null&&(e.setRenderTargetFramebuffer(S,d.framebuffer),e.setRenderTarget(S));let Pe=!1;we.length!==k.cameras.length&&(k.cameras.length=0,Pe=!0);for(let fe=0;fe<we.length;fe++){let Ge=we[fe],tt=null;if(d!==null)tt=d.getViewport(Ge);else{let lt=c.getViewSubImage(u,Ge);tt=lt.viewport,fe===0&&(e.setRenderTargetTextures(S,lt.colorTexture,lt.depthStencilTexture),e.setRenderTarget(S))}let Le=N[fe];Le===void 0&&(Le=new kt,Le.layers.enable(fe),Le.viewport=new _t,N[fe]=Le),Le.matrix.fromArray(Ge.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Ge.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(tt.x,tt.y,tt.width,tt.height),fe===0&&(k.matrix.copy(Le.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Pe===!0&&k.cameras.push(Le)}let Oe=r.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&g){c=i.getBinding();let fe=c.getDepthInformation(we[0]);fe&&fe.isValid&&fe.texture&&v.init(fe,r.renderState)}if(Oe&&Oe.includes("camera-access")&&g){e.state.unbindTexture(),c=i.getBinding();for(let fe=0;fe<we.length;fe++){let Ge=we[fe].camera;if(Ge){let tt=f[Ge];tt||(tt=new Wh,f[Ge]=tt);let Le=c.getCameraImage(Ge);tt.sourceTexture=Le}}}}for(let we=0;we<_.length;we++){let Pe=E[we],Oe=_[we];Pe!==null&&Oe!==void 0&&Oe.update(Pe,ne,l||n)}Z&&Z(ee,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),p=null}let Ie=new Hf;Ie.setAnimationLoop(re),this.setAnimationLoop=function(ee){Z=ee},this.dispose=function(){}}},uM=new Ye,$f=new Qe;$f.set(-1,0,0,0,1,0,0,0,1);function dM(e,t){function i(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function r(f,m){m.color.getRGB(f.fogColor.value,sf(e)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function a(f,m,x,S,_){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?n(f,m):m.isMeshLambertMaterial?(n(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(n(f,m),u(f,m)):m.isMeshPhongMaterial?(n(f,m),c(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(n(f,m),d(f,m),m.isMeshPhysicalMaterial&&p(f,m,_)):m.isMeshMatcapMaterial?(n(f,m),g(f,m)):m.isMeshDepthMaterial?n(f,m):m.isMeshDistanceMaterial?(n(f,m),v(f,m)):m.isMeshNormalMaterial?n(f,m):m.isLineBasicMaterial?(s(f,m),m.isLineDashedMaterial&&o(f,m)):m.isPointsMaterial?l(f,m,x,S):m.isSpriteMaterial?h(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function n(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,i(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,i(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,i(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===si&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,i(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===si&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,i(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,i(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,i(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);let x=t.get(m),S=x.envMap,_=x.envMapRotation;S&&(f.envMap.value=S,f.envMapRotation.value.setFromMatrix4(uM.makeRotationFromEuler(_)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply($f),f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,i(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,i(m.aoMap,f.aoMapTransform))}function s(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,i(m.map,f.mapTransform))}function o(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function l(f,m,x,S){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*x,f.scale.value=S*.5,m.map&&(f.map.value=m.map,i(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,i(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function h(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,i(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,i(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function c(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function u(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function d(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,i(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,i(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function p(f,m,x){f.ior.value=m.ior,m.diffuseRoughness>0&&(f.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(f.diffuseRoughnessMap.value=m.diffuseRoughnessMap,i(m.diffuseRoughnessMap,f.diffuseRoughnessMapTransform))),m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,i(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,i(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,i(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,i(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,i(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===si&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.retroreflectivity>0&&(f.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,f.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,i(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,i(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,i(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,i(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,i(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,i(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,i(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function v(f,m){let x=t.get(m).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function pM(e,t,i,r){let a={},n={};function s(x,S){let _=S.program;r.uniformBlockBinding(x,_,a[x.id])}function o(x,S){let _=a[x.id];_===void 0&&(g(x),_=l(x),a[x.id]=_,x.addEventListener("dispose",f));let E=S.program;r.updateUBOMapping(x,E);let A=t.render.frame;n[x.id]!==A&&(h(x),n[x.id]=A)}function l(x){let S=e.createBuffer(),_=x.__size,E=x.usage;return e.bindBuffer(e.UNIFORM_BUFFER,S),e.bufferData(e.UNIFORM_BUFFER,_,E),e.bindBuffer(e.UNIFORM_BUFFER,null),S}function h(x){let S=a[x.id],_=x.uniforms,E=x.__cache;e.bindBuffer(e.UNIFORM_BUFFER,S);for(let A=0,y=_.length;A<y;A++){let M=_[A];if(Array.isArray(M))for(let w=0,L=M.length;w<L;w++)c(M[w],A,w,E);else c(M,A,0,E)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function c(x,S,_,E){if(d(x,S,_,E)===!0){let A=x.__offset,y=x.value;if(Array.isArray(y)){let M=0;for(let w=0;w<y.length;w++){let L=y[w],N=v(L,!0);u(L,x.__data,M),M+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(y,x.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,A,x.__data)}}function u(x,S,_){typeof x=="number"||typeof x=="boolean"?S[_]=x:x.isMatrix3?(S[_]=x.elements[0],S[_+1]=x.elements[1],S[_+2]=x.elements[2],S[_+3]=0,S[_+4]=x.elements[3],S[_+5]=x.elements[4],S[_+6]=x.elements[5],S[_+7]=0,S[_+8]=x.elements[6],S[_+9]=x.elements[7],S[_+10]=x.elements[8],S[_+11]=0):ArrayBuffer.isView(x)?S.set(x.subarray(0,S.length-_),_):x.toArray(S,_)}function d(x,S,_,E){let A=x.value,y=S+"_"+_;if(Array.isArray(A)){E[y]===void 0&&(E[y]=[]);let M=E[y],w=!1;for(let L=0;L<A.length;L++)p(A[L],M,L)===!0&&(w=!0);return w}return p(A,E,y)}function p(x,S,_){if(S[_]===void 0)return typeof x=="number"||typeof x=="boolean"?S[_]=x:ArrayBuffer.isView(x)?S[_]=x.slice():S[_]=x.clone(),!0;{let E=S[_];if(typeof x=="number"||typeof x=="boolean"){if(E!==x)return S[_]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(E.equals(x)===!1)return E.copy(x),!0}}return!1}function g(x){let S=x.uniforms,_=0,E=16;for(let y=0,M=S.length;y<M;y++){let w=Array.isArray(S[y])?S[y]:[S[y]];for(let L=0,N=w.length;L<N;L++){let k=w[L],q=Array.isArray(k.value)?k.value:[k.value],P=Array.isArray(S[y])||Array.isArray(k.value),B=_;for(let H=0,he=q.length;H<he;H++){let J=q[H],Z=v(J,P),re=_%E,Ie=re%Z.boundary,ee=re+Ie;_+=Ie,ee!==0&&E-ee<Z.storage&&(_+=E-ee),H===0&&(B=_),_+=Z.storage}let Y=k.type==="int"?Int32Array:k.type==="uint"?Uint32Array:Float32Array;k.__data=new Y((_-B)/Float32Array.BYTES_PER_ELEMENT),k.__offset=B}}let A=_%E;return A>0&&(_+=E-A),x.__size=_,x.__cache={},this}function v(x,S){let _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=16,_.storage=48):x.isMatrix4?(_.boundary=16,_.storage=64):x.isTexture?xe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(_.boundary=16,_.storage=x.byteLength):xe("WebGLRenderer: Unsupported uniform value type.",x),S===!0&&(_.boundary=16,_.storage=Math.ceil(_.storage/16)*16),_}function f(x){let S=x.target;S.removeEventListener("dispose",f),e.deleteBuffer(a[S.id]),delete a[S.id],delete n[S.id]}function m(){for(let x in a)e.deleteBuffer(a[x]);a={},n={}}return{bind:s,update:o,dispose:m}}var fM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Gi=null;function mM(){return Gi===null&&(Gi=new Mi(fM,16,16,br,Ui),Gi.name="DFG_LUT",Gi.minFilter=Et,Gi.magFilter=Et,Gi.wrapS=Gt,Gi.wrapT=Gt,Gi.generateMipmaps=!1,Gi.needsUpdate=!0),Gi}var uc=class{constructor(e={}){let{canvas:t=Vd(),context:i=null,depth:r=!0,stencil:a=!1,alpha:n=!1,antialias:s=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:c=!1,reversedDepthBuffer:u=!1,outputBufferType:d=di}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=n;let g=d,v=new Set([ko,Ho,kn]),f=new Set([di,bi,Oa,Kr,Fo,Bo]),m=new Uint32Array(4),x=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]},_=null,E=null,A=[],y=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let w=this,L=!1,N=null,k=null,q=null,P=null;this._outputColorSpace=Ut;let B=0,Y=0,H=null,he=-1,J=null,Z=new _t,re=new _t,Ie=null,ee=new Ae(0),ne=0,we=t.width,Pe=t.height,Oe=1,fe=null,Ge=null,tt=new _t(0,0,we,Pe),Le=new _t(0,0,we,Pe),lt=!1,oe=new Qr,ge=new Hh,ue=!1,Ce=!1,Re=new Ye,Fe=new R,He=new _t,Je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},it=!1;function at(){return H===null?Oe:1}let O=i;function ht(T,z){return t.getContext(T,z)}let Ve,dt,de,nt,ze,qe,xt,I,b,W,le,te,ye,_e,G,ae,Te,F,$,C,D,U,j;try{let T={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:c};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r187"),t.addEventListener("webglcontextlost",ce,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",Se,!1),O===null){let z="webgl2";if(O=ht(z,T),O===null)throw ht(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}se()}catch(T){throw t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),ke("WebGLRenderer: "+T.message),T}function se(){Ve=new x1(O),Ve.init(),D=new Kf(O,Ve),dt=new h1(O,Ve,e,D),de=new nM(O,Ve),dt.reversedDepthBuffer&&u&&de.buffers.depth.setReversed(!0),k=O.createFramebuffer(),q=O.createFramebuffer(),P=O.createFramebuffer(),nt=new b1(O),ze=new XS,qe=new sM(O,Ve,de,ze,dt,D,nt),xt=new y1(w),I=new w_(O),U=new o1(O,I),b=new S1(O,I,nt,U),W=new w1(O,b,I,U,nt),F=new E1(O,dt,qe),G=new c1(ze),le=new WS(w,xt,Ve,dt,U,G),te=new dM(w,ze),ye=new qS,_e=new QS(Ve),Te=new s1(w,xt,de,W,p,o),ae=new aM(w,W,dt),j=new pM(O,nt,dt,de),$=new l1(O,Ve,nt),C=new M1(O,Ve,nt),nt.programs=le.programs,w.capabilities=dt,w.extensions=Ve,w.properties=ze,w.renderLists=ye,w.shadowMap=ae,w.state=de,w.info=nt}g!==di&&(M=new A1(g,t.width,t.height,s,r,a));let Q=new cM(w,O);this.xr=Q,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Oe},this.setPixelRatio=function(T){T!==void 0&&(Oe=T,this.setSize(we,Pe,!1))},this.getSize=function(T){return T.set(we,Pe)},this.setSize=function(T,z,K=!0){if(Q.isPresenting){xe("WebGLRenderer: Can't change size while VR device is presenting.");return}we=T,Pe=z,t.width=Math.floor(T*Oe),t.height=Math.floor(z*Oe),K===!0&&(t.style.width=T+"px",t.style.height=z+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(we*Oe,Pe*Oe).floor()},this.setDrawingBufferSize=function(T,z,K){we=T,Pe=z,Oe=K,t.width=Math.floor(T*K),t.height=Math.floor(z*K),this.setViewport(0,0,T,z)},this.setEffects=function(T){if(g===di){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let z=0;z<T.length;z++)if(T[z].isOutputPass===!0){xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(Z)},this.getViewport=function(T){return T.copy(tt)},this.setViewport=function(T,z,K,X){T.isVector4?tt.set(T.x,T.y,T.z,T.w):tt.set(T,z,K,X),de.viewport(Z.copy(tt).multiplyScalar(at()).round())},this.getScissor=function(T){return T.copy(Le)},this.setScissor=function(T,z,K,X){T.isVector4?Le.set(T.x,T.y,T.z,T.w):Le.set(T,z,K,X),de.scissor(re.copy(Le).multiplyScalar(at()).round())},this.getScissorTest=function(){return lt},this.setScissorTest=function(T){de.setScissorTest(lt=T)},this.setOpaqueSort=function(T){fe=T},this.setTransparentSort=function(T){Ge=T},this.getClearColor=function(T){return T.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor(...arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,K=!0){let X=0;if(T){let V=!1;if(H!==null){let ve=H.texture.format;V=v.has(ve)}if(V){let ve=H.texture.type,be=f.has(ve),Me=Te.getClearColor(),Ne=Te.getClearAlpha(),je=Me.r,st=Me.g,ct=Me.b;be?(m[0]=je,m[1]=st,m[2]=ct,m[3]=Ne,O.clearBufferuiv(O.COLOR,0,m)):(x[0]=je,x[1]=st,x[2]=ct,x[3]=Ne,O.clearBufferiv(O.COLOR,0,x))}else X|=O.COLOR_BUFFER_BIT}z&&(X|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),N=T},this.dispose=function(){t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),Te.dispose(),ye.dispose(),_e.dispose(),qe.dispose(),ze.dispose(),xt.dispose(),W.dispose(),b.dispose(),U.dispose(),j.dispose(),le.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",mc),Q.removeEventListener("sessionend",gc),Cr.stop()};function ce(T){T.preventDefault(),Pn("WebGLRenderer: Context Lost."),L=!0}function me(){Pn("WebGLRenderer: Context Restored."),L=!1;let T=nt.autoReset,z=ae.enabled,K=ae.autoUpdate,X=ae.needsUpdate,V=ae.type;se(),nt.autoReset=T,ae.enabled=z,ae.autoUpdate=K,ae.needsUpdate=X,ae.type=V}function Se(T){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function pe(T){let z=T.target;z.removeEventListener("dispose",pe),Ke(z)}function Ke(T){$e(T),ze.remove(T)}function $e(T){let z=ze.get(T).programs;z!==void 0&&(z.forEach(function(K){le.releaseProgram(K)}),T.isShaderMaterial&&le.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,K,X,V,ve){z===null&&(z=Je);let be=V.isMesh&&V.matrixWorld.determinantAffine()<0,Me=gm(T,z,K,X,V);de.setMaterial(X,be);let Ne=K.index,je=1;if(X.wireframe===!0){if(Ne=b.getWireframeAttribute(K),Ne===void 0)return;je=2}let st=K.drawRange,ct=K.attributes.position,Be=st.start*je,pt=(st.start+st.count)*je;ve!==null&&(Be=Math.max(Be,ve.start*je),pt=Math.min(pt,(ve.start+ve.count)*je)),Ne!==null?(Be=Math.max(Be,0),pt=Math.min(pt,Ne.count)):ct!=null&&(Be=Math.max(Be,0),pt=Math.min(pt,ct.count));let Lt=pt-Be;if(Lt<0||Lt===1/0)return;U.setup(V,X,Me,K,Ne);let gt,yt=$;if(Ne!==null&&(gt=I.get(Ne),yt=C,yt.setIndex(gt)),V.isMesh)X.wireframe===!0?(de.setLineWidth(X.wireframeLinewidth*at()),yt.setMode(O.LINES)):yt.setMode(O.TRIANGLES);else if(V.isLine){let wt=X.linewidth;wt===void 0&&(wt=1),de.setLineWidth(wt*at()),V.isLineSegments?yt.setMode(O.LINES):V.isLineLoop?yt.setMode(O.LINE_LOOP):yt.setMode(O.LINE_STRIP)}else V.isPoints?yt.setMode(O.POINTS):V.isSprite&&yt.setMode(O.TRIANGLES);if(V.isBatchedMesh)if(Ve.get("WEBGL_multi_draw"))yt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let wt=V._multiDrawStarts,We=V._multiDrawCounts,ti=V._multiDrawCount,Ir=Ne?I.get(Ne).bytesPerElement:1,Pr=ze.get(X).currentProgram.getUniforms();for(let Zt=0;Zt<ti;Zt++)Pr.setValue(O,"_gl_DrawID",Zt),yt.render(wt[Zt]/Ir,We[Zt])}else if(V.isInstancedMesh)yt.renderInstances(Be,Lt,V.count);else if(K.isInstancedBufferGeometry){let wt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,We=Math.min(K.instanceCount,wt);yt.renderInstances(Be,Lt,We)}else yt.render(Be,Lt)};function Pt(T,z,K,X){N!==null&&T.isNodeMaterial&&N.setObject(X,T),ue===!0&&G.setState(T,K,!1),T.transparent===!0&&T.side===Si&&T.forceSinglePass===!1?(T.side=si,T.needsUpdate=!0,Ya(T,z,X),T.side=Sr,T.needsUpdate=!0,Ya(T,z,X),T.side=Si):Ya(T,z,X)}this.compile=function(T,z,K=null){K===null&&(K=T),N!==null&&N.renderStart(T,z,K),E=_e.get(K),E.init(z),y.push(E),K.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),T!==K&&T.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),E.setupLights(),N!==null&&N.updateLights(E.state.lightsArray),Ce=this.localClippingEnabled,ue=G.init(this.clippingPlanes,Ce),ue===!0&&G.setGlobalState(this.clippingPlanes,z),N!==null&&ae.render(E.state.shadowsArray,K,z);let X=new Set;return T.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let ve=V.material;if(ve)if(Array.isArray(ve))for(let be=0;be<ve.length;be++){let Me=ve[be];Pt(Me,K,z,V),X.add(Me)}else Pt(ve,K,z,V),X.add(ve)}),E=y.pop(),N!==null&&N.renderEnd(),X},this.compileAsync=function(T,z,K=null){let X=this.compile(T,z,K);return new Promise(V=>{function ve(){if(X.forEach(function(be){let Me=ze.get(be).currentProgram;(Me===void 0||Me.isReady())&&X.delete(be)}),X.size===0){V(T);return}setTimeout(ve,10)}Ve.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let mi=null;function dl(T){mi&&mi(T)}function mc(){Cr.stop()}function gc(){Cr.start()}let Cr=new Hf;Cr.setAnimationLoop(dl),typeof self<"u"&&Cr.setContext(self),this.setAnimationLoop=function(T){mi=T,Q.setAnimationLoop(T),T===null?Cr.stop():Cr.start()},Q.addEventListener("sessionstart",mc),Q.addEventListener("sessionend",gc),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;N!==null&&N.renderStart(T,z);let K=Q.enabled===!0&&Q.isPresenting===!0,X=M!==null&&(H===null||K)&&M.begin(w,H);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(z),z=Q.getCamera()),T.isScene===!0&&T.onBeforeRender(w,T,z,H),E=_e.get(T,y.length),E.init(z),E.state.textureUnits=qe.getTextureUnits(),y.push(E),Re.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),z.isArrayCamera?ge.setFromArrayCamera(z):oe.setFromProjectionMatrix(Re,_i,z.reversedDepth),Ce=this.localClippingEnabled,ue=G.init(this.clippingPlanes,Ce),_=ye.get(T,A.length),_.init(),A.push(_),this.info.render.frame++,Q.enabled===!0&&Q.isPresenting===!0){let ve=w.xr.getDepthSensingMesh();ve!==null&&pl(ve,z,-1/0,w.sortObjects)}pl(T,z,0,w.sortObjects),_.finish(),N!==null&&N.updateLights(E.state.lightsArray),w.sortObjects===!0&&_.sort(fe,Ge),it=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,it&&Te.addToRenderList(_,T),this.info.autoReset===!0&&this.info.reset(),ue===!0&&G.beginShadows();let V=E.state.shadowsArray;if(ae.render(V,T,z),ue===!0&&G.endShadows(),(X&&M.hasRenderPass())===!1){let ve=_.opaque,be=_.transmissive;if(E.setupLights(),z.isArrayCamera){let Me=z.cameras;if(be.length>0)for(let Ne=0,je=Me.length;Ne<je;Ne++){let st=Me[Ne];_c(ve,be,T,st)}it&&Te.render(T);for(let Ne=0,je=Me.length;Ne<je;Ne++){let st=Me[Ne];vc(_,T,st,st.viewport)}}else be.length>0&&_c(ve,be,T,z),it&&Te.render(T),vc(_,T,z)}H!==null&&Y===0&&(qe.updateMultisampleRenderTarget(H),qe.updateRenderTargetMipmap(H)),X&&M.end(w),T.isScene===!0&&T.onAfterRender(w,T,z),U.resetDefaultState(),he=-1,J=null,y.pop(),y.length>0?(E=y[y.length-1],qe.setTextureUnits(E.state.textureUnits),ue===!0&&G.setGlobalState(w.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?_=A[A.length-1]:_=null,N!==null&&N.renderEnd()};function pl(T,z,K,X){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)K=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){let ve=z.isArrayCamera?ge:oe;if(!T.frustumCulled||T.intersectsFrustum(ve)){X&&He.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Re);let be=W.update(T),Me=T.material;Me.visible&&_.push(T,be,Me,K,He.z,null,z)}}else if(T.isMesh||T.isLine||T.isPoints){let ve=z.isArrayCamera?ge:oe;if(!T.frustumCulled||T.intersectsFrustum(ve)){let be=W.update(T),Me=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),He.copy(T.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),He.copy(be.boundingSphere.center)),He.applyMatrix4(T.matrixWorld).applyMatrix4(Re)),Array.isArray(Me)){let Ne=be.groups;for(let je=0,st=Ne.length;je<st;je++){let ct=Ne[je],Be=Me[ct.materialIndex];Be&&Be.visible&&_.push(T,be,Be,K,He.z,ct,z)}}else Me.visible&&_.push(T,be,Me,K,He.z,null,z)}}}let V=T.children;for(let ve=0,be=V.length;ve<be;ve++)pl(V[ve],z,K,X)}function vc(T,z,K,X){let{opaque:V,transmissive:ve,transparent:be}=T;E.setupLightsView(K),ue===!0&&G.setGlobalState(w.clippingPlanes,K),X&&de.viewport(Z.copy(X)),V.length>0&&qn(V,z,K),ve.length>0&&qn(ve,z,K),be.length>0&&qn(be,z,K),de.buffers.depth.setTest(!0),de.buffers.depth.setMask(!0),de.buffers.color.setMask(!0),de.setPolygonOffset(!1)}function _c(T,z,K,X){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[X.id]===void 0){let ct=Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[X.id]=new yi(1,1,{generateMipmaps:!0,type:ct?Ui:di,minFilter:Ni,samples:Math.max(4,dt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ot.workingColorSpace})}let V=E.state.transmissionRenderTarget[X.id],ve=X.viewport||Z;V.setSize(ve.z*w.transmissionResolutionScale,ve.w*w.transmissionResolutionScale);let be=w.getRenderTarget(),Me=w.getActiveCubeFace(),Ne=w.getActiveMipmapLevel();w.setRenderTarget(V),w.getClearColor(ee),ne=w.getClearAlpha(),ne<1&&w.setClearColor(16777215,.5),w.clear(),it&&Te.render(K);let je=w.toneMapping;w.toneMapping=Xi;let st=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),E.setupLightsView(X),ue===!0&&G.setGlobalState(w.clippingPlanes,X),qn(T,K,X),qe.updateMultisampleRenderTarget(V),qe.updateRenderTargetMipmap(V),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let ct=!1;for(let Be=0,pt=z.length;Be<pt;Be++){let Lt=z[Be],{object:gt,geometry:yt,material:wt,group:We}=Lt;if(wt.side===Si&&gt.layers.test(X.layers)){let ti=wt.side;wt.side=si,wt.needsUpdate=!0,yc(gt,K,X,yt,wt,We),wt.side=ti,wt.needsUpdate=!0,ct=!0}}ct===!0&&(qe.updateMultisampleRenderTarget(V),qe.updateRenderTargetMipmap(V))}w.setRenderTarget(be,Me,Ne),w.setClearColor(ee,ne),st!==void 0&&(X.viewport=st),w.toneMapping=je}function qn(T,z,K){let X=z.isScene===!0?z.overrideMaterial:null;for(let V=0,ve=T.length;V<ve;V++){let be=T[V],{object:Me,geometry:Ne,group:je}=be,st=be.material;st.allowOverride===!0&&X!==null&&(st=X),Me.layers.test(K.layers)&&yc(Me,z,K,Ne,st,je)}}function yc(T,z,K,X,V,ve){N!==null&&V.isNodeMaterial&&N.setObject(T,V),T.onBeforeRender(w,z,K,X,V,ve),T.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),V.onBeforeRender(w,z,K,X,T,ve),V.transparent===!0&&V.side===Si&&V.forceSinglePass===!1?(V.side=si,V.needsUpdate=!0,w.renderBufferDirect(K,z,X,V,T,ve),V.side=Sr,V.needsUpdate=!0,w.renderBufferDirect(K,z,X,V,T,ve),V.side=Si):w.renderBufferDirect(K,z,X,V,T,ve),T.onAfterRender(w,z,K,X,V,ve)}function xc(T){let z=0;for(let K of T)K.texture!==null&&z++;return z}function Ya(T,z,K){z.isScene!==!0&&(z=Je);let X=ze.get(T),V=E.state.lights,ve=E.state.shadowsArray,be=V.state.version,Me=le.getParameters(T,V.state,ve,z,K,E.state.lightProbeGridArray),Ne=le.getProgramCacheKey(Me),je=X.programs;X.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?z.environment:null,X.fog=z.fog;let st=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;X.envMap=xt.get(T.envMap||X.environment,st),X.envMapRotation=X.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,je===void 0&&(T.addEventListener("dispose",pe),je=new Map,X.programs=je,X.programVariants=new Map);let ct=je.get(Ne);if(ct!==void 0){if(X.currentProgram===ct&&X.lightsStateVersion===be)return Mc(T,Me),ct}else Me.uniforms=le.getUniforms(T),N!==null&&T.isNodeMaterial&&N.build(T,K,Me),T.onBeforeCompile(Me,w),ct=le.acquireProgram(Me,Ne),je.set(Ne,ct),X.uniforms=Me.uniforms;let Be=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Be.clippingPlanes=G.uniform),Mc(T,Me),X.needsLights=_m(T),X.lightsStateVersion=be,X.needsLights&&(Be.ambientLightColor.value=V.state.ambient,Be.lightProbe.value=V.state.probe,Be.sunLights.value=V.state.sun,Be.sunLightShadows.value=V.state.sunShadow,Be.directionalLights.value=V.state.directional,Be.directionalLightShadows.value=V.state.directionalShadow,Be.spotLights.value=V.state.spot,Be.spotLightShadows.value=V.state.spotShadow,Be.rectAreaLights.value=V.state.rectArea,Be.ltc_1.value=V.state.rectAreaLTC1,Be.ltc_2.value=V.state.rectAreaLTC2,Be.pointLights.value=V.state.point,Be.pointLightShadows.value=V.state.pointShadow,Be.hemisphereLights.value=V.state.hemi,Be.sunShadowMatrix.value=V.state.sunShadowMatrix,Be.sunShadowCascade.value=V.state.sunShadowCascade,Be.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Be.spotLightMatrix.value=V.state.spotLightMatrix,Be.spotLightMap.value=V.state.spotLightMap,Be.pointShadowMatrix.value=V.state.pointShadowMatrix),X.numLightProbeGrids=xc(E.state.lightProbeGridArray),X.currentProgram=ct,X.uniformsList=null,ct}function mm(T,z,K,X,V){let ve=ze.get(T),be=ve.currentProgram.id+","+X+","+V,Me=ve.programVariants.get(be);return Me===void 0?(Me=Ya(T,z,K),ve.programVariants.set(be,Me)):(ve.currentProgram=Me,ve.uniformsList=null,ve.outputColorSpace=X,ve.toneMapping=V),Me}function Sc(T){if(T.uniformsList===null){let z=T.currentProgram.getUniforms();T.uniformsList=Xs.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function Mc(T,z){let K=ze.get(T);K.outputColorSpace=z.outputColorSpace,K.batching=z.batching,K.batchingColor=z.batchingColor,K.instancing=z.instancing,K.instancingColor=z.instancingColor,K.instancingMorph=z.instancingMorph,K.skinning=z.skinning,K.morphTargets=z.morphTargets,K.morphNormals=z.morphNormals,K.morphColors=z.morphColors,K.morphTargetsCount=z.morphTargetsCount,K.numClippingPlanes=z.numClippingPlanes,K.numIntersection=z.numClipIntersection,K.vertexAlphas=z.vertexAlphas,K.vertexTangents=z.vertexTangents,K.toneMapping=z.toneMapping}function gm(T,z,K,X,V){z.isScene!==!0&&(z=Je),qe.resetTextureUnits();let ve=z.fog,be=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?z.environment:null,Me=H===null?w.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:ot.workingColorSpace,Ne=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,je=xt.get(X.envMap||be,Ne),st=X.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,ct=!!K.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Be=!!K.morphAttributes.position,pt=!!K.morphAttributes.normal,Lt=!!K.morphAttributes.color,gt=Xi;X.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(gt=w.toneMapping);let yt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,wt=yt!==void 0?yt.length:0,We=ze.get(X),ti=E.state.lights;if(ue===!0&&(Ce===!0||T!==J)){let St=T===J&&X.id===he;G.setState(X,T,St)}let Ir=!1,Pr=!1;X.version===We.__version?We.needsLights&&We.lightsStateVersion!==ti.state.version||V.isBatchedMesh&&We.batching===!1||!V.isBatchedMesh&&We.batching===!0||V.isBatchedMesh&&We.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&We.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&We.instancing===!1||!V.isInstancedMesh&&We.instancing===!0||V.isSkinnedMesh&&We.skinning===!1||!V.isSkinnedMesh&&We.skinning===!0||V.isInstancedMesh&&We.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&We.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&We.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&We.instancingMorph===!1&&V.morphTexture!==null||We.envMap!==je||X.fog===!0&&We.fog!==ve||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==G.numPlanes||We.numIntersection!==G.numIntersection)||We.vertexAlphas!==st||We.vertexTangents!==ct||We.morphTargets!==Be||We.morphNormals!==pt||We.morphColors!==Lt||We.morphTargetsCount!==wt||We.numLightProbeGrids!==xc(E.state.lightProbeGridArray)?Ir=!0:(We.outputColorSpace!==Me||We.toneMapping!==gt)&&(Pr=!0):(Ir=!0,We.__version=X.version);let Zt=We.currentProgram;(Ir===!0||Pr===!0)&&(Zt=Pr===!0?mm(X,z,V,Me,gt):Ya(X,z,V),N&&X.isNodeMaterial&&N.onUpdateProgram(X,Zt,We));let Yn=!1,pr=!1,Lr=!1,ut=Zt.getUniforms(),Wt=We.uniforms;if(de.useProgram(Zt.program)&&(Yn=!0,pr=!0,Lr=!0),X.id!==he&&(he=X.id,pr=!0),Yn||J!==T){de.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ut.setValue(O,"projectionMatrix",T.projectionMatrix),ut.setValue(O,"viewMatrix",T.matrixWorldInverse);let St=ut.map.cameraPosition;St!==void 0&&St.setValue(O,Fe.setFromMatrixPosition(T.matrixWorld)),dt.logarithmicDepthBuffer&&ut.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ut.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),J!==T&&(J=T,pr=!0,Lr=!0)}if(We.needsLights&&(ti.state.sunShadowMap.length>0&&ut.setValue(O,"sunShadowMap",ti.state.sunShadowMap,qe),ti.state.directionalShadowMap.length>0&&ut.setValue(O,"directionalShadowMap",ti.state.directionalShadowMap,qe),ti.state.spotShadowMap.length>0&&ut.setValue(O,"spotShadowMap",ti.state.spotShadowMap,qe),ti.state.pointShadowMap.length>0&&ut.setValue(O,"pointShadowMap",ti.state.pointShadowMap,qe)),V.isSkinnedMesh){ut.setOptional(O,V,"bindMatrix"),ut.setOptional(O,V,"bindMatrixInverse");let St=V.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),ut.setValue(O,"boneTexture",St.boneTexture,qe))}V.isBatchedMesh&&(ut.setOptional(O,V,"batchingTexture"),ut.setValue(O,"batchingTexture",V._matricesTexture,qe),ut.setOptional(O,V,"batchingIdTexture"),ut.setValue(O,"batchingIdTexture",V._indirectTexture,qe),ut.setOptional(O,V,"batchingColorTexture"),V._colorsTexture!==null&&ut.setValue(O,"batchingColorTexture",V._colorsTexture,qe));let Ai=K.morphAttributes;if((Ai.position!==void 0||Ai.normal!==void 0||Ai.color!==void 0)&&F.update(V,K,Zt),(pr||We.receiveShadow!==V.receiveShadow)&&(We.receiveShadow=V.receiveShadow,ut.setValue(O,"receiveShadow",V.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&z.environment!==null&&(Wt.envMapIntensity.value=z.environmentIntensity),Wt.dfgLUT!==void 0&&(Wt.dfgLUT.value=mM()),pr){if(ut.setValue(O,"toneMappingExposure",w.toneMappingExposure),We.needsLights&&vm(Wt,Lr),ve&&X.fog===!0&&te.refreshFogUniforms(Wt,ve),te.refreshMaterialUniforms(Wt,X,Oe,Pe,E.state.transmissionRenderTarget[T.id]),We.needsLights&&We.numLightProbeGrids>0){let St=S,ii=0;for(let Yi of E.state.lightProbeGridArray)Yi.texture!==null&&(St.textures[ii]=Yi.texture,St.min[ii]=Yi.boundingBox.min,St.max[ii]=Yi.boundingBox.max,St.resolution[ii]=Yi.resolution,ii++);for(let Yi in St)St[Yi].length=ii;Wt.probesSH.value=St.textures,Wt.probesMin.value=St.min,Wt.probesMax.value=St.max,Wt.probesResolution.value=St.resolution}Xs.upload(O,Sc(We),Wt,qe)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Xs.upload(O,Sc(We),Wt,qe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ut.setValue(O,"center",V.center),ut.setValue(O,"modelViewMatrix",V.modelViewMatrix),ut.setValue(O,"normalMatrix",V.normalMatrix),ut.setValue(O,"modelMatrix",V.matrixWorld),X.uniformsGroups!==void 0){let St=X.uniformsGroups;for(let ii=0,Yi=St.length;ii<Yi;ii++){let Ec=St[ii];j.update(Ec,Zt),j.bind(Ec,Zt)}}return Zt}function vm(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.sunLights.needsUpdate=z,T.sunLightShadows.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function _m(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(T,z,K){let X=ze.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ze.get(T.texture).__webglTexture=z,ze.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:K,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){let K=ze.get(T);K.__webglFramebuffer=z,K.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(T,z=0,K=0){H=T,B=z,Y=K;let X=null,V=!1,ve=!1;if(T){let be=ze.get(T);if(be.__useDefaultFramebuffer!==void 0){de.bindFramebuffer(O.FRAMEBUFFER,be.__webglFramebuffer),Z.copy(T.viewport),re.copy(T.scissor),Ie=T.scissorTest,de.viewport(Z),de.scissor(re),de.setScissorTest(Ie),he=-1;return}else if(be.__webglFramebuffer===void 0)qe.setupRenderTarget(T);else if(be.__hasExternalTextures)qe.rebindTextures(T,ze.get(T.texture).__webglTexture,ze.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let je=T.depthTexture;if(be.__boundDepthTexture!==je){if(je!==null&&ze.has(je)&&(T.width!==je.image.width||T.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(T)}}let Me=T.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(ve=!0);let Ne=ze.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ne[z])?X=Ne[z][K]:X=Ne[z],V=!0):T.samples>0&&qe.useMultisampledRTT(T)===!1?X=ze.get(T).__webglMultisampledFramebuffer:Array.isArray(Ne)?X=Ne[K]:X=Ne,Z.copy(T.viewport),re.copy(T.scissor),Ie=T.scissorTest}else Z.copy(tt).multiplyScalar(Oe).floor(),re.copy(Le).multiplyScalar(Oe).floor(),Ie=lt;if(K!==0&&(X=k),de.bindFramebuffer(O.FRAMEBUFFER,X)&&de.drawBuffers(T,X),de.viewport(Z),de.scissor(re),de.setScissorTest(Ie),V){let be=ze.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+z,be.__webglTexture,K)}else if(ve){let be=z;for(let Me=0;Me<T.textures.length;Me++){let Ne=ze.get(T.textures[Me]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Me,Ne.__webglTexture,K,be)}}else if(T!==null&&K!==0){let be=ze.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,be.__webglTexture,K)}he=-1};function bc(T){let z=ze.get(T);return(z.__readFormat!==T.format||z.__readType!==T.type)&&(z.__readFormat=T.format,z.__readType=T.type,z.__formatReadable=dt.textureFormatReadable(T.format),z.__typeReadable=dt.textureTypeReadable(T.type)),z}this.readRenderTargetPixels=function(T,z,K,X,V,ve,be,Me=0){if(!(T&&T.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=ze.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Ne=Ne[be],Array.isArray(Ne)&&(Ne=Ne[0])),Ne){de.bindFramebuffer(O.FRAMEBUFFER,Ne);try{let je=T.textures[Me],st=je.format,ct=je.type;T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Me);let Be=bc(je);if(Be.__formatReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Be.__typeReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-X&&K>=0&&K<=T.height-V&&O.readPixels(z,K,X,V,D.convert(st),D.convert(ct),ve)}finally{let je=H!==null?ze.get(H).__webglFramebuffer:null;de.bindFramebuffer(O.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(T,z,K,X,V,ve,be,Me=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=ze.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Ne=Ne[be],Array.isArray(Ne)&&(Ne=Ne[0])),Ne)if(z>=0&&z<=T.width-X&&K>=0&&K<=T.height-V){de.bindFramebuffer(O.FRAMEBUFFER,Ne);let je=T.textures[Me],st=je.format,ct=je.type;T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Me);let Be=bc(je);if(Be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let pt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,pt),O.bufferData(O.PIXEL_PACK_BUFFER,ve.byteLength,O.STREAM_READ),O.readPixels(z,K,X,V,D.convert(st),D.convert(ct),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let Lt=H!==null?ze.get(H).__webglFramebuffer:null;de.bindFramebuffer(O.FRAMEBUFFER,Lt);let gt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Mg(O,gt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,pt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ve),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(pt),O.deleteSync(gt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,K=0){let X=Math.pow(2,-K),V=Math.floor(T.image.width*X),ve=Math.floor(T.image.height*X),be=z!==null?z.x:0,Me=z!==null?z.y:0;qe.setTexture2D(T,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,be,Me,V,ve),de.unbindTexture()},this.copyTextureToTexture=function(T,z,K=null,X=null,V=0,ve=0){let be,Me,Ne,je,st,ct,Be,pt,Lt,gt=T.isCompressedTexture?T.mipmaps[ve]:T.image;if(K!==null)be=K.max.x-K.min.x,Me=K.max.y-K.min.y,Ne=K.isBox3?K.max.z-K.min.z:1,je=K.min.x,st=K.min.y,ct=K.isBox3?K.min.z:0;else{let ut=Math.pow(2,-V);be=Math.floor(gt.width*ut),Me=Math.floor(gt.height*ut),T.isDataArrayTexture?Ne=gt.depth:T.isData3DTexture?Ne=Math.floor(gt.depth*ut):Ne=1,je=0,st=0,ct=0}X!==null?(Be=X.x,pt=X.y,Lt=X.z):(Be=0,pt=0,Lt=0);let yt=D.convert(z.format),wt=D.convert(z.type),We;z.isData3DTexture?(qe.setTexture3D(z,0),We=O.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(qe.setTexture2DArray(z,0),We=O.TEXTURE_2D_ARRAY):(qe.setTexture2D(z,0),We=O.TEXTURE_2D),de.activeTexture(O.TEXTURE0),de.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,z.flipY),de.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),de.pixelStorei(O.UNPACK_ALIGNMENT,z.unpackAlignment);let ti=de.getParameter(O.UNPACK_ROW_LENGTH),Ir=de.getParameter(O.UNPACK_IMAGE_HEIGHT),Pr=de.getParameter(O.UNPACK_SKIP_PIXELS),Zt=de.getParameter(O.UNPACK_SKIP_ROWS),Yn=de.getParameter(O.UNPACK_SKIP_IMAGES);de.pixelStorei(O.UNPACK_ROW_LENGTH,gt.width),de.pixelStorei(O.UNPACK_IMAGE_HEIGHT,gt.height),de.pixelStorei(O.UNPACK_SKIP_PIXELS,je),de.pixelStorei(O.UNPACK_SKIP_ROWS,st),de.pixelStorei(O.UNPACK_SKIP_IMAGES,ct);let pr=T.isDataArrayTexture||T.isData3DTexture,Lr=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){let ut=ze.get(T),Wt=ze.get(z),Ai=ze.get(ut.__renderTarget),St=ze.get(Wt.__renderTarget);de.bindFramebuffer(O.READ_FRAMEBUFFER,Ai.__webglFramebuffer),de.bindFramebuffer(O.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let ii=0;ii<Ne;ii++)pr&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ze.get(T).__webglTexture,V,ct+ii),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ze.get(z).__webglTexture,ve,Lt+ii)),O.blitFramebuffer(je,st,je+be,st+Me,Be,pt,Be+be,pt+Me,O.DEPTH_BUFFER_BIT,O.NEAREST);de.bindFramebuffer(O.READ_FRAMEBUFFER,null),de.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(V!==0||T.isRenderTargetTexture||ze.has(T)){let ut=ze.get(T),Wt=ze.get(z);de.bindFramebuffer(O.READ_FRAMEBUFFER,q),de.bindFramebuffer(O.DRAW_FRAMEBUFFER,P);for(let Ai=0;Ai<Ne;Ai++)pr?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ut.__webglTexture,V,ct+Ai):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ut.__webglTexture,V),Lr?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Wt.__webglTexture,ve,Lt+Ai):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Wt.__webglTexture,ve),V!==0?O.blitFramebuffer(je,st,je+be,st+Me,Be,pt,Be+be,pt+Me,O.COLOR_BUFFER_BIT,O.NEAREST):Lr?O.copyTexSubImage3D(We,ve,Be,pt,Lt+Ai,je,st,be,Me):O.copyTexSubImage2D(We,ve,Be,pt,je,st,be,Me);de.bindFramebuffer(O.READ_FRAMEBUFFER,null),de.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Lr?T.isDataTexture||T.isData3DTexture?O.texSubImage3D(We,ve,Be,pt,Lt,be,Me,Ne,yt,wt,gt.data):z.isCompressedArrayTexture?O.compressedTexSubImage3D(We,ve,Be,pt,Lt,be,Me,Ne,yt,gt.data):O.texSubImage3D(We,ve,Be,pt,Lt,be,Me,Ne,yt,wt,gt):T.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,ve,Be,pt,be,Me,yt,wt,gt.data):T.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,ve,Be,pt,gt.width,gt.height,yt,gt.data):O.texSubImage2D(O.TEXTURE_2D,ve,Be,pt,be,Me,yt,wt,gt);de.pixelStorei(O.UNPACK_ROW_LENGTH,ti),de.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ir),de.pixelStorei(O.UNPACK_SKIP_PIXELS,Pr),de.pixelStorei(O.UNPACK_SKIP_ROWS,Zt),de.pixelStorei(O.UNPACK_SKIP_IMAGES,Yn),ve===0&&z.generateMipmaps===!0&&z.mipmapsAutoUpdate===!0&&O.generateMipmap(We),de.unbindTexture()},this.initRenderTarget=function(T){ze.get(T).__webglFramebuffer===void 0&&qe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?qe.setTextureCube(T,0):T.isData3DTexture?qe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?qe.setTexture2DArray(T,0):qe.setTexture2D(T,0),de.unbindTexture()},this.resetState=function(){B=0,Y=0,H=null,de.reset(),U.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}};function Qf(){let t=new URLSearchParams(location.search).get("tier"),r=(navigator.maxTouchPoints||0)>1||/iPhone|iPad|Android/i.test(navigator.userAgent),a=t==="high"||t==="mobile"||t==="low"?t:r?"mobile":"high";return{tier:a,mobile:r,forced:!!t,settings:dc(a,r)}}function dc(e,t){let i=window.devicePixelRatio||1;return e==="low"?{tier:e,pixelRatio:t?.75:Math.min(i,1),maxPixels:2e6,particleScale:.5}:e==="mobile"?{tier:e,pixelRatio:1,maxPixels:32e5,particleScale:1}:{tier:e,pixelRatio:Math.min(i,2),maxPixels:42e5,particleScale:1}}var em={ice:"shaved_ice-1024.jpg",enamel:"machine_enamel-512.jpg",wood:"wood_counter-512.jpg",shop:"kakigori_shop-512.jpg"};function gM(e){let t=em[e],i=window.KAKI_TEX&&window.KAKI_TEX[t];return location.protocol==="file:"&&i?i:"assets/"+t}function tm(e,t){let i=new nc,r=Math.min(4,e.capabilities.getMaxAnisotropy()),a={},n=Object.keys(em).map(s=>new Promise(o=>{let l=i.load(gM(s),()=>o(l),void 0,h=>{t&&t("texture "+s),o(l)});l.colorSpace=Ut,l.wrapS=l.wrapT=Mr,l.anisotropy=s==="shop"?1:r,l.name=s,a[s]=l}));return{textures:a,ready:Promise.all(n)}}function hl(e,t,i){let r=document.createElement("canvas");r.width=e,r.height=t,i(r.getContext("2d"),e,t);let a=new Gh(r);return a.colorSpace=Ut,a}function im(){let e=hl(64,64,(a,n)=>{let s=a.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);s.addColorStop(0,"rgba(60,40,20,0.55)"),s.addColorStop(.55,"rgba(60,40,20,0.25)"),s.addColorStop(1,"rgba(60,40,20,0)"),a.fillStyle=s,a.fillRect(0,0,n,n)}),t=hl(64,64,(a,n)=>{let s=a.createRadialGradient(n/2,n/2,n*.18,n/2,n/2,n/2);s.addColorStop(0,"rgba(255,255,255,0)"),s.addColorStop(.55,"rgba(255,250,200,0.9)"),s.addColorStop(1,"rgba(255,240,160,0)"),a.fillStyle=s,a.fillRect(0,0,n,n)}),i=hl(64,64,(a,n)=>{a.fillStyle="#ff5c8a",a.beginPath(),a.moveTo(32,54),a.bezierCurveTo(4,36,6,10,22,10),a.bezierCurveTo(28,10,32,16,32,20),a.bezierCurveTo(32,16,36,10,42,10),a.bezierCurveTo(58,10,60,36,32,54),a.fill(),a.fillStyle="rgba(255,255,255,0.7)",a.beginPath(),a.ellipse(22,22,5,3.5,-.6,0,Math.PI*2),a.fill()}),r=hl(256,64,(a,n,s)=>{a.fillStyle="#2f6fb3",a.fillRect(0,0,n,s),a.strokeStyle="rgba(255,255,255,0.85)",a.lineWidth=3;for(let o=10;o<s+10;o+=14){a.beginPath();for(let l=0;l<=n;l+=4)a.lineTo(l,o+Math.sin(l/10)*4);a.stroke()}a.fillStyle="rgba(0,0,0,0.25)";for(let o=0;o<n;o+=64)a.fillRect(o,0,2,s)});for(let a of[e,t,i])a.wrapS=a.wrapT=Gt;return r.wrapS=Mr,{blob:e,glow:t,heart:i,noren:r}}var rm=new Ye,am=new Ct,nm=new Oi,vM=new R,_M=new R;function Yt(e){let t=[],i=[],r=[],a=new Ae;for(let s of e){let o=s.geo.index?s.geo.toNonIndexed():s.geo,l=s.scale==null?[1,1,1]:typeof s.scale=="number"?[s.scale,s.scale,s.scale]:s.scale;nm.set(...s.rot||[0,0,0]),am.setFromEuler(nm),rm.compose(_M.set(...s.pos||[0,0,0]),am,vM.set(...l)),o.applyMatrix4(rm),a.set(s.color);let h=o.attributes.position.array,c=o.attributes.normal.array;for(let u=0;u<h.length;u++)t.push(h[u]),i.push(c[u]);for(let u=0;u<h.length/3;u++)r.push(a.r,a.g,a.b);o!==s.geo&&o.dispose(),s.geo.dispose()}let n=new et;return n.setAttribute("position",new De(t,3)),n.setAttribute("normal",new De(i,3)),n.setAttribute("color",new De(r,3)),n.computeBoundingSphere(),n}var qi=(e,t,i)=>e<t?t:e>i?i:e;var ja=e=>e<=0?0:e>=1?1:e*e*(3-2*e),pc=e=>{e=qi(e,0,1);let t=1.70158;return 1+(t+1)*(e-1)**3+t*(e-1)**2},Rr=e=>e<=0||e>=1?0:Math.sin(Math.PI*e)*(1-.3*e),Ti=(e,t)=>1-Math.exp(-e*t);function sm(e){let t=0;return e.traverseVisible(i=>{if(!i.isMesh||!i.geometry)return;let r=i.geometry,n=(r.index?r.index.count:r.attributes.position?r.attributes.position.count:0)/3;r.drawRange&&r.drawRange.count!==1/0&&(n=Math.min(n,r.drawRange.count/3)),t+=n*(i.isInstancedMesh?i.count:1)}),Math.round(t)}function om(e){e.traverse(t=>{if(t.userData&&t.userData.shared)return;t.geometry&&!t.geometry.userData.shared&&t.geometry.dispose();let i=Array.isArray(t.material)?t.material:t.material?[t.material]:[];for(let r of i)r.userData.shared||r.dispose()})}var Ue={spout:new R(0,.4,-.02),bowlHome:new R(0,0,0),bowlEnter:new R(-.95,0,.06),work:{x0:-.12,x1:.1,z0:-.12,z1:.11},column:new R(.24,0,-.28),give:new R(-.38,0,-.215),giveRadius:.13,customerFront:new R(-.38,.03,-.5),queue:[new R(-.7,.03,-.72),new R(-1,.03,-.9)],exit:new R(-1.5,.03,-.48),bottleStart:new R(.255,0,-.06),bottleDir:new R(1,0,0),bottleGap:.058,tray:new R(-.33,0,.12),shelfX:.5,shelfZ:-.7,shelfScale:.5,shelfSlots:[[.38,.2475,-.7],[.5,.2475,-.7],[.62,.2475,-.7],[.38,.0075,-.7],[.5,.0075,-.7],[.62,.0075,-.7]].map(e=>new R(...e)),counter:{x0:-.9,x1:.9,z0:-.35,z1:.35}},fc=[{id:"red",color:[.93,.13,.22],hex:15212602,kind:"syrup"},{id:"green",color:[.3,.8,.25],hex:5098560,kind:"syrup"},{id:"blue",color:[.15,.52,.96],hex:2524661,kind:"syrup"},{id:"yellow",color:[1,.84,.1],hex:16766490,kind:"syrup"},{id:"milk",color:[.99,.97,.9],hex:16775398,kind:"milk"}];function lm(e,t,i){let r={pick:[],disposables:[]},a=O=>(r.disposables.push(O),O),n=new tl(16774376,1322e4,1.35),s=new nl(16777215,1.7);s.position.set(.5,1.2,.7),e.add(n,s),e.background=new Ae(15984338);let o=a(new oi({map:t.shop,color:15921906}));o.map=t.shop.clone(),a(o.map),o.map.wrapS=o.map.wrapT=Gt,o.map.needsUpdate=!0;let l=new Xe(a(new zi(3.6,3.6)),o);l.position.set(.05,.55,-1.7),e.add(l);let h=t.wood.clone();a(h),h.repeat.set(3,2),h.needsUpdate=!0;let c=new Xe(a(new zi(3.6,1.6)),a(new Va({map:h,color:12098170})));c.rotation.x=-Math.PI/2,c.position.set(0,-.42,-1),e.add(c);let u=t.wood.clone();a(u),u.repeat.set(2.2,1),u.needsUpdate=!0;let d=a(new qt({map:u,roughness:.75})),p=new Xe(a(new zt(1.9,.04,.74)),d);p.position.set(0,-.02,0),e.add(p);let g=new Xe(a(new zt(1.9,.5,.03)),a(new Va({color:10119748})));g.position.set(0,-.29,-.355),e.add(g);let v=new Xe(a(new zi(2.4,.22,1,1)),a(new Va({map:i.noren,side:Si})));i.noren.repeat.set(4,1),v.position.set(0,.86,-.95),e.add(v);let f=t.enamel.clone();a(f),f.repeat.set(1,1),f.needsUpdate=!0;let m=a(new qt({map:f,color:16777215,roughness:.38,vertexColors:!0})),x=a(new qt({color:14212579,roughness:.3,metalness:.35,vertexColors:!0})),S=new Vt;S.name="machine",e.add(S);let _=Ue.spout,E=Ue.column,A=_.x-E.x,y=_.z-E.z,M=Math.hypot(A,y),w=Yt([{geo:new Nt(.07,.08,.035,28),color:16777215,pos:[E.x,.0175,E.z]},{geo:new Nt(.026,.032,.52,18),color:16777215,pos:[E.x,.29,E.z]},{geo:new hi(.036,16,10),color:16777215,pos:[E.x,.55,E.z]},{geo:new zt(.05,.04,M),color:16777215,pos:[E.x+A/2,.545,E.z+y/2],rot:[0,Math.atan2(A,y),0]},{geo:new Nt(.09,.08,.075,32),color:16777215,pos:[_.x,_.y+.075,_.z]},{geo:new Nt(.095,.095,.012,32),color:16777215,pos:[_.x,_.y+.116,_.z]}]);S.add(new Xe(a(w),m));let L=Yt([{geo:new Nt(.06,.016,.04,24,1,!0),color:16777215,pos:[_.x,_.y+.02,_.z]},{geo:new Nt(.008,.008,.12,10),color:16777215,pos:[_.x,_.y+.215,_.z]},{geo:new Nt(.05,.05,.01,24),color:16777215,pos:[_.x,_.y+.21,_.z]},{geo:new hi(.016,12,8),color:15218767,pos:[_.x,_.y+.285,_.z]},{geo:new zt(.07,.018,.02),color:16777215,pos:[_.x-.115,_.y+.075,_.z-.03]}]);S.add(new Xe(a(L),x));let N=a(new qt({map:t.ice,color:14676991,roughness:.25,emissive:10473710,emissiveIntensity:.25})),k=new Xe(a(new zt(.1,.07,.1)),N);k.position.set(_.x,_.y+.155,_.z),S.add(k);let q=new Vt;q.name="wheel",q.position.set(_.x-.155,_.y+.075,_.z-.03);let P=[];for(let O=0;O<5;O++){let ht=O/5*Math.PI*2;P.push({geo:new Nt(.006,.006,.07,6),color:16777215,pos:[Math.cos(ht)*.035,Math.sin(ht)*.035,0],rot:[0,0,ht-Math.PI/2]})}let B=Yt([{geo:new Tr(.072,.009,8,40),color:16777215},{geo:new Nt(.016,.016,.03,16),color:16777215,rot:[Math.PI/2,0,0]},...P]);q.add(new Xe(a(B),m));let Y=new Xe(a(Yt([{geo:new Nt(.006,.006,.03,8),color:14212579,rot:[Math.PI/2,0,0],pos:[0,0,.015]},{geo:new hi(.016,14,10),color:15218767,pos:[0,0,.035],scale:[1,1,1.25]}])),x);Y.position.set(-.072,0,0),q.add(Y),S.add(q);let H=new Xe(a(new hi(.11,8,6)),a(new oi({visible:!1})));H.userData.kind="wheel",q.add(H),r.pick.push(H);let he=new Xe(a(new zt(.2,.16,.2)),H.material);he.position.set(_.x,_.y+.12,_.z),he.userData.kind="wheel",S.add(he),r.pick.push(he),r.machine=S,r.wheel=q,r.iceBlock=k,r.enamelMat=m;let J=[[0,-.14],[.021,-.14],[.026,-.132],[.026,-.06],[.022,-.042],[.009,-.03],[.009,-.014],[.005,-.004],[.003,0]].map(([O,ht])=>new ie(O,ht)),Z=a(new Xn(J,20)),re=a(new Nt(.0095,.0095,.012,14));re.translate(0,-.02,0);let Ie=a(new qt({color:16777215,roughness:.4})),ee=a(new Nt(.03,.02,.12,18));ee.translate(0,-.075,0),ee.scale(1.15,1,.65),r.bottles=fc.map((O,ht)=>{let Ve=new Vt;Ve.name="bottle-"+O.id;let dt=a(new qt({color:O.hex,roughness:.18,emissive:O.hex,emissiveIntensity:.12}));if(O.kind==="milk"){Ve.add(new Xe(ee,dt));let ze=a(new Nt(.012,.014,.016,14));ze.translate(0,-.012,0),Ve.add(new Xe(ze,a(new qt({color:3832800,roughness:.4}))))}else Ve.add(new Xe(Z,dt)),Ve.add(new Xe(re,Ie));let de=new Xe(a(new Nt(.04,.04,.19,8)),H.material);de.position.y=-.08,de.userData.kind="bottle",de.userData.index=ht,Ve.add(de),r.pick.push(de);let nt=Ue.bottleStart.clone().addScaledVector(Ue.bottleDir,Ue.bottleGap*ht);return nt.y=.155,Ve.position.copy(nt),e.add(Ve),{syrup:O,group:Ve,mat:dt,home:nt,state:"home",t:0,tilt:0,rate:0,target:new R,pointer:null,hopT:9}});let ne=Ue.bottleGap*(fc.length-1)+.085,we=new Xe(a(new zt(ne,.015,.075)),a(new qt({map:u,color:14267276,roughness:.7})));we.position.copy(Ue.bottleStart).addScaledVector(Ue.bottleDir,Ue.bottleGap*(fc.length-1)/2),we.position.y=.0075,we.rotation.y=Math.atan2(-Ue.bottleDir.z,Ue.bottleDir.x),e.add(we);let Pe=a(new qt({vertexColors:!0,roughness:.35}));Pe.userData.shared=!0;let Oe={cherry:Yt([{geo:new hi(.012,14,10),color:14159916,pos:[0,.011,0]},{geo:new Nt(.0013,.0013,.028,5),color:6060580,pos:[.004,.032,0],rot:[0,0,-.35]}]),shiratama:Yt([{geo:new hi(.0115,14,10),color:16776696,pos:[0,.009,0],scale:[1,.78,1]}]),mikan:Yt([{geo:new hi(.0125,14,10),color:16753183,pos:[0,.008,0],scale:[1,.72,1]},{geo:new Nt(.003,.003,.003,6),color:6986282,pos:[0,.0172,0]}])};for(let O in Oe)Oe[O].userData.shared=!0,a(Oe[O]);r.toppingGeos=Oe,r.toppingMat=Pe,r.toppingKinds=["cherry","shiratama","mikan"];let fe=[[0,0],[.07,0],[.085,.012],[.088,.016],[.08,.012],[0,.006]].map(([O,ht])=>new ie(O,ht)),Ge=new Xe(a(new Xn(fe,32)),a(new qt({color:16774112,roughness:.4})));Ge.position.copy(Ue.tray),e.add(Ge),r.piles=r.toppingKinds.map((O,ht)=>{let Ve=-Math.PI/2+ht/3*Math.PI*2+.4,dt=new R(Ue.tray.x+Math.cos(Ve)*.042,.008,Ue.tray.z+Math.sin(Ve)*.042),de=new Vt;de.position.copy(dt),e.add(de);for(let ze=0;ze<3;ze++){let qe=new Xe(Oe[O],Pe),xt=ze/3*Math.PI*2;qe.position.set(Math.cos(xt)*.012,ze===2?.006:0,Math.sin(xt)*.012),qe.rotation.y=xt,de.add(qe)}let nt=new Xe(a(new hi(.04,8,6)),H.material);return nt.userData.kind="pile",nt.userData.index=ht,de.add(nt),r.pick.push(nt),{kind:O,group:de,hopT:9}});let tt=a(new qt({map:u,color:15784120,roughness:.8,vertexColors:!0})),Le=Ue.shelfX,lt=Ue.shelfZ,oe=.385,ge=Yt([{geo:new zt(oe,.015,.15),color:16777215,pos:[Le,0,lt]},{geo:new zt(oe,.015,.15),color:16777215,pos:[Le,.24,lt]},{geo:new zt(oe,.015,.15),color:16777215,pos:[Le,.48,lt]},{geo:new zt(.015,.9,.15),color:16777215,pos:[Le-oe/2,0,lt]},{geo:new zt(.015,.9,.15),color:16777215,pos:[Le+oe/2,0,lt]},{geo:new zt(oe,.9,.01),color:14205088,pos:[Le,0,lt-.075]}]),ue=new Xe(a(ge),tt);e.add(ue);let Ce=a(new oi({map:i.blob,transparent:!0,depthWrite:!1})),Re=a(new zi(1,1));Re.rotateX(-Math.PI/2);let Fe=new ia(Re,Ce,24);Fe.count=0,Fe.frustumCulled=!1,Fe.renderOrder=1,e.add(Fe),r.blobs=Fe;let He=a(new oi({map:i.glow,transparent:!0,depthWrite:!1,blending:Mn,opacity:0})),Je=a(new zi(1,1));Je.rotateX(-Math.PI/2),r.glow=new Xe(Je,He),r.glow.renderOrder=2,r.glow.position.y=.003,e.add(r.glow),r.giveGlow=new Xe(Je,a(He.clone())),r.giveGlow.renderOrder=2,r.giveGlow.visible=!1,r.giveGlow.position.set(Ue.give.x,.003,Ue.give.z),e.add(r.giveGlow);let it=a(new oi({map:i.heart,transparent:!0,depthWrite:!1})),at=new ia(a(new zi(.05,.05)),it,16);return at.count=0,at.frustumCulled=!1,at.renderOrder=3,e.add(at),r.hearts=at,r}function hm(){let e=null,t=null,i=null,r=null,a={},n=!1;function s(p,g){let v=Math.floor(e.sampleRate*p),f=e.createBuffer(1,v,e.sampleRate),m=f.getChannelData(0);return g(m,e.sampleRate),f}function o(){if(e){e.state==="suspended"&&e.resume();return}let p=window.AudioContext||window.webkitAudioContext;if(!p)return;e=new p;let g=e.createDynamicsCompressor();g.threshold.value=-18,g.ratio.value=4,t=e.createGain(),t.gain.value=.7,t.connect(g),g.connect(e.destination),i=s(1.5,v=>{for(let f=0;f<v.length;f++)v[f]=Math.random()*2-1}),r=s(2,(v,f)=>{for(let x=0;x<v.length;x++)v[x]=0;let m=2*900;for(let x=0;x<m;x++){let S=Math.floor(Math.random()*(v.length-400)),_=.2+Math.random()*.8,E=30+Math.random()*120;for(let A=0;A<300;A++)v[S+A]+=(Math.random()*2-1)*_*Math.exp(-A/E)}}),a.shari=l(r,"bandpass",5200,.9),a.slide=l(i,"lowpass",2400,.7),a.flow=l(i,"lowpass",520,2.5,!0),n=!0}function l(p,g,v,f,m){let x=e.createBufferSource();x.buffer=p,x.loop=!0;let S=e.createBiquadFilter();S.type=g,S.frequency.value=v,S.Q.value=f;let _=e.createGain();if(_.gain.value=0,x.connect(S),S.connect(_),_.connect(t),x.start(),m){let E=e.createOscillator();E.frequency.value=3.2;let A=e.createGain();A.gain.value=260,E.connect(A),A.connect(S.frequency),E.start()}return{g:_,f:S}}function h(p,g,v){if(!n)return;let f=e.currentTime;a.shari.g.gain.setTargetAtTime(Math.min(1,p)*.32,f,.06),a.slide.g.gain.setTargetAtTime(Math.min(1,g)*.16,f,.08),a.flow.g.gain.setTargetAtTime(Math.min(1,v)*.3,f,.1)}function c(p,g,{type:v="sine",vol:f=.3,slide:m=0,at:x=0,attack:S=.005}={}){if(!n)return;let _=e.currentTime+x,E=e.createOscillator();E.type=v,E.frequency.setValueAtTime(p,_),m&&E.frequency.exponentialRampToValueAtTime(Math.max(30,p*m),_+g);let A=e.createGain();A.gain.setValueAtTime(1e-4,_),A.gain.exponentialRampToValueAtTime(f,_+S),A.gain.exponentialRampToValueAtTime(1e-4,_+g),E.connect(A),A.connect(t),E.start(_),E.stop(_+g+.05)}function u(p,g,{q:v=1,vol:f=.3,at:m=0,type:x="bandpass"}={}){if(!n)return;let S=e.currentTime+m,_=e.createBufferSource();_.buffer=i;let E=e.createBiquadFilter();E.type=x,E.frequency.value=g,E.Q.value=v;let A=e.createGain();A.gain.setValueAtTime(f,S),A.gain.exponentialRampToValueAtTime(1e-4,S+p),_.connect(E),E.connect(A),A.connect(t),_.start(S,Math.random()),_.stop(S+p+.02)}return{init:o,setLevels:h,sfx:{pop:(p=1)=>c(520*p,.12,{type:"triangle",vol:.25,slide:1.8}),boing:(p=1)=>{c(300*p,.25,{type:"sine",vol:.22,slide:2.2})},click:()=>u(.03,3200,{q:2,vol:.18}),plop:(p=1)=>c(420*p,.16,{type:"sine",vol:.28,slide:.45}),drip:()=>c(900+Math.random()*300,.09,{type:"sine",vol:.15,slide:.6}),spill:()=>u(.35,3e3,{q:.6,vol:.12}),slide:()=>u(.4,1800,{q:.5,vol:.1,type:"lowpass"}),whoosh:()=>u(.4,900,{q:.7,vol:.12}),munch:()=>{u(.09,1400,{q:1.5,vol:.4}),u(.09,1100,{q:1.5,vol:.35,at:.16})},chime:()=>{[784,988,1175,1568].forEach((p,g)=>c(p,.5,{vol:.16,at:g*.09}))},happy:(p=600)=>{c(p,.22,{type:"triangle",vol:.26,slide:1.6}),c(p*1.5,.3,{type:"triangle",vol:.22,slide:1.3,at:.2}),c(p*2,.25,{type:"sine",vol:.1,at:.42,slide:.8})},hello:(p=600)=>c(p*1.2,.18,{type:"triangle",vol:.16,slide:1.4}),sparkle:()=>{for(let p=0;p<4;p++)c(1800+Math.random()*1600,.12,{vol:.06,at:p*.05})}},get enabled(){return n},suspend:()=>e&&e.suspend(),resume:()=>e&&e.resume()}}function cm(e){let t=[],i=p=>{t.push(String(p).slice(0,160)),t.length>20&&t.shift()};window.addEventListener("error",p=>i(p.message||p)),window.addEventListener("unhandledrejection",p=>i("promise: "+(p.reason&&p.reason.message||p.reason)));let r=[],a=p=>{r.push(String(p)),r.length>5&&r.shift()},n=new Float32Array(180),s=0,o=0,l=0,h=null,c={};e&&(h=document.createElement("div"),h.style.cssText="position:fixed;left:6px;top:6px;z-index:10;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.55);padding:5px 7px;border-radius:6px;pointer-events:none;white-space:pre;max-width:60vw;overflow:hidden",document.body.appendChild(h));function u(p,g){let v=new Map,f=new Set;g.traverse(E=>{E.geometry&&f.add(E.geometry);let A=Array.isArray(E.material)?E.material:E.material?[E.material]:[];for(let y of A)for(let M in y){let w=y[M];if(w&&w.isTexture&&w.source){let L=w.image||{},N=L.width||0,k=L.height||0,q=w.isDataTexture&&w.type!==1009?16:4,P=w.generateMipmaps!==!1&&w.minFilter!==1006&&w.minFilter!==1003?4/3:1;v.set(w.source.uuid+":"+w.wrapS+w.wrapT,N*k*q*P)}}});let m=0;for(let E of v.values())m+=E;let x=0;for(let E of f){for(let A in E.attributes)x+=E.attributes[A].array.byteLength;E.index&&(x+=E.index.array.byteLength)}g.traverse(E=>{E.isInstancedMesh&&(x+=E.instanceMatrix.array.byteLength)});let S=p.domElement,_=S.width*S.height*12;return{textures:v.size,texMiB:m/1048576,geoMiB:x/1048576,fbMiB:_/1048576,totalMiB:(m+x+_)/1048576}}function d(p,g,v,f){if(!e||(n[s]=p,s=(s+1)%n.length,o=Math.min(n.length,o+1),l+=p,l<.5))return;l=0;let m=f(),x=Array.from(n.slice(0,o)).sort((M,w)=>M-w),S=x.reduce((M,w)=>M+w,0)/Math.max(1,x.length),_=x[Math.floor(x.length*.95)]||0,E=g.info.render,A=u(g,v),y=m.heroObjs?m.heroObjs.reduce((M,w)=>M+sm(w),0):0;c={tier:m.tier,canvas:g.domElement.width+"\xD7"+g.domElement.height,pr:g.getPixelRatio(),fps:S>0?1/S:0,p95ms:_*1e3,calls:E.calls,tris:E.triangles,heroTris:y,textures:A.textures,glTextures:g.info.memory.textures,geometries:g.info.memory.geometries,gpuMiB:A.totalMiB,texMiB:A.texMiB,geoMiB:A.geoMiB,fbMiB:A.fbMiB,errors:t.length,scene:m.scene||"",readyMs:m.readyMs||0,touch:navigator.maxTouchPoints||0},h&&(h.textContent=`tier ${c.tier} (touch ${c.touch})  canvas ${c.canvas} @${c.pr.toFixed(2)}
ready ${Math.round(c.readyMs)}ms
fps ${c.fps.toFixed(1)}  p95 ${c.p95ms.toFixed(1)}ms
calls ${c.calls}  tris ${c.tris} (hero ${y})
tex ${c.textures} (gl ${c.glTextures})  geo ${c.geometries}
GPU\u2248${c.gpuMiB.toFixed(1)}MiB (tex ${c.texMiB.toFixed(1)} geo ${c.geoMiB.toFixed(1)} fb ${c.fbMiB.toFixed(1)})
${c.scene}
`+(t.length?"ERR "+t.slice(-3).join(`
    `):"errors 0")+(r.length?`
`+r.slice(-2).join(`
`):""))}return{frame:d,pushErr:i,note:a,notes:r,errors:t,get stats(){return c}}}var ul=["usagi","kuma","neko","pengin"],um={usagi:[{fur:16777215,belly:16773364,ear:16758472},{fur:15983311,belly:16775406,ear:16756928}],kuma:[{fur:11893320,belly:15782308,ear:9067059},{fur:15253642,belly:16773334,ear:13081186}],neko:[{fur:16164172,belly:16773600,ear:16758472},{fur:12172486,belly:16185082,ear:16758472}],pengin:[{fur:3424346,belly:16777215,ear:16754224},{fur:5930920,belly:16777215,ear:16757575}]},qa={usagi:900,kuma:360,neko:700,pengin:540},cl=null;function sa(){return cl||(cl=new qt({vertexColors:!0,roughness:.75}),cl.userData.shared=!0),cl}var It=(e,t=16,i=12)=>new hi(e,t,i);function dm(e,t=0){let i=um[e][t%um[e].length],r=2761264,a=16752564,n=16777215,s=new Vt;s.name="animal-"+e;let o=new Vt;s.add(o);let l=[{geo:It(.1,18,14),color:i.fur,pos:[0,-.06,0],scale:[1,1.12,.9]},{geo:It(.07,18,14),color:i.belly,pos:[0,-.07,.058],scale:[.95,1.05,.5]}];e==="usagi"&&l.push({geo:It(.03,10,8),color:n,pos:[0,-.12,-.09]}),e==="kuma"&&l.push({geo:It(.022,10,8),color:i.fur,pos:[0,-.13,-.09]});let h=new Xe(Yt(l),sa());o.add(h);let c=new Vt;c.position.set(0,.1,.01),o.add(c);let u=[],d=e==="pengin"?.078:.082;if(u.push({geo:It(d,22,16),color:i.fur,scale:e==="usagi"?[1,.95,.95]:[1.08,.96,.96]}),e==="usagi"){for(let B of[-1,1])u.push({geo:It(.026,12,10),color:i.fur,pos:[B*.032,.11,-.005],scale:[1,2.6,.7],rot:[0,0,-B*.18]}),u.push({geo:It(.015,10,8),color:i.ear,pos:[B*.034,.112,.012],scale:[1,2.6,.4],rot:[0,0,-B*.18]});u.push({geo:It(.022,12,10),color:n,pos:[0,-.025,.066],scale:[1.4,.9,.8]})}else if(e==="kuma"){for(let B of[-1,1])u.push({geo:It(.03,12,10),color:i.fur,pos:[B*.062,.058,-.01],scale:[1,1,.6]}),u.push({geo:It(.017,10,8),color:i.ear,pos:[B*.062,.058,.004],scale:[1,1,.4]});u.push({geo:It(.036,14,10),color:i.belly,pos:[0,-.026,.06],scale:[1.25,.85,.75]})}else if(e==="neko"){for(let B of[-1,1])u.push({geo:new ra(.03,.05,4),color:i.fur,pos:[B*.05,.075,0],rot:[0,Math.PI/4,-B*.35]}),u.push({geo:new ra(.017,.03,4),color:i.ear,pos:[B*.05,.072,.012],rot:[0,Math.PI/4,-B*.35]});u.push({geo:It(.026,12,10),color:i.belly,pos:[0,-.028,.066],scale:[1.5,.85,.75]})}else e==="pengin"&&(u.push({geo:It(.066,18,14),color:i.belly,pos:[0,-.004,.026],scale:[1.02,.86,.82]}),u.push({geo:new ra(.014,.026,10),color:i.ear,pos:[0,-.02,.088],rot:[Math.PI/2,0,0],scale:[1.3,1,.7]}));e!=="pengin"&&u.push({geo:It(.009,10,8),color:e==="kuma"?r:16748456,pos:[0,-.012,e==="kuma"?.088:.082],scale:[1.3,1,1]});for(let B of[-1,1])u.push({geo:It(.014,10,8),color:a,pos:[B*.05,-.022,.06],scale:[1.2,.8,.4],rot:[0,B*.6,0]});c.add(new Xe(Yt(u),sa()));let p=e==="pengin"?.086:.078,g=.014,v=.03,f=new Xe(Yt([{geo:It(.011,12,10),color:r,pos:[-v,g,p],scale:[1,1.15,.6]},{geo:It(.011,12,10),color:r,pos:[v,g,p],scale:[1,1.15,.6]},{geo:It(.0035,6,5),color:n,pos:[-v+.004,g+.005,p+.007]},{geo:It(.0035,6,5),color:n,pos:[v+.004,g+.005,p+.007]}]),sa());c.add(f);let m=new Xe(Yt([{geo:new Tr(.011,.0032,5,12,Math.PI),color:r,pos:[-v,g-.004,p+.002]},{geo:new Tr(.011,.0032,5,12,Math.PI),color:r,pos:[v,g-.004,p+.002]}]),sa());m.visible=!1,c.add(m);let x=e==="kuma"?.093:e==="pengin"?.084:.083,S=e==="pengin"?-.042:-.034,_=new Xe(Yt([{geo:new Tr(.009,.0022,5,10,Math.PI),color:r,pos:[0,S+.006,x],rot:[0,0,Math.PI]}]),sa());c.add(_);let E=new Xe(Yt([{geo:It(.012,12,8),color:10234684,pos:[0,S,x-.002],scale:[1.1,.9,.5]},{geo:It(.007,8,6),color:16744341,pos:[0,S-.004,x+.002],scale:[1.2,.6,.5]}]),sa());E.visible=!1,c.add(E);let A=()=>Yt([{geo:new Ko(.022,.05,4,10),color:i.fur,pos:[0,-.04,0]}]),y=[-1,1].map(B=>{let Y=new Vt;return Y.position.set(B*.085,-.01,.03),Y.add(new Xe(A(),sa())),o.add(Y),Y}),M=new Xe(new hi(.17,8,6),new oi({visible:!1}));M.position.y=.04,M.userData.kind="customer",s.add(M);let w={mode:"wait",modeT:0,blinkT:1+Math.random()*2,hopT:9,yaw:0,leanAmt:0,eat:0,happy:0,walkFrom:new R,walkTo:new R,walkDur:1,walkT:1,eager:0,wave:0,phase:Math.random()*6};function L(B){w.mode=B,w.modeT=0}function N(B,Y){w.walkFrom.copy(s.position),w.walkTo.copy(B),w.walkDur=Y,w.walkT=0}function k(){w.hopT=0}function q(B,Y){if(w.modeT+=B,w.phase+=B,w.walkT<w.walkDur){w.walkT=Math.min(w.walkDur,w.walkT+B);let Pe=w.walkT/w.walkDur,Oe=Pe*Pe*(3-2*Pe);s.position.lerpVectors(w.walkFrom,w.walkTo,Oe),s.position.y=w.walkFrom.y+(w.walkTo.y-w.walkFrom.y)*Oe+Math.abs(Math.sin(Pe*Math.PI*5))*.02}w.blinkT-=B;let H=1;w.blinkT<0&&(H=.12,w.blinkT<-.12&&(w.blinkT=2+Math.random()*3)),f.scale.set(1,H,1);let he=qi((Y.lookX-s.position.x)*1.6,-.5,.5);w.yaw+=(he-w.yaw)*Ti(4,B),w.eager+=((Y.eager||0)-w.eager)*Ti(5,B);let J=w.mode==="eat",Z=w.mode==="happy";w.eat+=((J?1:0)-w.eat)*Ti(8,B),w.happy+=((Z?1:0)-w.happy)*Ti(6,B);let re=w.eager*.22+w.eat*.45;o.rotation.x=re,c.rotation.set(-.14+w.eat*.5+Math.sin(w.phase*1.3)*.03,w.yaw*(1-w.eat),Math.sin(w.phase*.9)*.05),w.hopT+=B;let Ie=Math.sin(w.phase*2.2)*.003;w.hopT<.45&&(Ie+=Rr(w.hopT/.45)*.05),Z&&(Ie+=Math.abs(Math.sin(w.modeT*7))*.045*Math.max(0,1-w.modeT/2.2)),o.position.y=Ie;let ee=Z||J;m.visible=Z,f.visible=!Z,E.visible=ee&&(Z||Math.sin(w.modeT*18)>0),_.visible=!E.visible;let ne=Math.max(w.eager,w.eat),we=w.mode==="wave"||w.mode==="leave"?1:0;w.wave+=(we-w.wave)*Ti(6,B),y[0].rotation.set(-.9-ne*.6-w.happy*1.2+Math.sin(w.modeT*14)*w.happy*.3,0,-.2-w.happy*.5),y[1].rotation.set(-.9-ne*.6-w.happy*1.2-w.wave*1.6+Math.sin(w.modeT*14)*w.happy*.3,0,.2+w.happy*.5+w.wave*(.6+Math.sin(w.modeT*9)*.5))}function P(){s.traverse(B=>{B.geometry&&B.geometry.dispose(),B.material&&!B.material.userData.shared&&B.material.dispose()}),s.removeFromParent()}return{kind:e,group:s,head:c,pick:M,update:q,setMode:L,walkTo:N,poke:k,dispose:P,get mode(){return w.mode},get walking(){return w.walkT<w.walkDur}}}var yM=320,xM=14,SM=3.5,MM=3.4,pm=18;function fm({scene:e,camera:t,renderer:i,world:r,createHero:a,tier:n,textures:s,audio:o,debug:l}){let h=r,c=i.domElement,u=0,d=a(dr,{tier:n,variant:0,textures:{ice:s.ice||null,syrup:null},onEvent:(C,D)=>q(C,D)});e.add(d.root),e.add(d.fx);let p=d.dims,g=new Vt;g.name="toppings",d.root.add(g);let v={};for(let C of h.toppingKinds){let D=new ia(h.toppingGeos[C],h.toppingMat,pm);D.count=0,D.frustumCulled=!1,g.add(D),v[C]=D}let f={time:0,state:"enter",stateT:0,round:0,variant:0,served:0,bowlPos:Ue.bowlEnter.clone(),bowlTarget:Ue.bowlHome.clone(),bowlVel:new R,bowlHopT:9,held:null,lastTouch:0,lastHint:0,glowT:9,machineHopT:9,wheelAngle:0,wheelOmega:0,clickAcc:0,snowMade:0,give:null,pouring:0,giveGlowT:9};d.root.position.copy(f.bowlPos);let m={time:0,held:!1,bowlVel:{x:0,z:0},snow:{rate:1,x:Ue.spout.x,y:Ue.spout.y,z:Ue.spout.z},pours:[],busy:!1},x=[0,1].map(()=>({id:"",x:0,y:0,z:0,color:[1,1,1],rate:0,kind:"syrup"})),S=[],_=[],E=[],A=[],y=[],M=0,w=()=>{let C=ul[M%ul.length],D=dm(C,Math.floor(M/ul.length));return M++,D.pick.userData.who=D,e.add(D.group),D},L=w();L.group.position.copy(Ue.customerFront);let N=[w(),w()];N.forEach((C,D)=>C.group.position.copy(Ue.queue[D]));let k=[];function q(C,D){let U=o.sfx;C==="land"?U.pop(1.2):C==="slide"?U.slide():C==="spill"?U.spill():C==="syrupHit"?U.plop(1):C==="pool"?U.drip():C==="stage"&&(D.stage>u&&U.sparkle(),u=D.stage)}let P=new cc,B=new ie,Y=new Pi(new R(0,1,0),0),H=new R,he=new R,J=new Map;function Z(C){let D=c.getBoundingClientRect();B.set((C.clientX-D.left)/D.width*2-1,-((C.clientY-D.top)/D.height)*2+1),P.setFromCamera(B,t)}function re(C,D){return Y.constant=-C,P.ray.intersectPlane(Y,D)}function Ie(C){Z(C);let D=[...h.pick,L.pick,...N.map(j=>j.pick)],U=P.intersectObjects(D,!1);return U.length?U[0].object.userData:f.state==="free"&&P.intersectObjects(d.pickables,!0).length?{kind:"bowl"}:f.state==="free"&&re(.05,H)&&Math.hypot(H.x-f.bowlPos.x,H.z-f.bowlPos.z)<p.pickRadius+.03?{kind:"bowl"}:null}c.addEventListener("pointerdown",C=>{C.preventDefault(),o.init(),f.lastTouch=f.time;try{c.setPointerCapture(C.pointerId)}catch{}let D=Ie(C),U={id:C.pointerId,kind:D?D.kind:null,index:D?D.index:-1,x0:C.clientX,y0:C.clientY,t0:performance.now(),moved:!1,e:C,data:{}};if(J.set(C.pointerId,U),!!D){if(U.kind==="bowl"){if(f.held){U.kind=null;return}f.held=U,re(p.rimHeight,H),U.data.off=new R(f.bowlPos.x-H.x,0,f.bowlPos.z-H.z),o.sfx.pop(.9)}else if(U.kind==="wheel")U.data.ang=we(C),U.data.t=performance.now(),f.wheelOmega=Math.max(f.wheelOmega,4),o.sfx.click();else if(U.kind==="bottle"){let j=h.bottles[U.index];if(j.pointer||j.state==="auto"){U.kind=null;return}j.pointer=U,o.sfx.pop(1.4)}else if(U.kind==="pile")h.piles[U.index].hopT=0,o.sfx.pop(1.6);else if(U.kind==="customer"){let j=D.who||L;if(j!==L){j.poke(),o.sfx.hello(qa[j.kind]),U.kind=null;return}L.poke(),o.sfx.hello(qa[L.kind])}}},{passive:!1}),c.addEventListener("pointermove",C=>{let D=J.get(C.pointerId);if(D){if(C.preventDefault(),D.e=C,f.lastTouch=f.time,!D.moved&&Math.hypot(C.clientX-D.x0,C.clientY-D.y0)>xM){if(D.moved=!0,D.kind==="bottle"){let U=h.bottles[D.index];U.state="drag"}D.kind==="pile"&&it(D)}if(D.kind==="wheel"){let U=we(C),j=performance.now(),se=U-D.data.ang;se>Math.PI&&(se-=Math.PI*2),se<-Math.PI&&(se+=Math.PI*2);let Q=Math.max(.008,(j-D.data.t)/1e3),ce=qi(-se/Q,-30,30);f.wheelOmega+=(ce-f.wheelOmega)*.5,D.moved&&Math.abs(f.wheelOmega)<5&&(f.wheelOmega+=.6*Math.sign(f.wheelOmega||1)),D.data.ang=U,D.data.t=j}}},{passive:!1});function ee(C,D){D||o.init();let U=J.get(C.pointerId);if(!U)return;J.delete(C.pointerId);let j=!D&&!U.moved&&performance.now()-U.t0<yM*2;if(U.kind==="bowl"&&f.held===U)f.held=null,f.state==="free"&&f.bowlPos.distanceTo(H.set(Ue.give.x,0,Ue.give.z))<Ue.giveRadius?dt():j&&(f.bowlHopT=0,o.sfx.boing(1.1));else if(U.kind==="wheel")j&&(f.wheelOmega=Math.min(30,Math.abs(f.wheelOmega)+11),o.sfx.click());else if(U.kind==="bottle"){let se=h.bottles[U.index];se.pointer=null,j&&se.state==="home"?lt(se):se.state==="drag"&&(se.state="return",se.t=0,se.from=se.group.position.clone())}else if(U.kind==="pile"){let se=_.find(Q=>Q.pointer===U);se?O(se):j&&at(h.piles[U.index].kind,h.piles[U.index].group.position)}else U.kind==="customer"&&j&&f.state==="free"&&dt()}c.addEventListener("pointerup",C=>ee(C,!1)),c.addEventListener("pointercancel",C=>ee(C,!0)),c.addEventListener("contextmenu",C=>C.preventDefault());let ne=new R;function we(C){h.wheel.getWorldPosition(ne),ne.project(t);let D=c.getBoundingClientRect(),U=(ne.x*.5+.5)*D.width+D.left,j=(-ne.y*.5+.5)*D.height+D.top;return Math.atan2(-(C.clientY-j),C.clientX-U)}let Pe=new ie(Ue.work.x0+.02,Ue.work.z0+.03),Oe=new ie(Ue.give.x,Ue.give.z);function fe(C,D,U){let j=qi(C,Ue.work.x0,Ue.work.x1),se=qi(D,Ue.work.z0,Ue.work.z1),Q=Math.hypot(C-j,D-se),ce=he.set(Oe.x-Pe.x,0,Oe.y-Pe.y),me=ce.x*ce.x+ce.z*ce.z,Se=qi(((C-Pe.x)*ce.x+(D-Pe.y)*ce.z)/me,0,1),pe=Pe.x+ce.x*Se,Ke=Pe.y+ce.z*Se,$e=Math.hypot(C-pe,D-Ke),Pt=.06;$e>Pt?(pe+=(C-pe)/$e*Pt,Ke+=(D-Ke)/$e*Pt):(pe=C,Ke=D);let mi=Math.hypot(C-pe,D-Ke);return Q<=mi?U.set(j,0,se):U.set(pe,0,Ke),U}let Ge={y:0,nx:0,ny:1,nz:0,inside:!1};function tt(C,D){let U=C-f.bowlPos.x,j=D-f.bowlPos.z;return Math.hypot(U,j)>p.rimRadius?0:(d.sampleSurface(U,j,Ge),Ge.y+d.root.position.y)}function Le(C){let D=-1,U=0,j=0;for(let se=0;se<10;se++){let Q=Math.random()*Math.PI*2,ce=Math.sqrt(Math.random())*p.rimRadius*.6,me=Math.cos(Q)*ce,Se=Math.sin(Q)*ce;d.sampleSurface(me,Se,Ge);let pe=Ge.y+Math.random()*.01;pe>D&&(D=pe,U=me,j=Se)}return C.set(U,0,j)}function lt(C){if(f.state!=="free"){C.hopT=0;return}C.state="auto",C.t=0,C.from=C.group.position.clone(),Le(C.target),C.spin=Math.random()*Math.PI*2,o.sfx.whoosh()}function oe(C){let D=0;for(let U of h.bottles){U.hopT+=C;let j=U.group,se=0,Q=H;if(U.state==="drag"&&U.pointer){if(Z(U.pointer.e),re(.1,Q)){let me=tt(Q.x,Q.z);Q.y=Math.max(me+.12,.2),j.position.lerp(Q,Ti(22,C))}se=Math.hypot(j.position.x-f.bowlPos.x,j.position.z-f.bowlPos.z)<p.rimRadius+.01&&f.state==="free"?1:.35}else if(U.state==="auto"){U.t+=C;let ce=U.spin+U.t*2.6,me=.022,Se=f.bowlPos.x+U.target.x+Math.cos(ce)*me,pe=f.bowlPos.z+U.target.z+Math.sin(ce)*me,Ke=Math.max(tt(Se,pe)+.12,.2);if(U.t<.45){let $e=ja(U.t/.45);Q.set(U.from.x+(Se-U.from.x)*$e,U.from.y+(Ke-U.from.y)*$e+Math.sin($e*Math.PI)*.08,U.from.z+(pe-U.from.z)*$e),j.position.copy(Q),se=.5}else U.t<2.2&&f.state==="free"?(j.position.lerp(Q.set(Se,Ke,pe),Ti(10,C)),se=1):(U.state="return",U.t=0,U.from=j.position.clone())}else if(U.state==="return"){U.t+=C;let ce=ja(Math.min(1,U.t/.4));j.position.lerpVectors(U.from,U.home,ce),j.position.y+=Math.sin(ce*Math.PI)*.05,ce>=1&&(U.state="home",o.sfx.click())}else j.position.copy(U.home),j.position.y+=Rr(U.hopT/.4)*.035,U.pointer&&!U.pointer.moved&&(j.position.y+=.01);if(U.tilt+=(se-U.tilt)*Ti(9,C),j.rotation.set(0,0,U.tilt*2.25),U.rate=U.tilt>.8?(U.tilt-.8)/.2:0,U.mat.emissiveIntensity=.12+Math.max(0,1-U.hopT/.8)*.5,U.rate>.02&&D<x.length&&!m.busy){let ce=x[D++];ce.id=U.syrup.id,ce.x=j.position.x,ce.y=j.position.y,ce.z=j.position.z,ce.color=U.syrup.color,ce.rate=U.rate,ce.kind=U.syrup.kind}}m.pours.length=0;for(let U=0;U<D;U++)m.pours.push(x[U]);return D}let ge=new Ye,ue=new Ct,Ce=new Ct,Re=new R(0,1,0),Fe=new R,He=new R;function Je(C){let D=new Xe(h.toppingGeos[C],h.toppingMat);return e.add(D),D}function it(C){let D=h.piles[C.index],U={kind:D.kind,mesh:Je(D.kind),mode:"drag",t:0,pointer:C,from:D.group.position.clone(),to:new R};U.mesh.position.copy(D.group.position),_.push(U)}function at(C,D){let U={kind:C,mesh:Je(C),mode:"hop",t:0,pointer:null,from:D.clone(),to:Le(new R)};U.to.x+=(Math.random()-.5)*.03,U.to.z+=(Math.random()-.5)*.03,U.mesh.position.copy(D),_.push(U)}function O(C){C.pointer=null;let D=C.mesh.position.x-f.bowlPos.x,U=C.mesh.position.z-f.bowlPos.z;Math.hypot(D,U)<p.rimRadius*.92&&f.state==="free"?(C.mode="fall",C.t=0,C.to.set(D,0,U),C.from=C.mesh.position.clone()):(C.mode="back",C.t=0,C.from=C.mesh.position.clone(),C.to.copy(h.piles[h.toppingKinds.indexOf(C.kind)].group.position))}function ht(C,D,U){S.length>=pm&&S.shift(),S.push({kind:C,lx:D,lz:U,ry:Math.random()*Math.PI*2,t:0}),o.sfx.pop(1.3+Math.random()*.3)}function Ve(C){for(let me=_.length-1;me>=0;me--){let Se=_[me];Se.t+=C;let pe=Se.mesh;if(Se.mode==="drag"){if(Z(Se.pointer.e),re(.08,H)){let Ke=tt(H.x,H.z);H.y=Math.max(Ke,.02)+.05,pe.position.lerp(H,Ti(25,C))}}else if(Se.mode==="hop"||Se.mode==="fall"){let Ke=Se.mode==="hop"?.55:.22,$e=Math.min(1,Se.t/Ke),Pt=f.bowlPos.x+Se.to.x,mi=f.bowlPos.z+Se.to.z,dl=tt(Pt,mi);if(pe.position.set(Se.from.x+(Pt-Se.from.x)*$e,Se.from.y+(dl-Se.from.y)*$e+(Se.mode==="hop"?Math.sin($e*Math.PI)*.12:0),Se.from.z+(mi-Se.from.z)*$e),$e>=1){f.state==="free"&&ht(Se.kind,Se.to.x,Se.to.z),pe.removeFromParent(),_.splice(me,1);continue}}else if(Se.mode==="back"){let Ke=Math.min(1,Se.t/.3);if(pe.position.lerpVectors(Se.from,Se.to,ja(Ke)),pe.scale.setScalar(1-Ke*.8),Ke>=1){pe.removeFromParent(),_.splice(me,1);continue}}pe.rotation.y+=C*3}let D={};for(let me of h.toppingKinds)D[me]=0;let U=ge,j=ue,se=Re,Q=Fe,ce=He;for(let me of S){me.t+=C,d.sampleSurface(me.lx,me.lz,Ge),Q.set(Ge.nx*.5,1,Ge.nz*.5).normalize(),j.setFromUnitVectors(se,Q),j.multiply(Ce.setFromAxisAngle(se,me.ry));let Se=me.t<.25?.6+pc(me.t/.25)*.4:1;U.compose(H.set(me.lx,Ge.y-.002+Rr(me.t/.3)*.01,me.lz),j,ce.set(Se,Se,Se)),v[me.kind].setMatrixAt(D[me.kind]++,U)}for(let me of h.toppingKinds)v[me].count=D[me],v[me].instanceMatrix.needsUpdate=!0}function dt(){if(f.state==="free"){f.state="give",f.stateT=0,f.held=null,f.give={from:f.bowlPos.clone(),bitten:!1,happy:!1,snapped:!1,entered:!1,munch:0};for(let C of h.bottles)(C.state==="drag"||C.state==="auto")&&(C.pointer=null,C.state="return",C.t=0,C.from=C.group.position.clone());for(let C of _)C.mode==="drag"&&O(C);o.sfx.whoosh()}}function de(C){let D=f.give,U=f.stateT,j=H.set(Ue.give.x,0,Ue.give.z);if(U<.6?f.bowlTarget.lerpVectors(D.from,j,ja(U/.6)):f.bowlTarget.copy(j),f.bowlPos.copy(f.bowlTarget),U>.6&&!D.snapped&&(L.mode==="wait"||L.mode==="wave")&&L.setMode("eat"),U>.78&&D.munch===0&&(D.munch=1,o.sfx.munch()),U>.85&&!D.bitten){D.bitten=!0;let se=L.group.position.x-f.bowlPos.x,Q=L.group.position.z-f.bowlPos.z,ce=Math.hypot(se,Q)||1;d.bite(se/ce*.03,Q/ce*.03,.032)}if(U>1.3&&!D.happy&&(D.happy=!0,L.setMode("happy"),o.sfx.happy(qa[L.kind]),o.sfx.chime(),xt(L)),U>2.5&&!D.snapped){D.snapped=!0;let se=d.snapshot();for(let ce of S){let me=new Xe(h.toppingGeos[ce.kind],h.toppingMat);d.sampleSurface(ce.lx,ce.lz,Ge),me.position.set(ce.lx,Ge.y-.002,ce.lz),me.rotation.y=ce.ry,se.add(me)}se.position.copy(f.bowlPos),e.add(se),S.length=0,d.root.visible=!1,f.variant++,d.reset({variant:f.variant}),u=0,f.snowMade=0,ze(se),L.setMode("leave"),L.walkTo(Ue.exit,1.8),k.push({a:L,t:0}),L=N.shift(),L.walkTo(Ue.customerFront,1.3),L.setMode("wait"),N.forEach((ce,me)=>ce.walkTo(Ue.queue[me],1.3));let Q=w();Q.group.position.set(Ue.queue[1].x-.5,Ue.queue[1].y,Ue.queue[1].z-.2),Q.walkTo(Ue.queue[1],1.6),N.push(Q)}U>2.9&&!D.entered&&(D.entered=!0,d.root.visible=!0,f.bowlPos.copy(Ue.bowlEnter),f.state="enter",f.stateT=0,f.served++,o.sfx.whoosh())}function nt(C){let D=Math.min(1,f.stateT/.9);f.bowlPos.lerpVectors(Ue.bowlEnter,Ue.bowlHome,pc(D)),D>=1&&(f.state="free",f.stateT=0,f.bowlTarget.copy(Ue.bowlHome),f.bowlHopT=0,f.machineHopT=.1,f.glowT=0,f.lastHint=f.time,o.sfx.boing(1),o.sfx.hello(qa[L.kind]))}function ze(C){if(E.length>=Ue.shelfSlots.length){let D=E.shift();D.obj.userData.dispose&&D.obj.userData.dispose(),D.obj.removeFromParent(),E.forEach((U,j)=>{U.from=U.obj.position.clone(),U.slot=j,U.t=0,U.fromScale=U.obj.scale.x})}E.push({obj:C,slot:E.length,t:0,from:C.position.clone(),fromScale:1})}function qe(C){for(let D of E){if(D.t>=1)continue;D.t=Math.min(1,D.t+C/.9);let U=Ue.shelfSlots[D.slot],j=ja(D.t);D.obj.position.lerpVectors(D.from,U,j),D.obj.position.y+=Math.sin(j*Math.PI)*.18,D.obj.scale.setScalar(D.fromScale+(Ue.shelfScale-D.fromScale)*j)}}function xt(C){for(let D=0;D<9;D++){let U=C.group.position.clone();U.y+=.2,U.z+=.05,y.push({p:U,v:new R((Math.random()-.5)*.35,.35+Math.random()*.3,.1+Math.random()*.1),t:-D*.06})}}function I(C){let D=ge,U=He,j=0;for(let se=y.length-1;se>=0;se--){let Q=y[se];if(Q.t+=C,Q.t>1.6){y.splice(se,1);continue}if(Q.t<0)continue;Q.p.addScaledVector(Q.v,C),Q.v.y-=.12*C,Q.v.x*=.98;let ce=Math.min(1,Q.t/.15)*(Q.t>1.2?Math.max(0,1-(Q.t-1.2)/.4):1)*(1+Math.sin(Q.t*12)*.08);D.compose(Q.p,t.quaternion,U.set(ce,ce,ce)),j<16&&h.hearts.setMatrixAt(j++,D)}h.hearts.count=j,h.hearts.instanceMatrix.needsUpdate=!0}function b(){if(f.state!=="free"||f.time-f.lastTouch<SM||f.time-f.lastHint<MM)return;f.lastHint=f.time;let C=d.getStats();C.volume<.3?(f.bowlHopT=0,f.glowT=0,f.wheelOmega+=6,o.sfx.boing(1)):C.coverage<.1?(h.bottles.forEach((D,U)=>{D.hopT=-U*.15}),o.sfx.pop(1.5)):(f.giveGlowT=0,L.poke(),L.setMode("wave"),setTimeout(()=>L.mode==="wave"&&L.setMode("wait"),1500),h.piles.forEach((D,U)=>{D.hopT=-.3-U*.12}),o.sfx.hello(qa[L.kind]))}let W=new Ye,le=new Ct,te=new R,ye=new R;function _e(C,D,U,j){W.compose(ye.set(D,.0012,U),le,te.set(j,1,j)),h.blobs.setMatrixAt(C,W)}function G(){let C=0;d.root.visible&&_e(C++,f.bowlPos.x,f.bowlPos.z,p.rimRadius*2.5*(1-d.root.position.y*6)),_e(C++,Ue.column.x,Ue.column.z,.22),_e(C++,Ue.tray.x,Ue.tray.z,.21);for(let D of h.bottles){let U=Math.max(0,D.group.position.y-D.home.y);_e(C++,D.group.position.x,D.group.position.z,Math.max(.02,.075-U*.25))}h.blobs.count=C,h.blobs.instanceMatrix.needsUpdate=!0}let ae=f.bowlPos.clone();function Te(C){f.time+=C,f.stateT+=C,f.state==="free"?(f.held&&(Z(f.held.e),re(p.rimHeight,H)&&fe(H.x+f.held.data.off.x,H.z+f.held.data.off.z,f.bowlTarget)),f.bowlPos.lerp(f.bowlTarget,Ti(16,C))):f.state==="give"?de(C):f.state==="enter"&&nt(C),f.bowlVel.set((f.bowlPos.x-ae.x)/C,0,(f.bowlPos.z-ae.z)/C),ae.copy(f.bowlPos),f.bowlHopT+=C,d.root.position.set(f.bowlPos.x,Rr(f.bowlHopT/.45)*.03,f.bowlPos.z),f.machineHopT+=C,h.machine.position.y=Rr(f.machineHopT/.5)*.025,f.wheelOmega*=Math.exp(-1.3*C),f.wheelAngle-=f.wheelOmega*C,h.wheel.rotation.z=f.wheelAngle,f.clickAcc+=Math.abs(f.wheelOmega)*C,f.clickAcc>Math.PI*2/10&&(f.clickAcc=0,o.sfx.click());let D=f.state==="free",U=Math.min(2,Math.abs(f.wheelOmega)/6),j=D?(f.pouring>0?.3:1)+U:0;f.snowMade+=j*C,h.iceBlock.scale.y=Math.max(.35,1-f.snowMade/160),h.iceBlock.position.y=Ue.spout.y+.12+h.iceBlock.scale.y*.035,m.time=f.time,m.held=!!f.held,m.busy=f.state!=="free",m.bowlVel.x=f.bowlVel.x,m.bowlVel.z=f.bowlVel.z,j>0&&(m.snow=m.snow||{x:0,y:0,z:0,rate:0},m.snow.rate=j,m.snow.x=Ue.spout.x,m.snow.y=Ue.spout.y+h.machine.position.y,m.snow.z=Ue.spout.z);let se=m.snow;j<=0&&(m.snow=null);let Q=oe(C);f.pouring=Q>0?.6:Math.max(0,f.pouring-C),d.root.updateMatrixWorld(),d.update(C,m),m.snow||(m.snow=se),Ve(C);for(let Pt of h.piles)Pt.hopT+=C,Pt.group.position.y=.008+Rr(Pt.hopT/.4)*.03;let ce=Math.hypot(f.bowlPos.x-Ue.give.x,f.bowlPos.z-Ue.give.z),me=f.state==="free"?qi(1-(ce-.05)/.3,0,1):f.state==="give"&&f.stateT<.6?1:0;L.update(C,{lookX:f.bowlPos.x,eager:me});for(let Pt of N)Pt.update(C,{lookX:f.bowlPos.x,eager:0});for(let Pt=k.length-1;Pt>=0;Pt--){let mi=k[Pt];mi.t+=C,mi.a.update(C,{lookX:-2,eager:0}),mi.t>1.9&&(mi.a.dispose(),k.splice(Pt,1))}qe(C),I(C),b(),G(),f.glowT+=C;let Se=f.glowT<1.6?Math.sin(f.glowT/1.6*Math.PI):0;h.glow.material.opacity=Se*.85,h.glow.visible=Se>.01,h.glow.position.set(f.bowlPos.x,.003,f.bowlPos.z),h.glow.scale.setScalar(p.rimRadius*3.2+Se*.06),f.giveGlowT+=C;let pe=f.state==="free"&&f.held?qi(1-(ce-Ue.giveRadius)/.25,0,1):0,Ke=Math.max(f.giveGlowT<2.4?Math.sin(f.giveGlowT/1.2*Math.PI)**2:0,pe*(.55+.25*Math.sin(f.time*6)));h.giveGlow.material.opacity=Ke,h.giveGlow.visible=Ke>.01&&f.state==="free",h.giveGlow.scale.setScalar(.36+Ke*.05);let $e=d.levels;o.setLevels(j>0?.25+.25*(j-1)+$e.land*.5:0,Math.max($e.slide,$e.spill*.8),Math.max($e.flow,Q?.5:0))}f.state="enter",f.stateT=.5;function F(C){let D=new R;if(C==="bowl")D.set(f.bowlPos.x,p.rimHeight,f.bowlPos.z);else if(C==="give")D.set(Ue.give.x,p.rimHeight,Ue.give.z);else if(C==="wheel")h.wheel.getWorldPosition(D);else if(C==="customer")L.group.getWorldPosition(D),D.y+=.1;else if(C.startsWith("bottle")){let j=h.bottles[+C.slice(6)];D.copy(j.group.position),D.y-=.07}else if(C.startsWith("pile"))D.copy(h.piles[+C.slice(4)].group.position);else if(C.startsWith("local:")){let[j,se]=C.slice(6).split(",").map(Number);D.set(f.bowlPos.x+j,p.rimHeight,f.bowlPos.z+se)}D.project(t);let U=c.getBoundingClientRect();return{x:(D.x*.5+.5)*U.width+U.left,y:(-D.y*.5+.5)*U.height+U.top}}function $(){d.dispose();for(let C of E)C.obj.userData.dispose&&C.obj.userData.dispose(),C.obj.removeFromParent();[L,...N].forEach(C=>C.dispose());for(let C in v)v[C].dispose();om(e)}return{update:Te,hero:d,screenOf:F,dispose:$,heroObjs:[d.root,d.fx],get bottlesHome(){return h.bottles.every(C=>C.state==="home")},get happy(){return L.mode==="happy"||f.give&&f.give.happy},get customerWalking(){return L.walking},get label(){let C=d.getStats();return`${f.state} served ${f.served} stage ${C.stage} vol ${C.volume.toFixed(2)} cov ${C.coverage.toFixed(2)}`},get state(){return{state:f.state,served:f.served,stats:d.getStats(),toppings:S.length,shelf:E.length}}}}async function bM(e){let t=new URLSearchParams(location.search),i=cm(t.get("debug")==="1"),r=performance.now(),a=Qf(),n=a.settings,s=document.getElementById("c"),o=new uc({canvas:s,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});o.outputColorSpace=Ut,o.toneMapping=Hn,o.toneMappingExposure=1,o.shadowMap.enabled=!1;let l=new Yo,h=35,c=new kt(h,1,.05,6),u=new R(0,.86,.98),d=new R(0,.18,-.12);c.position.copy(u),c.lookAt(d);let p=new R;function g(){let P=Math.max(1,window.innerWidth),B=Math.max(1,window.innerHeight),Y=n.pixelRatio;P*B*Y*Y>n.maxPixels&&(Y=Math.sqrt(n.maxPixels/(P*B))),o.setPixelRatio(Y),o.setSize(P,B,!1),s.style.width=P+"px",s.style.height=B+"px";let H=P/B,he=h,J=2*Math.atan(Math.tan(Gn.degToRad(he/2))*(4/3)),Z=Gn.degToRad(he);if(H<4/3&&(Z=2*Math.atan(Math.tan(J/2)/H)),c.fov=Math.min(80,Gn.radToDeg(Z)),c.aspect=H,c.updateProjectionMatrix(),c.clearViewOffset(),c.updateMatrixWorld(),H<4/3){let re=p.set(0,0,.37).project(c).y,Ie=(re+.96)*.5*B;Ie>1&&c.setViewOffset(P,B,0,-Ie,P,B)}}g(),window.addEventListener("resize",g);let{textures:v,ready:f}=tm(o,P=>i.pushErr(P));await Promise.race([f,new Promise(P=>setTimeout(P,2500))]);let m=im(),x=lm(l,v,m),S=hm(),_=fm({scene:l,camera:c,renderer:o,world:x,createHero:e,tier:n.tier,textures:v,audio:S,debug:i}),E=!1;s.addEventListener("webglcontextlost",P=>{P.preventDefault(),E=!0,i.note("context lost")},!1),s.addEventListener("webglcontextrestored",()=>{E=!1,i.note("context restored"),l.traverse(P=>{let B=Array.isArray(P.material)?P.material:P.material?[P.material]:[];for(let Y of B){for(let H in Y){let he=Y[H];he&&he.isTexture&&(he.needsUpdate=!0)}Y.needsUpdate=!0}});try{_.hero.onContextRestored()}catch(P){i.pushErr(P.message)}g(),y=performance.now()},!1);let A=()=>({tier:n.tier,heroObjs:_.heroObjs,scene:_.label,readyMs:window.__kaki.readyMs}),y=performance.now(),M=0,w=!1,L=0,N=0,k=0;document.addEventListener("visibilitychange",()=>{w=document.hidden,y=performance.now(),w?S.suspend():S.resume()});function q(P){if(requestAnimationFrame(q),w||E){y=P;return}let B=(P-y)/1e3;y=P;let Y=Math.min(.05,Math.max(1e-4,B));try{_.update(Y),o.render(l,c)}catch(H){i.pushErr(H&&H.message||H),console.error(H)}if(M||(M=performance.now(),document.body.classList.add("ready"),window.__kaki.readyMs=M-r),i.frame(B,o,l,A),!a.forced&&n.tier!=="low"&&P-M>6e3&&(L+=B,k++,L>3)){let H=k/L;N=H<35?N+1:0,L=0,k=0,N>=2&&(n=dc("low",a.mobile),g(),i.note("tier\u2192low (fps "+H.toFixed(0)+")"))}}window.__kaki={ready:!0,readyMs:0,game:_,renderer:o,scene:l,camera:c,THREE:dr,screenOf:P=>_.screenOf(P),get state(){return _.state},get debug(){return i.stats},errors:i.errors},requestAnimationFrame(q)}return bm(EM);})();
