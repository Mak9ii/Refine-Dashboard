import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoardContainer,
  KanbanBoard,
} from "@/components/tasks/kanban/board";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
import KanbanColumn from "@/components/tasks/kanban/colum";
import KanbanItem from "@/components/tasks/kanban/item";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TasksQuery, TaskStagesQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React, { useMemo } from "react";
type Task = GetFieldsFromList<TasksQuery>;
type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };
export const TasksList = ({ children }: React.PropsWithChildren) => {
  const { replace } = useNavigation();
  const { mutate: updateTask } = useUpdate();
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [{ field: "createdAt", order: "asc" }],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });
  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [{ field: "dueDate", order: "asc" }],
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
    queryOptions: {
      enabled: !!stages,
    },
  });
  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data)
      return { unAssignedStages: [], stages: [] };
    const unAssignedStages = tasks?.data.filter(
      (task) => task.stageId === null
    );
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks?.data.filter((task) => task.stageId === stage.id),
    }));
    return { unAssignedStages, columns: grouped };
  }, [stages, tasks]);
  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned" ? "new" : `new?stageId=${args.stageId}`;
    replace(path);
  };
  const handleOnDragEnd = (e: DragEndEvent) => {
    let stageId = (e.over?.id as string) || undefined || null;
    const taskId = e.active.id?.toString();
    const taskStageId = e.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }
    updateTask({
      resource: "tasks",
      id: taskId,
      values: { stageId: stageId },
      mutationMode: "optimistic",
      successNotification: false,
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };
  const isLoading = isLoadingStages || isLoadingTasks;
  if (isLoading) return <PageSkeleton />;
  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title="unassigned"
            count={taskStages.unAssignedStages?.length || 0}
            onAddClick={() => {
              handleAddCard({ stageId: "unassigned" });
            }}
          >
            {taskStages.unAssignedStages.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stageId: "unassigned" }}
              >
                <ProjectCardMemo
                  {...task}
                  dueDate={task.dueDate || undefined}
                />
              </KanbanItem>
            ))}
            {!taskStages.unAssignedStages?.length && (
              <KanbanAddCardButton
                onClick={() => {
                  handleAddCard({ stageId: "unassigned" });
                }}
              />
            )}
          </KanbanColumn>
          {taskStages.columns?.map((column) => (
            <KanbanColumn
              id={column.id}
              key={column.id}
              title={column.title}
              count={column.tasks?.length || 0}
              onAddClick={() => {}}
            >
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!column.tasks?.length && (
                <KanbanAddCardButton
                  onClick={() => {
                    handleAddCard({ stageId: column.id });
                  }}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const cardCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <KanbanColumnSkeleton key={colIndex}>
          {Array.from({ length: cardCount }).map((_, cardIndex) => (
            <ProjectCardSkeleton key={cardIndex} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
