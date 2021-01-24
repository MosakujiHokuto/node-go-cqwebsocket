import {APIEventType, CQEvent, EventType, MessageEventType, SocketEventType} from "./event-bus";
import * as Tags from "./tags";
import {CQ, CQTag, node} from "./tags";
import {APIRequest, APIResponse, SocketType, WebSocketCQ} from "./websocket";

export {
  Tags, CQ
};

export class CQWebSocket extends WebSocketCQ {
  /**
   * 发送私聊消息
   * @param user_id  对方 QQ 号
   * @param message 要发送的内容
   * @param auto_escape=false  消息内容是否作为纯文本发送 ( 即不解析 CQ 码 ) , 只在 `message` 字段是字符串时有效
   */
  public send_private_msg(user_id: int64, message: message, auto_escape = false): Promise<void> | void {
    return this.send("send_private_msg", {user_id, message, auto_escape})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 发送群消息
   * @param group_id 群号
   * @param message  要发送的内容
   * @param auto_escape=false 消息内容是否作为纯文本发送 ( 即不解析 CQ 码) , 只在 `message` 字段是字符串时有效
   */
  public send_group_msg(group_id: int64, message: message, auto_escape = false): Promise<void> | void {
    return this.send("send_group_msg", {group_id, message, auto_escape})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 发送合并转发 ( 群 )
   * @param group_id 群号
   * @param messages 自定义转发消息
   */
  public send_group_forward_msg(group_id: number | string, messages: CQTag<node>[]): Promise<void> | void {
    return this.send("send_group_forward_msg", {group_id, messages})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 发送消息
   * @param data
   */
  public send_msg(data: PrivateData | GroupData): Promise<void> | void {
    return this.send("send_msg", data)
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 撤回消息
   * @param message_id 消息 ID
   */
  public delete_msg(message_id: number): Promise<void> | void {
    return this.send("delete_msg", {message_id})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 获取消息
   * @param message_id 消息 ID
   */
  public get_msg(message_id: number): Promise<MessageInfo> {
    return new Promise<MessageInfo>((resolve, reject) => {
      this.send("get_msg", {message_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 群组踢人
   * @param group_id 群号
   * @param user_id 要踢的 QQ 号
   * @param reject_add_request 拒绝此人的加群请求
   */
  public set_group_kick(group_id: int64, user_id: int64, reject_add_request = false): Promise<void> | void {
    return this.send("set_group_kick", {group_id, user_id, reject_add_request})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 群组单人禁言
   * @param group_id 群号
   * @param user_id 要禁言的 QQ 号
   * @param duration 禁言时长, 单位秒, 0 表示取消禁言
   */
  public set_group_ban(group_id: int64, user_id: int64, duration = 30 * 60): Promise<void> | void {
    return this.send("set_group_ban", {group_id, user_id, duration})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 群组全员禁言
   * @param group_id 群号
   * @param enable 是否禁言
   */
  public set_group_whole_ban(group_id: int64, enable = true): Promise<void> | void {
    return this.send("set_group_whole_ban", {group_id, enable})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 群组设置管理员
   * @param group_id 群号
   * @param user_id 要设置管理员的 QQ 号
   * @param enable true 为设置, false 为取消
   */
  public set_group_admin(group_id: int64, user_id: int64, enable = true): Promise<void> | void {
    return this.send("set_group_admin", {group_id, user_id, enable})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 设置群名片 ( 群备注 )
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param card 群名片内容, 不填或空字符串表示删除群名片
   */
  public set_group_card(group_id: int64, user_id: int64, card = ""): Promise<void> | void {
    return this.send("set_group_card", {group_id, user_id, card})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 设置群名
   * @param group_id 群号
   * @param group_name 新群名
   */
  public set_group_name(group_id: int64, group_name = ""): Promise<void> | void {
    return this.send("set_group_name", {group_id, group_name})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 退出群组
   * @param group_id 群号
   * @param is_dismiss 是否解散, 如果登录号是群主, 则仅在此项为 true 时能够解散
   */
  public set_group_leave(group_id: int64, is_dismiss = false): Promise<void> | void {
    return this.send("set_group_leave", {group_id, is_dismiss})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 设置群组专属头衔
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param special_title 专属头衔, 不填或空字符串表示删除专属头衔
   * @param duration 专属头衔有效期, 单位秒, -1 表示永久, 不过此项似乎没有效果, 可能是只有某些特殊的时间长度有效, 有待测试
   */
  public set_group_special_title(group_id: int64, user_id: int64, special_title = "", duration = -1): Promise<void> | void {
    return this.send("set_group_special_title", {group_id, user_id, special_title, duration})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 处理加好友请求
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求
   * @param remark 添加后的好友备注（仅在同意时有效）
   */
  public set_friend_add_request(flag: string, approve = true, remark = ""): Promise<void> | void {
    return this.send("set_friend_add_request", {flag, approve, remark})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 处理加群请求／邀请
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param sub_type add 或 invite, 请求类型（需要和上报消息中的 sub_type 字段相符）
   * @param approve 是否同意请求
   * @param reason 添加后的好友备注（仅在同意时有效）
   */
  public set_group_add_request(flag: string, sub_type: string, approve = true, reason = ""): Promise<void> | void {
    return this.send("set_group_add_request", {flag, sub_type, type: sub_type, approve, reason})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 获取登录号信息
   */
  public get_login_info(): Promise<LoginInfo> {
    return new Promise<LoginInfo>((resolve, reject) => {
      this.send("get_login_info", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取陌生人信息
   */
  public get_stranger_info(): Promise<StrangerInfo> {
    return new Promise<StrangerInfo>((resolve, reject) => {
      this.send("get_stranger_info", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取好友列表
   */
  public get_friend_list(): Promise<FriendInfo[]> {
    return new Promise<FriendInfo[]>((resolve, reject) => {
      this.send("get_friend_list", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群信息
   * @param group_id 群号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时, 但响应更快）
   */
  public get_group_info(group_id: int64, no_cache = false): Promise<GroupInfo> {
    return new Promise<GroupInfo>((resolve, reject) => {
      this.send("get_group_info", {group_id, no_cache})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群列表
   */
  public get_group_list(): Promise<GroupInfo[]> {
    return new Promise<GroupInfo[]>((resolve, reject) => {
      this.send("get_group_list", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群成员信息
   * @param group_id 群号
   * @param user_id QQ 号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时, 但响应更快）
   */
  public get_group_member_info(group_id: int64, user_id: int64, no_cache = false): Promise<GroupMemberInfo> {
    return new Promise<GroupMemberInfo>((resolve, reject) => {
      this.send("get_group_member_info", {group_id, user_id, no_cache})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群成员列表
   *
   * **注：** 获取列表时和获取单独的成员信息时, 某些字段可能有所不同
   *
   * 例如：`area`、`title` 等字段在获取列表时无法获得, 具体应以[单独的成员信息]{@link get_group_member_info}为准。
   * @param group_id 群号
   * @see  get_group_member_info
   */
  public get_group_member_list(group_id: int64): Promise<GroupMemberInfo[]> {
    return new Promise<GroupMemberInfo[]>((resolve, reject) => {
      this.send("get_group_member_list", {group_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群荣誉信息
   * @param group_id 群号
   * @param type 要获取的群荣誉类型, 可传入 `talkative`, `performer`, `legend`, `strong_newbie`, `emotion`
   *             以分别获取单个类型的群荣誉数据, 或传入 `all` 获取所有数据
   */
  public get_group_honor_info(group_id: int64, type: string): Promise<GroupHonorInfo> {
    return new Promise<GroupHonorInfo>((resolve, reject) => {
      this.send("get_group_honor_info", {group_id, type})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 检查是否可以发送图片
   */
  public can_send_image(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.send("can_send_image", {})
          .then(json => resolve(json.data["yes"]), json => reject(json));
    });
  }

  /**
   * 检查是否可以发送语音
   */
  public can_send_record(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.send("can_send_record", {})
          .then(json => resolve(json.data["yes"]), json => reject(json));
    });
  }

  /**
   * 获取版本信息
   */
  public get_version_info(): Promise<VersionInfo> {
    return new Promise<VersionInfo>((resolve, reject) => {
      this.send("get_version_info", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 设置群头像
   *
   * **[1]** `file` 参数支持以下几种格式：
   *
   * - 绝对路径, 例如 `file:///C:\\Users\Richard\Pictures\1.png`, 格式使用 [`file` URI]{@link https://tools.ietf.org/html/rfc8089}
   * - 网络 URL, 例如 `http://i1.piimg.com/567571/fdd6e7b6d93f1ef0.jpg`
   * - Base64 编码, 例如 `base64://iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAIAAADJt1n/AAAAKElEQVQ4EWPk5+RmIBcwkasRpG9UM4mhNxpgowFGMARGEwnBIEJVAAAdBgBNAZf+QAAAAABJRU5ErkJggg==`
   *
   * **[2]** 目前这个API在登录一段时间后因cookie失效而失效, 请考虑后使用
   * @param group_id 群号
   * @param file 图片文件名,支持以下几种格式：
   * @param cache 表示是否使用已缓存的文件,通过网络 URL 发送时有效, `1` 表示使用缓存, `0` 关闭关闭缓存, 默认 为 `1`
   */
  public set_group_portrait(group_id: int64, file: string, cache = 1): Promise<VersionInfo> {
    return new Promise<VersionInfo>((resolve, reject) => {
      this.send("set_group_portrait", {group_id, file, cache})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群系统消息
   */
  public get_group_system_msg(): Promise<GroupSystemMSG> {
    return new Promise<GroupSystemMSG>((resolve, reject) => {
      this.send("get_group_system_msg", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群文件系统信息
   * @param group_id 群号
   */
  public get_group_file_system_info(group_id: int64): Promise<GroupFileSystemInfo> {
    return new Promise<GroupFileSystemInfo>((resolve, reject) => {
      this.send("get_group_file_system_info", {group_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群根目录文件列表
   * @param group_id 群号
   */
  public get_group_root_files(group_id: int64): Promise<GroupRootFileSystemInfo> {
    return new Promise<GroupRootFileSystemInfo>((resolve, reject) => {
      this.send("get_group_root_files", {group_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群子目录文件列表
   * @param group_id 群号
   * @param folder_id 文件夹ID 参考 [GroupFolderInfo]{@link GroupFolderInfo.folder_id} 对象
   */
  public get_group_files_by_folder(group_id: int64, folder_id: string): Promise<GroupRootFileSystemInfo> {
    return new Promise<GroupRootFileSystemInfo>((resolve, reject) => {
      this.send("get_group_files_by_folder", {group_id, folder_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群文件资源链接
   * @param group_id 群号
   * @param file_id 文件ID 参考 [GroupFileInfo]{@link GroupFileInfo.file_id} 对象
   * @param busid 文件类型 参考 [GroupFileInfo]{@link GroupFileInfo.busid} 对象
   * @return 返回下载链接
   */
  public get_group_file_url(group_id: int64, file_id: string, busid: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.send("get_group_file_url", {group_id, file_id})
          .then(json => resolve(json.data["url"]), json => reject(json));
    });
  }

  /**
   * 获取状态
   *
   * **注意**：所有统计信息都将在重启后重制
   * @see https://ishkong.github.io/go-cqhttp-docs/api/#%E8%8E%B7%E5%8F%96%E7%8A%B6%E6%80%81
   */
  public get_status(): Promise<Status> {
    return new Promise<Status>((resolve, reject) => {
      return this.send("get_status", {})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取群 @全体成员 剩余次数
   * @param group_id 群号
   */
  public get_group_at_all_remain(group_id: int64): Promise<GroupAtAllRemain> {
    return new Promise<GroupAtAllRemain>((resolve, reject) => {
      this.send("get_group_at_all_remain", {group_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 获取VIP信息
   * @param user_id QQ 号
   */
  public get_vip_info(user_id: int64): Promise<VipInfo> {
    return new Promise<VipInfo>((resolve, reject) => {
      this.send("_get_vip_info", {user_id})
          .then(json => resolve(json.data), json => reject(json));
    });
  }

  /**
   * 发送群公告
   * @param group_id QQ 号
   * @param content 公告内容
   */
  public send_group_notice(group_id: int64, content: string): Promise<void> | void {
    return this.send("_send_group_notice", {group_id})
        .then(this.messageSuccess, this.messageFail);
  }

  /**
   * 重载事件过滤器
   */
  public reload_event_filter(): Promise<void> | void {
    return this.send("reload_event_filter", {})
        .then(this.messageSuccess, this.messageFail);
  }
}

export interface CQWebSocket {
  on(eventType: "socket.open", handler: (event: CQEvent, type: SocketType) => void): this

  on(eventType: "socket.close" | "socket.error", handler: (event: CQEvent, code: number, reason: string, type: SocketType) => void): this

  on(eventType: "api.preSend", handler: (event: CQEvent, message: APIRequest) => void): this

  on(eventType: "api.response", handler: (event: CQEvent, message: APIResponse<any>) => void): this

  on(eventType: MessageEventType, handler: (event: CQEvent, message: any, CQTag: CQTag<any>[]) => void): this

  on(eventType: EventType, handler: (event: CQEvent, message: any) => void): this

  once(eventType: "socket.open", handler: (event: CQEvent, type: SocketType) => void): this

  once(eventType: "socket.close" | "socket.error", handler: (event: CQEvent, code: number, reason: string, type: SocketType) => void): this

  once(eventType: "api.preSend", handler: (event: CQEvent, message: APIRequest) => void): this

  once(eventType: "api.response", handler: (event: CQEvent, message: APIResponse<any>) => void): this

  once(eventType: MessageEventType, handler: (event: CQEvent, message: any, CQTag: CQTag<any>[]) => void): this

  once(eventType: Exclude<ExcludeEventType, EventType>, handler: (event: CQEvent, message: any) => void): this
}

type ExcludeEventType = MessageEventType | SocketEventType | APIEventType

/**
 * @see send_msg
 */
declare interface PrivateData {
  message_type?: "private"
  user_id: int64
  message: message
  auto_escape: boolean
}

/**
 * @see send_msg
 */
declare interface GroupData {
  message_type?: "group"
  group_id: int64
  message: message
  auto_escape: boolean
}

/**
 * @see get_group_info
 * @see get_group_list
 */
declare interface GroupInfo {
  group_id: number
  group_name: string
  member_count: number
  max_member_count: number
}

/**
 * @see get_msg
 */
declare interface MessageInfo {
  /**
   * 当消息来源为 `group` 时，为 `true`
   */
  group: boolean
  /**
   * 当 [group]{@link group} == true 时, 有值, 否则为 `null`
   */
  group_id: number | null
  /**
   * 消息内容
   */
  message: string
  /**
   * 消息id
   */
  message_id: number
  /**
   * 消息来源 `private`，`group`, 等
   */
  message_type: string
  /**
   * 原始消息内容
   */
  raw_message: string
  /**
   * 消息真实id
   */
  real_id: number
  /**
   * 发送者
   */
  sender: LoginInfo
  /**
   * 发送时间
   */
  time: number
}

/**
 * @see get_login_info
 */
declare interface LoginInfo {
  /**
   * QQ 号
   */
  user_id: number
  /**
   * 昵称
   */
  nickname: string
}

/**
 * @see get_stranger_info
 */
declare interface StrangerInfo extends LoginInfo {
  /**
   * 性别, male 或 female 或 unknown
   */
  sex: string
  /**
   * 年龄
   */
  age: number
}

/**
 * @see get_friend_list
 */
declare interface FriendInfo extends LoginInfo {
  /**
   * 备注名
   */
  remark: string
}

/**
 * @see get_group_member_info
 * @see get_group_member_list
 */
declare interface GroupMemberInfo extends StrangerInfo {
  /**
   * 群号
   */
  group_id: number
  /**
   * 群名片／备注
   */
  card: string
  /**
   * 地区
   */
  area: string
  /**
   * 加群时间戳
   */
  join_time: number
  /**
   * 最后发言时间戳
   */
  last_sent_time: number
  /**
   * 成员等级
   */
  level: string
  /**
   * 角色, owner 或 admin 或 member
   */
  role: string
  /**
   * 是否不良记录成员
   */
  unfriendly: boolean
  /**
   * 专属头衔
   */
  title: string
  /**
   * 专属头衔过期时间戳
   */
  title_expire_time: number
  /**
   * 是否允许修改群名片
   */
  card_changeable: boolean
}

/**
 * @see get_group_honor_info
 */
declare interface GroupHonorInfo {
  /**
   * 群号
   */
  group_id: number
  /**
   * 当前龙王, 仅 type 为 talkative 或 all 时有数据
   */
  current_talkative: (HonorInfo & {
    /**
     * 持续天数
     */
    day_count: number
  })
  /**
   * 历史龙王, 仅 type 为 talkative 或 all 时有数据
   */
  talkative_list: HonorInfoList
  /**
   * 群聊之火, 仅 type 为 performer 或 all 时有数据
   */
  performer_list: HonorInfoList
  /**
   * 群聊炽焰, 仅 type 为 legend 或 all 时有数据
   */
  legend_list: HonorInfoList
  /**
   * 冒尖小春笋, 仅 type 为 strong_newbie 或 all 时有数据
   */
  strong_newbie_list: HonorInfoList
  /**
   * 快乐之源, 仅 type 为 emotion 或 all 时有数据
   */
  emotion_list: HonorInfoList
}

/**
 * @see GroupHonorInfo
 */
declare interface HonorInfo extends LoginInfo {
  /**
   * 头像 URL
   */
  avatar: string
}

/**
 * @see GroupHonorInfo
 */
declare type HonorInfoList = Array<HonorInfo & {
  /**
   * 荣誉描述
   */
  description: string
}>

/**
 * @see get_version_info
 */
declare interface VersionInfo {
  /**
   * 应用标识, 如 mirai-native
   */
  app_name: string
  /**
   * 应用版本, 如 1.2.3
   */
  app_version: string
  /**
   * OneBot 标准版本, 如 v11
   */
  protocol_version: string
}

/**
 * @see get_group_system_msg
 */
declare interface GroupSystemMSG {
  /**
   * 邀请消息列表
   */
  invited_requests: {
    /**
     * 请求ID
     */
    request_id: number
    /**
     * 邀请者
     */
    invitor_uin: number
    /**
     * 邀请者昵称
     */
    invitor_nick: string
    /**
     * 群号
     */
    group_id: number
    /**
     * 群名
     */
    group_name: string
    /**
     * 是否已被处理
     */
    checked: boolean
    /**
     * 处理者, 未处理为0
     */
    actor: number
  }[] | null
  /**
   * 进群消息列表
   */
  join_requests: {
    /**
     * 请求ID
     */
    request_id: number
    /**
     * 请求者ID
     */
    requester_uin: number
    /**
     * 请求者昵称
     */
    requester_nick: string
    /**
     * 验证消息
     */
    message: string
    /**
     * 群号
     */
    group_id: number
    /**
     * 群名
     */
    group_name: string
    /**
     * 是否已被处理
     */
    checked: boolean
    /**
     * 处理者, 未处理为0
     */
    actor: number
  }[] | null
}

/**
 * @see get_group_file_system_info
 */
declare interface GroupFileSystemInfo {
  /**
   * 文件总数
   */
  file_count: number
  /**
   * 文件上限
   */
  limit_count: number
  /**
   * 已使用空间
   */
  used_space: number
  /**
   * 空间上限
   */
  total_space: number
}

/**
 * @see get_group_root_files
 * @see get_group_files_by_folder
 * @see get_group_root_files
 */
declare interface GroupRootFileSystemInfo {
  /**
   * 文件列表
   */
  files: GroupFileInfo[]
  /**
   * 文件夹列表
   */
  folders: GroupFolderInfo[]
}

/**
 * @see GroupRootFileSystemInfo
 */
declare interface GroupFileInfo {
  /**
   * 文件ID
   */
  file_id: string
  /**
   * 文件名
   */
  file_name: string
  /**
   * 文件类型
   */
  busid: number
  /**
   * 文件大小
   */
  file_size: number
  /**
   * 上传时间
   */
  upload_time: number
  /**
   * 过期时间,永久文件恒为0
   */
  dead_time: number
  /**
   * 最后修改时间
   */
  modify_time: number
  /**
   * 下载次数
   */
  download_times: number
  /**
   * 上传者ID
   */
  uploader: number
  /**
   * 上传者名字
   */
  uploader_name: string
}

/**
 * @see GroupRootFileSystemInfo
 */
declare interface GroupFolderInfo {
  /**
   * 文件夹ID
   */
  folder_id: string
  /**
   * 文件名
   */
  folder_name: string
  /**
   * 创建时间
   */
  create_time: number
  /**
   * 创建者
   */
  creator: number
  /**
   * 创建者名字
   */
  creator_name: string
  /**
   * 子文件数量
   */
  total_file_count: number
}

/**
 * @see get_status
 */
declare interface Status {
  /**
   * 表示BOT是否在线
   */
  online: boolean
  /**
   * 同 [`online`]{@link online}
   */
  goold: boolean
  /**
   * 运行统计
   */
  stat: {
    /**
     * 收到的数据包总数
     */
    packet_received: number
    /**
     * 发送的数据包总数
     */
    packet_sent: number
    /**
     * 数据包丢失总数
     */
    packet_lost: number
    /**
     * 接受信息总数
     */
    message_received: number
    /**
     * 发送信息总数
     */
    message_sent: number
    /**
     * TCP 链接断开次数
     */
    disconnect_times: number
    /**
     * 账号掉线次数
     */
    lost_times: number
  }
}

/**
 * @see get_group_at_all_remain
 */
declare interface GroupAtAllRemain {
  /**
   * 是否可以 @全体成员
   */
  can_at_all: boolean
  /**
   * 群内所有管理当天剩余 @全体成员 次数
   */
  remain_at_all_count_for_group: number
  /**
   * Bot 当天剩余 @全体成员 次数
   */
  remain_at_all_count_for_uin: number
}

/**
 * @see get_vip_info
 */
declare interface VipInfo extends LoginInfo {
  /**
   * QQ 等级
   */
  level: number
  /**
   * 等级加速度
   */
  level_speed: number
  /**
   * 会员等级
   */
  vip_level: string
  /**
   * 会员成长速度
   */
  vip_growth_speed: number
  /**
   * 会员成长总值
   */
  vip_growth_total: number
}

export type message = CQTag<any>[] | string
export type int64 = number | string
