import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  CardContent,
  CardActions,
  Fab,
  Button,
  Box,
} from "@material-ui/core";
import {
  useProjectState,
  useProjectDispatch,
  deleteProject,
  createProject,
  updateProject,
} from "../contexts";
import { Link } from "react-router-dom";
import { Delete, Add, Edit } from "@material-ui/icons";
import { routes } from "../constants";
import { formatDateTime } from "../_helpers/format.helper";
import { ProjectForm } from "../components/ProjectForm";
import { useSnackbar } from "notistack";
import { BaseModal } from "../components/BaseModal";
import { ProjectDto } from "../types";
import { ImageComparison } from "../types/imageComparison";

const defaultProject: ProjectDto = {
  id: "",
  name: "",
  mainBranchName: "",
  ignoreAntialiasing: true,
  autoApproveFeature: true,
  diffDimensionsFeature: true,
  threshold: 0.1,
  imageComparison: ImageComparison.pixelmatch,
};

const ProjectsListPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const projectState = useProjectState();
  const projectDispatch = useProjectDispatch();

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [project, setProject] = React.useState(defaultProject);

  const toggleCreateDialogOpen = () => {
    setCreateDialogOpen(!createDialogOpen);
  };

  const toggleUpdateDialogOpen = () => {
    setUpdateDialogOpen(!updateDialogOpen);
  };

  const toggleDeleteDialogOpen = () => {
    setDeleteDialogOpen(!deleteDialogOpen);
  };

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box
            height="100%"
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => {
                toggleCreateDialogOpen();
                setProject(defaultProject);
              }}
            >
              <Add />
            </Fab>
          </Box>

          <BaseModal
            open={createDialogOpen}
            title={"Create Project"}
            submitButtonText={"Create"}
            onCancel={toggleCreateDialogOpen}
            content={<ProjectForm projectState={[project, setProject]} />}
            onSubmit={() =>
              createProject(projectDispatch, project)
                .then((project) => {
                  toggleCreateDialogOpen();
                  enqueueSnackbar(`${project.name} created`, {
                    variant: "success",
                  });
                })
                .catch((err) =>
                  enqueueSnackbar(err, {
                    variant: "error",
                  })
                )
            }
          />

          <BaseModal
            open={updateDialogOpen}
            title={"Update Project"}
            submitButtonText={"Update"}
            onCancel={toggleUpdateDialogOpen}
            content={<ProjectForm projectState={[project, setProject]} />}
            onSubmit={() =>
              updateProject(projectDispatch, project)
                .then((project) => {
                  toggleUpdateDialogOpen();
                  enqueueSnackbar(`${project.name} updated`, {
                    variant: "success",
                  });
                })
                .catch((err) =>
                  enqueueSnackbar(err, {
                    variant: "error",
                  })
                )
            }
          />

          <BaseModal
            open={deleteDialogOpen}
            title={"Delete Project"}
            submitButtonText={"Delete"}
            onCancel={toggleDeleteDialogOpen}
            content={
              <Typography>{`Are you sure you want to delete: ${project.name}?`}</Typography>
            }
            onSubmit={() =>
              deleteProject(projectDispatch, project.id)
                .then((project) => {
                  toggleDeleteDialogOpen();
                  enqueueSnackbar(`${project.name} deleted`, {
                    variant: "success",
                  });
                })
                .catch((err) =>
                  enqueueSnackbar(err, {
                    variant: "error",
                  })
                )
            }
          />
        </Grid>
        {projectState.projectList.map((project) => (
          <Grid item xs={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography>Id: {project.id}</Typography>
                <Typography>Name: {project.name}</Typography>
                <Typography>Main branch: {project.mainBranchName}</Typography>
                <Typography>
                  Created: {formatDateTime(project.createdAt)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" component={Link} to={`${project.id}`}>
                  Builds
                </Button>
                <Button
                  color="primary"
                  component={Link}
                  to={`${routes.VARIATION_LIST_PAGE}/${project.id}`}
                >
                  Variations
                </Button>
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    toggleUpdateDialogOpen();
                    setProject(project);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    toggleDeleteDialogOpen();
                    setProject(project);
                  }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectsListPage;
