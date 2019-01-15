

export interface AssignModel {
  idSBJTS:number,
  idSB_SBJT_CONF:number,
  status:number,
  command:number,
  record_input:string,
  PUSH_TIME: Date;
  result: string,
  FINISHED_TIME: Date
  repush: number
  type: number
  scroll: number
}
