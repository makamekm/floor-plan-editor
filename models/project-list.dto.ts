export interface ProjectDto {
  id: number;
  name: string;
}

export interface ProjectListItemDto {
  id: number;
  name: string;
}

export type ProjectListDto = ProjectListItemDto[];
