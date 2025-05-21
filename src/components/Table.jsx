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
import authHeader from '../utils/authHeader'

const calibrationGrades = ['Топ', 'Отлично', 'Хорошо', 'Можешь лучше', 'Плохо']

//READ hook (get users from api)
function useGetUsers() {
  const user = useSelector((state) => state.userState.user)

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      const employees = await customFetch.get(`/employees`, {
        headers: authHeader(),
      })

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

const Table = ({ employeesFromStore }) => {
  const dispatch = useDispatch()
  const [validationErrors, setValidationErrors] = useState({})

  const columns = [
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      enableEditing: false,
      grow: true,
      size: 160,
      visibleInShowHideMenu: false,
    },
    {
      accessorKey: 'employeeName',
      header: 'Employee Name',
      enableEditing: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableEditing: false,
      Edit: () => null,
    },
    {
      accessorKey: 'level1',
      header: 'Level 1',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level2',
      header: 'Level 2',
      enableEditing: false,
      grow: true,
      size: 350,
    },
    {
      accessorKey: 'level3',
      header: 'Level 3',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level4',
      header: 'Level 4',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'level5',
      header: 'Level 5',
      enableEditing: false,
      grow: true,
      size: 300,
    },
    {
      accessorKey: 'startDate',
      header: 'Дата приема',
      enableEditing: false,
    },
    {
      accessorKey: 'positionEntryDate',
      header: 'В должности с',
      enableEditing: false,
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
      grow: true,
      minSize: 200,
    },
    {
      accessorKey: 'levelFromCeo',
      header: 'N- уровень',
      enableEditing: false,
    },
    {
      accessorKey: 'hasBonus',
      header: 'hasBonus',
      enableEditing: false,
      grow: true,
      size: 150,
      Edit: () => null,
    },
    {
      accessorKey: 'isManager',
      header: 'isManager',
      enableEditing: false,
      grow: true,
      size: 150,
      Edit: () => null,
    },
    {
      accessorKey: 'selfEvaluationPrevious',
      header: 'Самооценка H1 2024',
      enableEditing: false,
    },
    {
      accessorKey: 'selfEvaluation',
      header: 'Самооценка H2 2024',
      enableEditing: false,
      grow: true,
      minSize: 400,
    },
    {
      accessorKey: 'managerEvaluation',
      header: 'Оценка руководителя',
      enableEditing: false,
      grow: true,
      minSize: 250,
      enableHiding: false,
    },
    {
      accessorKey: 'managerEvaluationComment',
      header: 'Комментарий руководителя',
      enableEditing: false,
      grow: true,
      minSize: 300,
    },
    {
      accessorKey: 'calibration',
      header: 'Calibration',
      muiEditTextFieldProps: {
        required: true,
      },
      editVariant: 'select',
      editSelectOptions: calibrationGrades,
    },
    {
      accessorKey: 'calibrationComment',
      header: 'Calibration Comment',
      muiEditTextFieldProps: {
        required: true,
      },
      grow: true,
      size: 250,
    },
    {
      accessorKey: 'feedbackPeer',
      header: 'Оценка от коллег',
      enableEditing: false,
      Edit: () => null,
    },
    {
      accessorKey: 'feedbackProjectsAndTasks',
      header: 'Проекты и задачи',
      enableEditing: false,
      Edit: () => null,
      grow: true,
      size: 350,
    },
    {
      accessorKey: 'feedbackCooperation',
      header: 'Взаимодействие',
      enableEditing: false,
      Edit: () => null,
      grow: true,
      size: 600,
    },
    {
      accessorKey: 'feedbackComment',
      header: 'Комментарии коллег',
      enableEditing: false,
      Edit: () => null,
      grow: true,
      size: 600,
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

    // muiTableBodyProps: {
    //   sx: {
    //     //stripe the rows, make odd rows a darker color
    //     '& tr:nth-of-type(odd) > td': {
    //       backgroundColor: '#f5f5f5',
    //     },
    //   },
    // },

    initialState: {
      columnVisibility: {
        email: false,
        targetBonusBudget: false,
        targetBonusSum: false,
      },
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

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant='p' className='font-bold'>
          Форма каллибровки
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 4fr)',
            gap: 3,
          }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant='text' table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title='Edit'>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

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
