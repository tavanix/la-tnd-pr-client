import { useState } from 'react'
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'

import { useDispatch, useSelector } from 'react-redux'
import { editEmployee } from '../features/employees/employeesSlice'
import { customFetch } from '../utils'

const calibrationGrades = ['Топ', 'Отлично', 'Хорошо', 'Можешь лучше', 'Плохо']

//READ hook (get users from api)
function useGetUsers() {
  const user = useSelector((state) => state.userState.user)

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const employees = await customFetch.get(`/employees`)
      return null
    },
    refetchOnWindowFocus: false,
  })
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await customFetch.put(`/updateEmployee`, user)
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['employees'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
}

const Table = ({ employeesFromStore, approvedLevels = [] }) => {
  const dispatch = useDispatch()
  const [validationErrors, setValidationErrors] = useState({})

  const columns = [
    {
      accessorKey: 'employeeId',
      header: 'Табельный номер',
      enableEditing: false,
      grow: true,
      size: 160,
      visibleInShowHideMenu: false,
    },
    {
      accessorKey: 'employeeName',
      header: 'Сотрудник',
      enableEditing: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
      enableEditing: false,
      Edit: () => null,
    },
    {
      accessorKey: 'level1',
      header: 'Уровень 1',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level2',
      header: 'Уровень 2',
      enableEditing: false,
      grow: true,
      size: 350,
    },
    {
      accessorKey: 'level3',
      header: 'Уровень 3',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level4',
      header: 'Уровень 4',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level5',
      header: 'Уровень   5',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'positionTitle',
      header: 'Должность',
      enableEditing: false,
      grow: true,
      size: 350,
    },
    {
      accessorKey: 'directManager',
      header: 'Руководитель',
      enableEditing: false,
      enableHiding: false,
      grow: true,
      minSize: 200,
    },
    {
      accessorKey: 'startDate',
      header: 'Дата приема',
      enableEditing: false,

      Cell: ({ cell }) => {
        const raw = cell.getValue()
        if (!raw) return ''
        const [year, month, day] = raw.split('-')
        return `${day}.${month}.${year}`
      },
    },
    {
      accessorKey: 'positionEntryDate',
      header: 'Дата приема на должность',
      enableEditing: false,

      Cell: ({ cell }) => {
        const raw = cell.getValue()
        if (!raw) return ''
        const [year, month, day] = raw.split('-')
        return `${day}.${month}.${year}`
      },
    },
    {
      accessorKey: 'hasBonus',
      header: 'Бонус',
      enableEditing: false,
      grow: true,
      size: 150,
      Edit: () => null,
    },
    {
      accessorKey: 'levelFromCeo',
      header: 'Уровень от СЕО',
      enableEditing: false,
    },
    {
      accessorKey: 'isManager',
      header: 'Признак руководителя',
      enableEditing: false,
      grow: true,
      size: 150,
      Edit: () => null,
    },
    {
      accessorKey: 'target',
      header: 'Цели',
      enableEditing: false,
    },
    {
      accessorKey: 'areTargetsSetOnSelfReview',
      header: 'Цели поставлены до ревью',
      enableEditing: false,
      minSize: 300,
    },
    {
      accessorKey: 'selfEvaluation',
      header: 'Оценка реализации целей',
      enableEditing: false,
      grow: true,
      minSize: 200,
    },
    {
      accessorKey: 'selfEvaluationComment',
      header: 'Самооценка',
      enableEditing: false,
      enableHiding: false,
      grow: true,
      minSize: 400,
      muiEditTextFieldProps: {
        multiline: true,
        minRows: 1,
        sx: {
          // minHeight: '40%',
          maxHeight: '250px',
          overflowY: 'auto',
          paddingRight: '8px',
        },
      },
    },
    {
      accessorKey: 'managerEvaluation',
      header: 'Оценка руководителя',
      enableEditing: false,
      enableHiding: false,
      grow: true,
      minSize: 200,
      enableHiding: false,
    },
    {
      accessorKey: 'managerEvaluationComment',
      header: 'Комментарий к оценке руководителя',
      enableEditing: false,
      enableHiding: false,
      grow: true,
      minSize: 400,
      muiEditTextFieldProps: {
        multiline: true,
        minRows: 1,
        sx: {
          // minHeight: '30%',
          // maxHeight: '250px',
          overflowY: 'auto',
          paddingRight: '8px',
        },
      },
    },
    {
      accessorKey: 'calibration',
      header: 'Изменение оценки на калибровке',
      enableHiding: false,
      muiEditTextFieldProps: {
        required: true,
      },
      editVariant: 'select',
      editSelectOptions: calibrationGrades,
      minSize: 200,
    },
    {
      accessorKey: 'calibrationComment',
      header: 'Комментарий к изменению оценки',
      enableHiding: false,
      muiEditTextFieldProps: {
        required: true,
      },
      grow: true,
      minSize: 400,
      muiEditTextFieldProps: {
        multiline: true,
        minRows: 5,
        sx: {
          minHeight: '60%',
          maxHeight: '70%',
          overflowY: 'auto',
          paddingRight: '8px',
        },
      },
    },
    {
      accessorKey: 'managerEvaluationPrevious',
      header: 'Оценка ревью H2 2024',
      enableEditing: false,
      enableHiding: false,
      grow: true,
      minSize: 200,
    },

    {
      accessorKey: 'targetBonusBudget',
      header: 'targetBonusBudget',
      enableEditing: false,
      Edit: () => null,
      visibleInShowHideMenu: false,
    },
    {
      accessorKey: 'targetBonusSum',
      header: 'targetBonusSum',
      enableEditing: false,
      Edit: () => null,
      visibleInShowHideMenu: false,
    },
  ]

  //call READ hook
  const {
    // data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers()

  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    await updateUser(values)
    dispatch(editEmployee(values))
    table.setEditingRow(null) //exit editing mode
  }

  const table = useMaterialReactTable({
    columns,
    data: employeesFromStore,

    // createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default modal ('row', 'cell', 'table', and 'custom' are also available)

    enableEditing: true,
    enableStickyHeader: true,
    enableColumnResizing: true,

    displayColumnDefOptions: {
      'mrt-row-actions': {
        visibleInShowHideMenu: false, //hide the built-in row actions column from the show hide menu
      },
    },

    // muiTablePaperProps: ({ table }) => ({
    //   style: {
    //     zIndex: table.getState().isFullScreen ? 1000 : 2222222,
    //   },
    // }),

    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        '& tr:nth-of-type(odd) > td': {
          backgroundColor: '#f5f5f5',
        },
      },
    },

    initialState: {
      columnVisibility: {
        employeeId: false,
        email: false,
        level1: false,
        level2: false,
        level3: false,
        level4: false,
        level5: false,
        startDate: false,
        positionEntryDate: false,
        positionTitle: false,
        hasBonus: false,
        levelFromCeo: false,
        isManager: false,
        target: false,
        areTargetsSetOnSelfReview: false,
        selfEvaluation: false,
        targetBonusBudget: false,
        targetBonusSum: false,
      },
      density: 'compact',
    },

    muiTableBodyCellProps: {
      sx: {
        borderRight: '1px solid #f4eeee', //add a border between columns
      },
    },

    getRowId: (row) => row.id,

    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '400px',
        maxHeight: '500px',
      },
    },

    onEditingRowCancel: () => setValidationErrors({}),

    onEditingRowSave: handleSaveUser,

    muiEditRowDialogProps: ({ table, row, internalEditComponents }) => {
      return {
        maxWidth: 'xl',
        height: '100vh',
      }
    },

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
      // Списки колонок по группам
      const firstColIds = [
        'employeeName',
        'level2',
        'level3',
        'level4',
        'positionTitle',
        'directManager',
        'startDate',
        'positionEntryDate',
        'levelFromCeo',
        'email',
      ]
      const secondColIds = [
        'selfEvaluationComment',
        'managerEvaluation',
        'managerEvaluationComment',
      ]
      const thirdColIds = [
        'managerEvaluationPrevious',
        'calibration',
        'calibrationComment',
        'targetBonusBudget',
        'targetBonusSum',
      ]

      // Фильтруем internalEditComponents для каждой колонки
      const firstColComponents = internalEditComponents.filter(
        (comp) =>
          comp?.props?.cell?.column?.id &&
          firstColIds.includes(comp.props.cell.column.id)
      )
      const secondColComponents = internalEditComponents.filter(
        (comp) =>
          comp?.props?.cell?.column?.id &&
          secondColIds.includes(comp.props.cell.column.id)
      )
      const thirdColComponents = internalEditComponents.filter(
        (comp) =>
          comp?.props?.cell?.column?.id &&
          thirdColIds.includes(comp.props.cell.column.id)
      )

      return (
        <>
          <DialogTitle variant='p' className='font-bold'>
            Форма каллибровки
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1.5fr',
              gap: 3,
              maxHeight: '70vh', // ограничиваем высоту модалки
            }}
          >
            {/* Первая колонка */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2,
                overflowY: 'auto',
              }}
            >
              {firstColComponents}
            </Box>

            {/* Вторая колонка (комментарии) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2,
                overflowY: 'auto',
                maxHeight: '60vh',
                paddingRight: 1,
              }}
            >
              {secondColComponents}
            </Box>

            {/* Третья колонка (комментарии) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2,
                overflowY: 'auto',
                maxHeight: '60vh',
                paddingRight: 1,
              }}
            >
              {thirdColComponents}
            </Box>
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant='text' table={table} row={row} />
          </DialogActions>
        </>
      )
    },

    renderRowActions: ({ row, table }) => {
      const isApproved = approvedLevels
        .map((lvl) => lvl.level1)
        .includes(row.original.level1)

      if (isApproved) return <div className='ml-2'>Ok</div>

      return (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip title='Калибровать'>
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },

    state: {
      isLoading: isLoadingUsers,
      isSaving: isUpdatingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  })

  return <MaterialReactTable table={table} />
}

export default Table

// https://github.com/KevinVandy/material-react-table/blob/v3/apps/material-react-table-docs/examples/editing-crud-modal/sandbox/src/TS.tsx
