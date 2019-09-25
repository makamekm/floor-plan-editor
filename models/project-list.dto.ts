export interface ProjectDto {
  id: number | string;
  name: string;
}

export interface ProjectListItemDto {
  id: number | string;
  name: string;
}

export type ProjectListDto = ProjectListItemDto[];
