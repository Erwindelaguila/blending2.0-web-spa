"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import { Add24Regular, Delete24Filled, Edit24Filled, Info24Filled } from "@fluentui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { IParametroResponse, ParametroFiltersParams, PagedParametroResponse } from "@/interface/admin/parametro";
import { ParametrosService } from "@/services/parametros.service";
import { useAuth } from "@/hooks/use-auth";
import { useParametroContext } from "./parametro-context";
import { buildPaginatedSWRKey } from "@/utils/swr-keys";
import { PAGINATION_CONFIG } from "@/config/pagination.config";
import { ParametroPanel } from "./parametro-panel";

const columns = [
	{ uid: "codigo", name: "Codigo", width: 5 },
	{ uid: "nombre", name: "Nombre", width: 5 },
	{ uid: "descripcion", name: "Descripción", width: 15 },
	{ uid: "activo", name: "Estado", width: 7 },
	{ uid: "action", name: "Acciones", width: 5 },
];

const buildParametrosKey = (page: number, size: number, filters?: ParametroFiltersParams) => {
	return buildPaginatedSWRKey("parametros", page, size, filters);
};

export function TableParametros() {
	const style = useButtonsStyles();
	const deleteAction = useAsyncAction();
	const { user } = useAuth();
	const { filters } = useParametroContext();

	const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
	const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

	const serviceFilters: ParametroFiltersParams | undefined = useMemo(() => {
		if (!filters || Object.keys(filters).length === 0) return undefined;
		return {
			codigo: filters.codigo || undefined,
			estado: filters.estado,
			fechaDesde: filters.fechaDesde ? filters.fechaDesde.toISOString().split("T")[0] : undefined,
		};
	}, [filters]);

	const swrKey = buildParametrosKey(page, pageSize, serviceFilters);

	useEffect(() => {
		setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
	}, [serviceFilters]);

	const { data, isLoading, error } = useSWR<BaseResponse<PagedParametroResponse>>(
		swrKey,
		() => ParametrosService.listar(page, pageSize, serviceFilters),
		{ revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
	);

	const respData = data?.data;
	const items: IParametroResponse[] = respData?.data ?? [];
	const {
		currentPage: paginationCurrentPage = page,
		totalPages: paginationTotalPages = 1,
		totalCount: paginationTotalItems = 0,
		hasPrevious,
		hasNext,
		previousPage,
		nextPage,
	} = respData?.pagination ?? {};

	const handlePageChange = (newPage: number) => {
		if (newPage !== page && newPage >= 1 && newPage <= paginationTotalPages) {
			setPage(newPage);
		}
	};

	const [openPanel, setOpenPanel] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
	const [idParametro, setIdParametro] = useState<string | undefined>(undefined);
	const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);

	const handleOpenCrear = () => {
		setMode("crear");
		setIdParametro(undefined);
		setOpenPanel(true);
	};

	const handleOpenEditar = (registroId: string) => {
		setMode("editar");
		setIdParametro(registroId);
		setOpenPanel(true);
	};

	const handleOpenDetalle = (registroId: string) => {
		setMode("detalle");
		setIdParametro(registroId);
		setOpenPanel(true);
	};

	const handleClosePanel = () => {
		setOpenPanel(false);

		setTimeout(() => {
			setIdParametro(undefined);
			setMode("crear");
		}, 30);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setInfoParametro(null);
		setIsClosingAfterSuccess(false);
		deleteAction.reset();
	};

	const [infoParametro, setInfoParametro] = useState<{
		id: string;
		codigo: string;
	} | null>(null);

	const handlePanelSuccess = () => {
		for (let i = 1; i <= paginationTotalPages + 2; i++) {
			mutate(buildParametrosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
		}
		
		if (mode === "crear") {
			const newTotal = paginationTotalItems + 1;
			const newLastPage = Math.ceil(newTotal / pageSize);
			setPage(newLastPage);
			mutate(buildParametrosKey(newLastPage, pageSize, serviceFilters));
		} else {
			mutate(buildParametrosKey(page, pageSize, serviceFilters));
		}
	};

	const actionDeleteModal = async () => {
		if (!infoParametro) return;
		const userId = user?.id;
		if (!userId) throw new Error("No se encontró el id del usuario autenticado");
		
		await deleteAction.execute(
			async () => {
				await ParametrosService.eliminar(infoParametro.id, userId);
				return { success: true, message: "Parámetro eliminado correctamente" };
			},
			buildParametrosKey(page, pageSize, serviceFilters)
		);

		for (let i = 1; i <= paginationTotalPages + 1; i++) {
			mutate(buildParametrosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
		}
		
		mutate(buildParametrosKey(page, pageSize, serviceFilters));
		
		if (items.length === 1 && page > 1) {
			const prevPage = page - 1;
			setPage(prevPage);
			mutate(buildParametrosKey(prevPage, pageSize, serviceFilters));
		}
	};

	const renderCell = (item: any, columnKey: string) => {
		const parametro = item as IParametroResponse;
		switch (columnKey) {
			case "activo":
				const statusColorMap: Record<string, string> = {
					Activo: OrgColors.serotAzul,
					Inactivo: OrgColors.rojo,
				};
				return (
					<Badge
						appearance="filled"
						style={{
							backgroundColor:
								statusColorMap[parametro.activo ? "Activo" : "Inactivo"] || "#666",
							color: "#fff",
							width: "100%",
						}}
						size="large"
					>
						{parametro.activo ? "ACTIVO" : "INACTIVO"}
					</Badge>
				);
			case "action":
				return (
					<div className="flex gap-1 justify-center w-full py-0.5">
						<Tooltip content="Info Parámetro" relationship="label">
							<Button
								size="large"
								appearance="subtle"
								onClick={() => handleOpenDetalle(parametro.id)}
								icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
							/>
						</Tooltip>
						<Tooltip content="Editar Parámetro" relationship="label">
							<Button
								size="large"
								appearance="subtle"
								onClick={() => handleOpenEditar(parametro.id)}
								icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
							/>
						</Tooltip>

						<Tooltip content="Eliminar Parámetro" relationship="label">
							<Button
								size="large"
								appearance="subtle"
								onClick={() => {
									setInfoParametro({
										id: parametro.id,
										codigo: parametro.codigo,
									});
									setOpenModal(true);
								}}
								icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
							/>
						</Tooltip>
					</div>
				);
			default:
				return (parametro as any)[columnKey] ?? "";
		}
	};

	return (
			<Card style={{ width: "100%", height: "100%" }}>
				<div className="w-full h-full flex flex-col">
					<div className="w-full h-2/25 flex justify-between items-start">
						<Title title="Parámetros de Calidad" />
						<Button
							size="large"
							icon={<Add24Regular />}
							className={`w-[13rem] ${style.buttonVerdeBase}`}
							onClick={handleOpenCrear}
						>
							Nuevo
						</Button>
					</div>

					<div className="w-full h-23/25">
						<TableBase
							columns={columns}
							data={items}
							renderCell={renderCell}
							isLoading={isLoading}
							error={error}
							height="100%"
						/>
					</div>

					<div className="w-full h-1/10">
						{items.length > 0 && (
							<Pagination
								currentPage={paginationCurrentPage}
								totalPages={paginationTotalPages}
								totalItems={paginationTotalItems}
								onPageChange={handlePageChange}
								hasPrevious={hasPrevious}
								hasNext={hasNext}
								previousPage={previousPage}
								nextPage={nextPage}
							/>
						)}
					</div>
				</div>

				<ParametroPanel
					mode={mode}
					open={openPanel}
					close={handleClosePanel}
					id={idParametro}
					onSuccess={handlePanelSuccess}
				/>

				<ModalBase
					open={openModal}
					setOpen={(isOpen) => {
						if (!isOpen) {
							handleCloseModal();
						} else {
							setOpenModal(isOpen);
						}
					}}
					type="alert"
					buttonText="Eliminar"
					closeOnOutsideClick={false}
					buttonAction={actionDeleteModal}
					requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess}
				>
					<>
						{!deleteAction.isSuccess && (
							<>
								<div className="py-2">
									¿Seguro que desea eliminar el parámetro
									<span className="font-semibold"> {infoParametro?.codigo}</span>?
								</div>
							</>
						)}
						<AsyncActionDisplay
							state={deleteAction.state}
							loadingMessage={"Eliminando parámetro..."}
							successMessage={deleteAction.response?.message ?? "Se eliminó el parámetro correctamente"}
							onSuccess={() => {
								setIsClosingAfterSuccess(true);
								handleCloseModal();
							}}
						/>
					</>
				</ModalBase>
			</Card>
	);
}

