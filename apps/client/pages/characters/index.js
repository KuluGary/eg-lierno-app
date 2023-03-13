import { getNestedKey } from "@lierno/core-helpers";
import { getCharacterSubtitle, getNpcSubtitle } from "@lierno/dnd-helpers";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import CircularProgress from "@mui/material/CircularProgress";
import { useMounted } from "hooks/useMounted";
import { useQueryState } from "hooks/useQueryState";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import Api from "services/api";

const FileUploaderModal = dynamic(() => import("components/FileUploaderModal/FileUploaderModal"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

const DeleteModal = dynamic(() => import("components/DeleteModal/DeleteModal"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

const PaginatedTable = dynamic(() => import("components/Table/PaginatedTable"), {
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", marginBlock: 4 }}>
      <CircularProgress />
    </Box>
  ),
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const uploadJsonFile = async (files, url, callback, refetch) => {
  const [file] = files;
  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = (e) => {
    const json = JSON.parse(e.target.result);

    Api.fetchInternal(url, { method: "POST", body: JSON.stringify(json) });

    if (!!callback) callback();
    if (!!refetch) refetch();
  };
};

export const deleteElement = async (id, url, callback, refetch) => {
  await Api.fetchInternal(`${url}/${id}`, { method: "DELETE" });

  if (!!refetch) refetch();
  if (!!callback) callback();
};

export default function Character() {
  const [value, setValue] = useQueryState("step", 0, "number");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasMounted = useMounted();

  const handleChange = (_, newValue) => setValue(newValue);

  const uploadFile = async (files) => {
    const [file] = files;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (e) => {
      const json = JSON.parse(e.target.result);

      setIsLoading(true);
      await Api.fetchInternal("/characters", { method: "POST", body: JSON.stringify(json) });
      setIsLoading(false);
      setOpenUploadModal(false);
    };
  };

  const handleOpenDeleteModal = (id) => {
    setElementToDelete(id);
    setOpenDeleteModal(true);
  };

  const deleteElement = async () => {
    setIsLoading(true);
    await Api.fetchInternal(elementToDelete, { method: "DELETE" });
    setElementToDelete(null);
    setOpenDeleteModal(false);
    setIsLoading(false);
  };

  if (!hasMounted) return null;

  return (
    <Layout>
      <Head>
        <title>Lierno App | Mis personajes</title>
      </Head>
      <FileUploaderModal
        open={openUploadModal}
        onClose={() => {
          setElementToDelete(null);
          setOpenUploadModal(!openUploadModal);
        }}
        onSave={uploadFile}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal((openModal) => !openModal)}
        onSave={deleteElement}
      />
      <Container
        noPadding
        header={
          <Box sx={{ p: "1em" }}>
            <Typography variant="h3">Personajes</Typography>
          </Box>
        }
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Personajes" {...a11yProps(0)} />
            <Tab label="NPCs" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box
          component="div"
          role="tabpanel"
          hidden={value !== 0}
          id={`simple-tabpanel-${0}`}
          aria-labelledby={`simple-tab-${0}`}
        >
          {value === 0 && (
            <PaginatedTable
              getRowData={(element) => ({
                _id: getNestedKey("_id", element),
                id: getNestedKey("id", element),
                name: getNestedKey("name", element),
                avatar: getNestedKey("avatar", element),
                description: getNestedKey("personality", element),
                subtitle: (
                  <Box mt={0.5} mb={1}>
                    {getCharacterSubtitle({
                      flavor: { traits: { pronoun: element.pronoun } },
                      stats: { classes: element.classes, race: element.race },
                    })}
                  </Box>
                ),
                count: getNestedKey("count", element),
              })}
              loading={isLoading}
              fetchFrom={"/characters"}
              src={"/characters/{ID}"}
              onEdit={(id) => Router.push(`/characters/add/${id}`)}
              onDelete={(id) => handleOpenDeleteModal(`/characters/${id}`)}
              headerProps={{
                onAdd: () => Router.push("/characters/add"),
                onUpload: () => setOpenUploadModal(true),
              }}
            />
          )}
        </Box>
        <Box
          component="div"
          role="tabpanel"
          hidden={value !== 1}
          id={`simple-tabpanel-${1}`}
          aria-labelledby={`simple-tab-${1}`}
        >
          {value === 1 && (
            <PaginatedTable
              getRowData={(element) => ({
                _id: getNestedKey("_id", element),
                id: getNestedKey("id", element),
                name: getNestedKey("name", element),
                avatar: getNestedKey("avatar", element),
                description: getNestedKey("personality", element),
                subtitle: (
                  <Box mt={0.5} mb={1}>
                    {getNpcSubtitle({
                      flavor: { class: element.class },
                      stats: { race: element.race },
                    })}
                  </Box>
                ),
                count: getNestedKey("count", element),
              })}
              loading={isLoading}
              fetchFrom={"/npcs"}
              src={"/npcs/{ID}"}
              onEdit={(id) => Router.push(`/npcs/add/${id}`)}
              onDelete={(id) => handleOpenDeleteModal(`/npc/${id}`)}
              headerProps={{
                onAdd: () => Router.push("/npcs/add"),
              }}
            />
          )}
        </Box>
      </Container>
    </Layout>
  );
}
