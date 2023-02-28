import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { StringUtil } from '../../global/utils/string.util';

@Table
export class Event extends Model {
  @Column
  eventName: string;

  @Column({
    type: DataTypes.DATE,
    get() {
      return new Date(this.getDataValue('date')).toLocaleDateString();
    },
  })
  date: Date;

  @Column({
    type: DataTypes.TIME,
    get() {
      return StringUtil.usTimeFormat(this.getDataValue('time'));
    },
  })
  time: string;

  @Column
  location: string;

  @Column
  image: string;

  @Column
  createdBy: number;
}
